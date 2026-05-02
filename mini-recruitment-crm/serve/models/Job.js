import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        company: {
            type: String,
            required: true,
        },
        location: String,
        skillsRequired: [String],
        experienceRequired: Number,
        salary: Number,
        description: String,
        status: {
            type: String,
            enum: ["Open", "Closed"],
            default: "Open",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Job", jobSchema);