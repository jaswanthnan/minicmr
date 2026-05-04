import React, { useState, useEffect } from "react";
import { Modal, Select, Button, Typography, Space, Divider, Progress, Card, Spin, message, Tag } from "antd";
import axios from "axios";
import { RobotOutlined, CheckCircleOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const SmartMatchModal = ({ visible, onClose, candidate }) => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [loadingMatch, setLoadingMatch] = useState(false);
    const [matchResult, setMatchResult] = useState(null);

    useEffect(() => {
        if (visible) {
            fetchJobs();
            setMatchResult(null);
            setSelectedJob(null);
        }
    }, [visible]);

    const fetchJobs = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/jobs");
            setJobs(res.data);
        } catch (err) {
            console.error("Failed to fetch jobs", err);
        }
    };

    const handleMatch = async () => {
        if (!selectedJob) {
            message.warning("Please select a job to match against");
            return;
        }

        setLoadingMatch(true);
        try {
            const job = jobs.find(j => j._id === selectedJob);
            const res = await axios.post("http://localhost:5000/api/ai/match", {
                cvText: `Candidate Name: ${candidate.name}\nSkills: ${candidate.skills?.join(", ")}\nExperience: ${candidate.experience || "N/A"}`,
                jobDescription: `Job Title: ${job.title}\nRequirements: ${job.description}\nSkills: ${job.skillsRequired?.join(", ")}`
            });
            setMatchResult(res.data.matchAnalysis);
        } catch (err) {
            message.error("AI Match failed");
            console.error(err);
        } finally {
            setLoadingMatch(false);
        }
    };

    // Helper to parse match score from AI text if possible
    const getScore = (text) => {
        if (!text) return 0;
        // Look for X/100, Score: X, Match Score: X, etc.
        const match = text.match(/(\d+)\/100/) || text.match(/Score:\s*(\d+)/i) || text.match(/Match Score:\s*(\d+)/i);
        return match ? parseInt(match[1]) : 75; // Default to 75 if not found
    };

    // Helper to remove redundant score lines from the analysis text
    const getCleanedAnalysis = (text) => {
        if (!text) return "";
        return text
            .split('\n')
            .filter(line => !line.toLowerCase().includes('match score:') && !line.toLowerCase().includes('score:'))
            .join('\n')
            .trim();
    };

    return (
        <Modal
            title={<span><RobotOutlined style={{ color: '#4f46e5' }} /> AI Smart Match</span>}
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose} style={{ borderRadius: '8px' }}>Close</Button>,
                <Button key="submit" type="primary" loading={loadingMatch} onClick={handleMatch} style={{ background: '#4f46e5', borderRadius: '8px' }}>
                    Analyze Match
                </Button>
            ]}
            width={750}
            styles={{ 
                body: { 
                    padding: '24px',
                    backgroundColor: '#f8fafc' 
                } 
            }}
        >
            {/* Header: Fixed Selection Section */}
            <div style={{ 
                background: '#fff', 
                padding: '20px', 
                borderRadius: '16px', 
                marginBottom: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                border: '1px solid #f1f5f9'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                        <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Candidate</div>
                        <Text strong style={{ fontSize: '18px', color: '#1e293b' }}>{candidate?.name}</Text>
                    </div>
                </div>
                
                <div>
                    <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Select Target Role</div>
                    <Select
                        placeholder="Choose a job to compare against..."
                        style={{ width: '100%' }}
                        size="large"
                        onChange={value => setSelectedJob(value)}
                    >
                        {jobs.map(job => (
                            <Option key={job._id} value={job._id}>{job.title} — {job.company}</Option>
                        ))}
                    </Select>
                </div>
            </div>

            {/* Results: Scrollable Area */}
            <div style={{ 
                maxHeight: '450px', 
                overflowY: 'auto', 
                paddingRight: '8px',
                scrollbarWidth: 'thin'
            }}>
                {loadingMatch ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', background: '#fff', borderRadius: '16px' }}>
                        <Spin size="large" description="Our AI is cross-referencing skills and experience..." />
                    </div>
                ) : matchResult ? (
                    <Card variant="borderless" style={{ borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
                        <div style={{ textAlign: 'center', marginBottom: 32 }}>
                            <Title level={4} style={{ margin: 0, color: '#64748b', fontSize: '14px', textTransform: 'uppercase' }}>Match Score</Title>
                            <div style={{ marginTop: 16 }}>
                                <Progress 
                                    type="circle" 
                                    percent={getScore(matchResult)} 
                                    strokeWidth={8}
                                    size={160}
                                    format={percent => (
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '32px', fontWeight: 800, color: '#1e293b' }}>{percent}%</span>
                                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>MATCH</span>
                                        </div>
                                    )}
                                    strokeColor={{
                                        '0%': '#6366f1',
                                        '100%': '#22c55e',
                                    }}
                                />
                            </div>
                        </div>

                        <Divider style={{ margin: '24px 0' }}>
                            <Tag color="blue" icon={<RobotOutlined />}>AI Analysis</Tag>
                        </Divider>

                        <Title level={5} style={{ marginBottom: 16 }}>Detailed Breakdown</Title>
                        <Paragraph style={{ 
                            whiteSpace: 'pre-wrap', 
                            color: '#475569', 
                            lineHeight: '1.6',
                            fontSize: '14px',
                            background: '#f8fafc',
                            padding: '20px',
                            borderRadius: '12px',
                            border: '1px solid #f1f5f9'
                        }}>
                            {getCleanedAnalysis(matchResult)}
                        </Paragraph>

                        <div style={{ 
                            marginTop: 24, 
                            padding: '16px', 
                            background: '#f0fdf4', 
                            borderRadius: '12px', 
                            border: '1px solid #bbf7d0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12
                        }}>
                            <CheckCircleOutlined style={{ color: '#16a34a', fontSize: '20px' }} />
                            <Text style={{ color: '#166534', fontSize: '13px', fontWeight: 500 }}>
                                This recommendation was generated using real-time talent analysis and job requirements.
                            </Text>
                        </div>
                    </Card>
                ) : (
                    <div style={{ 
                        textAlign: 'center', 
                        color: '#94a3b8', 
                        padding: '60px 0', 
                        background: '#fff', 
                        borderRadius: '16px',
                        border: '2px dashed #e2e8f0'
                    }}>
                        <RobotOutlined style={{ fontSize: '48px', marginBottom: 16, color: '#cbd5e1' }} />
                        <Title level={5} style={{ color: '#64748b', margin: 0 }}>Ready to Match</Title>
                        <Text type="secondary">Select a job above to see how well {candidate?.name} fits the role.</Text>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default SmartMatchModal;
