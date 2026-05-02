import express from "express";

const router = express.Router();

// Helper to interact with Cloudflare Workers AI (Llama-3)
const callCloudflareAI = async (systemPrompt, userPrompt) => {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
        throw new Error("Cloudflare credentials not configured in .env");
    }

    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3-8b-instruct`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt },
                ],
            }),
        }
    );

    if (!response.ok) {
        const errData = await response.text();
        throw new Error(`Cloudflare AI Error: ${errData}`);
    }

    const data = await response.json();
    return data.result.response;
};

// Helper to truncate text to avoid exceeding context window limits
const truncateText = (text, maxLength = 10000) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

// Route: Summarize CV using Cloudflare AI
router.post("/summary", async (req, res) => {
    try {
        let { cvText, question } = req.body;
        if (!cvText) return res.status(400).json({ error: "CV text required" });

        // Truncate to stay within context window
        cvText = truncateText(cvText);

        const system = "You are an expert technical recruiter.";
        const prompt = question
            ? `Based on the following CV, answer the question: ${question}\n\nCV:\n${cvText}`
            : `Summarise this candidate CV in 5 concise bullet points highlighting key skills, experience, and education:\n\n${cvText}`;

        const summary = await callCloudflareAI(system, prompt);
        res.json({ summary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Cloudflare AI failed to generate summary" });
    }
});

// Route: Smart Job Match Suggestion using Cloudflare AI
router.post("/match", async (req, res) => {
    try {
        let { cvText, jobDescription } = req.body;
        if (!cvText || !jobDescription) {
            return res.status(400).json({ error: "Both cvText and jobDescription are required" });
        }

        cvText = truncateText(cvText, 5000);
        jobDescription = truncateText(jobDescription, 5000);

        const system = "You are an AI Recruitment matching engine. Analyze the provided CV against the Job Description. Give a Match Score (out of 100) and a brief justification of strengths and gaps.";
        const prompt = `CV Text:\n${cvText}\n\nJob Description:\n${jobDescription}\n\nPlease provide the match analysis.`;

        const matchAnalysis = await callCloudflareAI(system, prompt);
        res.json({ matchAnalysis });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Cloudflare AI failed to analyze job match" });
    }
});

// Route: Generate Job Description using Cloudflare AI
router.post("/generate-jd", async (req, res) => {
    try {
        const { role, experience, department, workMode, skills } = req.body;
        if (!role) return res.status(400).json({ error: "Job role is required" });

        const system = "You are an expert technical recruiter and job architect.";
        const prompt = `Generate a professional, comprehensive job description for the following position:
        - Role: ${role}
        - Experience: ${experience}
        - Department: ${department}
        - Work Mode: ${workMode}
        - Required Skills: ${skills.join(", ")}

        The job description should include:
        1. About the Role
        2. Key Responsibilities
        3. Required Qualifications & Skills
        4. Benefits & Perks (standard ones)`;

        const jobDescription = await callCloudflareAI(system, prompt);
        res.json({ jobDescription });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Cloudflare AI failed to generate job description" });
    }
});

export default router;