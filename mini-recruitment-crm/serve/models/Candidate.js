import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: String,
        skills: [String],
        experience: Number,
        location: String,
        status: {
            type: String,
            enum: ["Applied", "Shortlisted", "Interview", "Selected", "Rejected", "HIRED"],
            default: "Applied",
        },
        cvText: String,
        aiSummary: String,
    },
    { timestamps: true }
);

export default mongoose.model("Candidate", candidateSchema);