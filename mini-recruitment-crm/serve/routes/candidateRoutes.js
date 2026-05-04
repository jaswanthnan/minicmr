import express from "express";
import Candidate from "../models/Candidate.js";
import esClient from "../config/elasticsearch.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        console.log("POST /api/candidates - Body:", req.body);
        const candidate = await Candidate.create(req.body);

        // Optional Elasticsearch Indexing
        try {
            await esClient.index({
                index: "candidates",
                id: candidate._id.toString(),
                document: {
                    name: candidate.name,
                    email: candidate.email,
                    skills: candidate.skills,
                    experience: candidate.experience,
                    location: candidate.location,
                    status: candidate.status,
                },
            });
        } catch (esError) {
            console.error("Elasticsearch Indexing Failed:", esError.message);
        }

        res.status(201).json(candidate);
    } catch (error) {
        console.error("Candidate Creation Error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({ createdAt: -1 });
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (candidate) {
            // Optional Elasticsearch Indexing
            try {
                await esClient.index({
                    index: "candidates",
                    id: candidate._id.toString(),
                    document: {
                        name: candidate.name,
                        email: candidate.email,
                        skills: candidate.skills,
                        experience: candidate.experience,
                        location: candidate.location,
                        status: candidate.status,
                    },
                });
            } catch (esError) {
                console.error("Elasticsearch Update Failed:", esError.message);
            }
        }

        res.json(candidate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Candidate.findByIdAndDelete(req.params.id);

        // Optional Elasticsearch Deletion
        try {
            await esClient.delete({
                index: "candidates",
                id: req.params.id,
            });
        } catch (esError) {
            console.error("Elasticsearch Deletion Failed:", esError.message);
        }

        res.json({ message: "Candidate deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;