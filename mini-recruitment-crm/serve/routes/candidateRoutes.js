import express from "express";
import Candidate from "../models/Candidate.js";
import esClient from "../config/elasticsearch.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const candidate = await Candidate.create(req.body);

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

        res.status(201).json(candidate);
    } catch (error) {
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
        }

        res.json(candidate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Candidate.findByIdAndDelete(req.params.id);

        await esClient.delete({
            index: "candidates",
            id: req.params.id,
        });

        res.json({ message: "Candidate deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;