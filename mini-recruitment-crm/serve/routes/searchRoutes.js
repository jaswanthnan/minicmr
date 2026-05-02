import express from "express";
import esClient from "../config/elasticsearch.js";

const router = express.Router();

router.get("/candidates", async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ error: "Search query is required" });
        }

        const result = await esClient.search({
            index: "candidates",
            body: {
                query: {
                    multi_match: {
                        query: q,
                        fields: ["name", "email", "skills", "location", "status"],
                    },
                },
                aggs: {
                    skills: {
                        terms: { field: "skills.keyword", size: 10 }
                    },
                    status: {
                        terms: { field: "status.keyword", size: 5 }
                    }
                }
            }
        });

        const candidates = result.hits.hits.map((hit) => ({
            id: hit._id,
            ...hit._source,
        }));
        
        const facets = {
            skills: result.aggregations?.skills.buckets || [],
            status: result.aggregations?.status.buckets || []
        };

        res.json({ candidates, facets });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;