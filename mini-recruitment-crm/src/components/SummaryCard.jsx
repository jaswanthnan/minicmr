function SummaryCard({ summary }) {
    return (
        <div className="card">
            <h3>AI Generated Summary</h3>
            <p>{summary}</p>
        </div>
    );
}

export default SummaryCard;