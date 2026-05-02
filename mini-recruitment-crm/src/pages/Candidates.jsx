import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Typography, Divider, Alert, Button, Modal, Space, message } from "antd";
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
                margin: '-40px 0 32px 0',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Title level={3} style={{ margin: 0, color: '#1e293b', fontWeight: 700 }}>Candidates Management</Title>
            </div>

            {/* Content Section */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

                {/* Search Bar and Bulk Actions */}
                <div style={{ marginBottom: 24, padding: '16px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
                    <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                        Elasticsearch Powered Search
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Search
                            placeholder="Search by name, skills, email, or status..."
                            allowClear
                            enterButton="Search"
                            size="middle"
                            onSearch={handleSearch}
                            style={{ flex: 1, maxWidth: '600px' }}
                        />
                        <Space size="small">
                            {selectedCandidates.length > 0 && (
                                <>
                                    <Button
                                        icon={<ExportOutlined />}
                                        onClick={handleExport}
                                        style={{ borderRadius: '6px' }}
                                    >
                                        Export CSV
                                    </Button>
                                    <Button
                                        danger
                                        type="primary"
                                        icon={<DeleteOutlined />}
                                        onClick={handleDeleteSelected}
                                        style={{ borderRadius: '6px' }}
                                    >
                                        Delete ({selectedCandidates.length})
                                    </Button>
                                </>
                            )}
                            <Button
                                type="primary"
                                size="middle"
                                icon={<UserAddOutlined />}
                                style={{ backgroundColor: '#8b5cf6', borderColor: '#8b5cf6', borderRadius: '6px' }}
                                onClick={() => {
                                    setIsEdit(false);
                                    setEditData(null);
                                    setIsModalOpen(true);
                                }}
                            >
                                Add Candidate
                            </Button>
                        </Space>
                    </div>
                </div>

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