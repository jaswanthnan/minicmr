import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Input, Button, Card, Row, Col, Typography, Space, Tag, List, Divider, message, Modal, Select, Popconfirm } from "antd";
import { PlusOutlined, EnvironmentOutlined, DollarOutlined, SolutionOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [form] = Form.useForm();

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:5000/api/jobs");
            setJobs(res.data);
        } catch (err) {
            message.error("Failed to fetch jobs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const onFinish = async (values) => {
        try {
            const data = {
                ...values,
                skillsRequired: typeof values.skillsRequired === 'string' ? values.skillsRequired.split(",").map((s) => s.trim()) : values.skillsRequired,
                experienceRequired: Number(values.experienceRequired),
                salary: Number(values.salary),
            };

            if (isEdit && editData?._id) {
                await axios.put(`http://localhost:5000/api/jobs/${editData._id}`, data);
                message.success("Job updated successfully");
            } else {
                await axios.post("http://localhost:5000/api/jobs", data);
                message.success("Job posted successfully");
            }

            form.resetFields();
            setIsModalOpen(false);
            setEditData(null);
            fetchJobs();
        } catch (err) {
            message.error(isEdit ? "Failed to update job" : "Failed to post job");
        }
    };

    const handleEdit = (job) => {
        setEditData(job);
        setIsEdit(true);
        setIsModalOpen(true);
        form.setFieldsValue({
            ...job,
            skillsRequired: job.skillsRequired?.join(", "),
            status: job.status || "Open"
        });
    };

    return (
        <div style={{ padding: '0 0 24px 0' }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '40px 0',
                position: 'sticky',
                top: -40,
                zIndex: 10,
                background: '#f4f6f8',
                borderBottom: '1px solid #e2e8f0',
                margin: '-40px 0 32px 0'
            }}>
                <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>Job Board</Title>
                <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    style={{ borderRadius: '12px', height: '48px', background: '#4f46e5' }}
                    onClick={() => {
                        setIsEdit(false);
                        setEditData(null);
                        form.resetFields();
                        setIsModalOpen(true);
                    }}
                >
                    Post a New Job
                </Button>
            </div>

            <Divider />

            <Modal
                title={isEdit ? "Edit Job Posting" : "Post a New Job"}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setEditData(null);
                }}
                footer={null}
                width={600}
                styles={{
                    body: {
                        maxHeight: '70vh',
                        overflowY: 'auto',
                        paddingRight: '8px',
                    }
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item label="Job Title" name="title" rules={[{ required: true }]}>
                        <Input placeholder="e.g. Senior Frontend Engineer" />
                    </Form.Item>
                    <Form.Item label="Company" name="company" rules={[{ required: true }]}>
                        <Input placeholder="e.g. TechCorp" />
                    </Form.Item>
                    <Form.Item label="Location" name="location">
                        <Input prefix={<EnvironmentOutlined />} placeholder="e.g. Remote / New York" />
                    </Form.Item>
                    <Form.Item label="Skills (comma separated)" name="skillsRequired">
                        <Input placeholder="React, Node.js, AWS" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Exp (Years)" name="experienceRequired">
                                <Input type="number" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Salary" name="salary">
                                <Input prefix={<DollarOutlined />} type="number" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="Description" name="description">
                        <Input.TextArea rows={4} placeholder="Detailed job description..." />
                    </Form.Item>
                    <Form.Item label="Status" name="status" initialValue="Open">
                        <Select>
                            <Select.Option value="Open">Open</Select.Option>
                            <Select.Option value="Closed">Closed</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            {isEdit ? "Update Job" : "Post Job"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <List
                loading={loading}
                dataSource={jobs}
                grid={{
                    gutter: 24,
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 2,
                    xl: 2,
                    xxl: 2,
                }}
                renderItem={(job) => (
                    <List.Item style={{ height: '100%' }}>
                        <Card
                            key={job._id}
                            style={{ 
                                borderRadius: '16px', 
                                border: 'none', 
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden'
                            }}
                            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px' }}
                            hoverable
                            actions={[
                                <Button type="link" onClick={() => handleEdit(job)} style={{ fontWeight: 600 }}>Edit</Button>,
                                <Popconfirm
                                    title="Are you sure you want to delete this job?"
                                    onConfirm={async () => {
                                        await axios.delete(`http://localhost:5000/api/jobs/${job._id}`);
                                        fetchJobs();
                                        message.success("Job deleted successfully");
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button type="link" danger style={{ fontWeight: 600 }}>Delete</Button>
                                </Popconfirm>
                            ]}
                        >
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <Row justify="space-between" align="top" style={{ marginBottom: 4 }}>
                                    <Col span={18}>
                                        <Title level={4} style={{ margin: 0, fontWeight: 700, fontSize: '18px' }}>{job.title}</Title>
                                        <Text strong style={{ color: '#4f46e5', fontSize: '13px' }}>{job.company}</Text>
                                    </Col>
                                    <Col span={6} style={{ textAlign: 'right' }}>
                                        <Tag color={(job.status || 'Open') === 'Open' ? 'green' : 'red'} style={{ borderRadius: '6px', marginRight: 0, fontSize: '10px', padding: '0 8px' }}>
                                            {(job.status || 'Open').toUpperCase()}
                                        </Tag>
                                    </Col>
                                </Row>

                                <Space style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap' }}>
                                    <Tag icon={<DollarOutlined />} color="blue" style={{ borderRadius: '6px', border: 'none', background: '#eff6ff', color: '#3b82f6' }}>${job.salary?.toLocaleString()}</Tag>
                                    <Tag icon={<EnvironmentOutlined />} color="cyan" style={{ borderRadius: '6px', border: 'none', background: '#ecfeff', color: '#0891b2' }}>{job.location}</Tag>
                                </Space>

                                {/* Fixed height skills container with scroll if needed */}
                                <div style={{ 
                                    marginTop: 16, 
                                    height: '64px', 
                                    overflowY: 'auto',
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none'
                                }}>
                                    {job.skillsRequired?.map((skill, index) => (
                                        <Tag key={`${skill}-${index}`} color="purple" style={{ 
                                            borderRadius: '4px', 
                                            marginBottom: '6px', 
                                            background: '#f5f3ff', 
                                            border: 'none', 
                                            color: '#7c3aed',
                                            fontSize: '11px'
                                        }}>{skill}</Tag>
                                    ))}
                                </div>

                                <Divider dashed style={{ margin: '16px 0' }} />
                                
                                <div style={{ height: '40px', marginBottom: 12 }}>
                                    <Paragraph 
                                        ellipsis={{ rows: 2 }} 
                                        style={{ color: '#64748b', fontSize: '13px', margin: 0 }}
                                    >
                                        {job.description || "No description provided."}
                                    </Paragraph>
                                </div>

                                <div style={{ marginTop: 'auto' }}>
                                    <Space>
                                        <SolutionOutlined style={{ color: '#94a3b8' }} /> 
                                        <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500 }}>{job.experienceRequired}+ years experience</Text>
                                    </Space>
                                </div>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
}

export default Jobs;