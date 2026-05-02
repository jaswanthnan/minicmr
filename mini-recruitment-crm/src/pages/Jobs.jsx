import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Input, Button, Card, Row, Col, Typography, Space, Tag, List, Divider, message, Modal, Select } from "antd";
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
        <div style={{ padding: '24px' }}>
            <div style={{ 
                position: 'sticky', 
                top: -40, 
                zIndex: 10, 
                background: '#f4f6f8', 
                padding: '40px 0', 
                margin: '-40px 0 32px 0',
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: '1px solid #e2e8f0'
            }}>
                <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>Job Board</Title>
                <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
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
                renderItem={(job) => (
                    <Card
                        key={job._id}
                        style={{ marginBottom: 16 }}
                        hoverable
                        actions={[
                            <Button type="link" onClick={() => handleEdit(job)}>Edit</Button>,
                            <Button type="link" danger onClick={async () => {
                                await axios.delete(`http://localhost:5000/api/jobs/${job._id}`);
                                fetchJobs();
                            }}>Delete</Button>
                        ]}
                    >
                        <Row justify="space-between" align="top">
                            <Col>
                                <Title level={4} style={{ margin: 0 }}>{job.title}</Title>
                                <Text strong style={{ color: '#1890ff' }}>{job.company}</Text>
                            </Col>
                            <Col style={{ textAlign: 'right' }}>
                                <Space direction="vertical" align="end">
                                    <Space>
                                        <Tag color={(job.status || 'Open') === 'Open' ? 'green' : 'red'}>
                                            {(job.status || 'Open').toUpperCase()}
                                        </Tag>
                                        <Tag color="blue"><DollarOutlined /> ${job.salary?.toLocaleString()}</Tag>
                                    </Space>
                                    <Tag color="cyan" style={{ marginRight: 0 }}><EnvironmentOutlined /> {job.location}</Tag>
                                </Space>
                            </Col>
                        </Row>
                        <div style={{ marginTop: 12 }}>
                            {job.skillsRequired?.map((skill, index) => (
                                <Tag key={`${skill}-${index}`} color="purple">{skill}</Tag>
                            ))}
                        </div>
                        <Divider dashed style={{ margin: '12px 0' }} />
                        <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>
                            {job.description}
                        </Paragraph>
                        <Space>
                            <SolutionOutlined /> <Text type="secondary">{job.experienceRequired}+ years experience</Text>
                        </Space>
                    </Card>
                )}
            />
        </div>
    );
}

export default Jobs;