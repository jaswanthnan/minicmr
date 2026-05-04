import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Typography, Divider, Alert, Button, Modal, Space, message, Card } from "antd";
import { UserAddOutlined, ExportOutlined, DeleteOutlined } from "@ant-design/icons";
import CandidateForm from "../components/CandidateForm";
import CandidateTable from "../components/CandidateTable";

const { Search } = Input;
const { Title } = Typography;

function Candidates() {
    const [candidates, setCandidates] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [error, setError] = useState(null);

    const [selectedCandidates, setSelectedCandidates] = useState([]);

    const fetchCandidates = async () => {
        try {
            setError(null);
            const res = await axios.get("http://localhost:5000/api/candidates");
            setCandidates(res.data);
        } catch (err) {
            setError("Failed to fetch candidates from MongoDB.");
            console.error(err);
        }
    };

    const handleSearch = async (value) => {
        if (!value.trim()) {
            setIsSearching(false);
            fetchCandidates();
            return;
        }

        try {
            setIsSearching(true);
            setError(null);
            const res = await axios.get(`http://localhost:5000/api/search/candidates?q=${encodeURIComponent(value)}`);
            setCandidates(res.data.candidates || res.data);
        } catch (err) {
            setError("Elasticsearch query failed. Make sure Elasticsearch is running on port 9200.");
            console.error(err);
        }
    };

    const handleExport = () => {
        const dataToExport = selectedCandidates.length > 0 ? selectedCandidates : candidates;
        const csvRows = [
            ["Name", "Email", "Phone", "Status", "Skills"],
            ...dataToExport.map(c => [c.name, c.email, c.phone, c.status, c.skills?.join("; ")])
        ];

        const csvContent = csvRows.map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "candidates.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDeleteSelected = async () => {
        Modal.confirm({
            title: 'Delete Selected Candidates',
            content: `Are you sure you want to delete ${selectedCandidates.length} candidates?`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await Promise.all(selectedCandidates.map(c =>
                        axios.delete(`http://localhost:5000/api/candidates/${c._id || c.id}`)
                    ));
                    message.success("Selected candidates deleted successfully");
                    setSelectedCandidates([]);
                    fetchCandidates();
                } catch (err) {
                    message.error("Failed to delete some candidates");
                }
            },
        });
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    return (
        <div style={{ backgroundColor: '#f8fafc', padding: '0px', minHeight: '100%' }}>
            <div style={{
                position: 'sticky',
                top: -40,
                zIndex: 10,
                background: '#f8fafc',
                padding: '40px 0',
                margin: '-40px 0 0 0',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Title level={2} style={{ margin: 0, color: '#1e293b', fontWeight: 700 }}>Candidates Management</Title>
            </div>

            {/* Content Section */}
            <div style={{ marginTop: 32 }}>
                {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 24, borderRadius: '12px' }} />}

                {/* Search Bar and Bulk Actions */}
                <Card style={{ marginBottom: 32, borderRadius: '20px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
                        Advanced Search Engine
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Search
                            placeholder="Search by name, skills, email, or status..."
                            allowClear
                            enterButton="Search"
                            size="middle"
                            onSearch={handleSearch}
                            style={{ flex: 1 }}
                        />
                        <Button
                            type="primary"
                            size="large"
                            icon={<UserAddOutlined />}
                            style={{ background: '#4f46e5', borderRadius: '10px', fontWeight: 600, whiteSpace: 'nowrap' }}
                            onClick={() => {
                                setIsEdit(false);
                                setEditData(null);
                                setIsModalOpen(true);
                            }}
                        >
                            Add Candidate
                        </Button>
                        {selectedCandidates.length > 0 && (
                            <Space size="small">
                                <Button
                                    icon={<ExportOutlined />}
                                    onClick={handleExport}
                                    style={{ borderRadius: '10px' }}
                                >
                                    Export CSV
                                </Button>
                                <Button
                                    danger
                                    type="primary"
                                    icon={<DeleteOutlined />}
                                    onClick={handleDeleteSelected}
                                    style={{ borderRadius: '10px' }}
                                >
                                    Delete ({selectedCandidates.length})
                                </Button>
                            </Space>
                        )}
                    </div>
                </Card>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Title level={4} style={{ margin: 0, fontSize: '18px' }}>
                        {isSearching ? "Search Results" : "All Candidates"}
                    </Title>
                </div>

                <CandidateTable
                    candidates={candidates}
                    refresh={fetchCandidates}
                    onSelectionChange={setSelectedCandidates}
                    onEdit={(candidate) => {
                        setEditData(candidate);
                        setIsEdit(true);
                        setIsModalOpen(true);
                    }}
                />
            </div>

            <Modal
                title={isEdit ? "Edit Candidate" : "Add New Candidate"}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditData(null);
                }}
                footer={null}
                width={700}
                styles={{
                    body: {
                        maxHeight: '70vh',
                        overflowY: 'auto',
                        paddingRight: '8px',
                    }
                }}
            >
                <CandidateForm
                    isEdit={isEdit}
                    editData={editData}
                    refresh={() => { fetchCandidates(); setIsModalOpen(false); }}
                />
            </Modal>

        </div>
    );
}

export default Candidates;