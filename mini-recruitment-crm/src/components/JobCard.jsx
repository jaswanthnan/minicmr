import axios from "axios";

function JobCard({ job, refresh }) {
    const deleteJob = async () => {
        await axios.delete(`http://localhost:5000/api/jobs/${job._id}`);
        refresh();
    };

    return (
        <div className="card">
            <h3>{job.title}</h3>
            <p>Company: {job.company}</p>
            <p>Location: {job.location}</p>
            <p>Skills: {job.skillsRequired?.join(", ")}</p>
            <p>Experience: {job.experienceRequired} years</p>
            <p>Salary: ₹{job.salary}</p>
            <p>{job.description}</p>

            <button onClick={deleteJob}>Delete Job</button>
        </div>
    );
}

export default JobCard;