import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Statistic, Button, Space, Modal, Table, Tag, Avatar } from 'antd';
import { UserOutlined, FileTextOutlined, CheckCircleOutlined, UserAddOutlined, PlusCircleOutlined, MoreOutlined, RocketOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const { Title } = Typography;

const colors = ['#8b5cf6', '#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

export default function Dashboard({ setPage }) {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState([]);
  const [modalType, setModalType] = useState("candidates"); // 'candidates' or 'jobs'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candidatesRes, jobsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/candidates'),
          axios.get('http://localhost:5000/api/jobs')
        ]);
        setCandidates(candidatesRes.data);
        setJobs(jobsRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalCandidates = candidates.length;
  const totalJobs = jobs.length;
  const hiredCandidates = candidates.filter(c => (c.status || '').toUpperCase() === 'HIRED' || (c.status || '').toUpperCase() === 'ACTIVE').length; // Adjusting for case/values
  const openJobs = jobs.filter(j => (j.status || 'Open') === 'Open').length;

  const showModal = (title, data, type) => {
    setModalTitle(title);
    setModalData(data);
    setModalType(type);
    setIsModalOpen(true);
  };

  const candidateColumns = [
    {
      title: 'NAME',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar style={{ backgroundColor: record.color || '#87d068' }}>{text ? text[0].toUpperCase() : 'U'}</Avatar>
          {text}
        </Space>
      ),
    },
    { title: 'EMAIL', dataIndex: 'email', key: 'email' },
    { title: 'PHONE', dataIndex: 'phone', key: 'phone' },
    {
      title: 'SKILLS',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills) => (
        <Space size={[0, 4]} wrap>
          {skills?.slice(0, 3).map((skill, index) => (
            <Tag color="purple" key={`${skill}-${index}`}>
              {skill}
            </Tag>
          ))}
          {skills?.length > 3 && (
            <Tag color="default" style={{ borderStyle: 'dashed' }}>
              +{skills.length - 3}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status?.toUpperCase() === 'HIRED' || status?.toUpperCase() === 'ACTIVE' ? 'blue' : 'volcano'}>
          {status || 'Pending'}
        </Tag>
      ),
    },
  ];

  const jobColumns = [
    { title: 'TITLE', dataIndex: 'title', key: 'title' },
    { title: 'COMPANY', dataIndex: 'company', key: 'company' },
    { title: 'LOCATION', dataIndex: 'location', key: 'location' },
    {
      title: 'SKILLS REQUIRED',
      dataIndex: 'skillsRequired',
      key: 'skillsRequired',
      render: (skills) => (
        <Space size={[0, 4]} wrap>
          {skills?.slice(0, 3).map((skill, index) => (
            <Tag color="geekblue" key={`${skill}-${index}`}>
              {skill}
            </Tag>
          ))}
          {skills?.length > 3 && (
            <Tag color="default" style={{ borderStyle: 'dashed' }}>
              +{skills.length - 3}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'SALARY',
      dataIndex: 'salary',
      key: 'salary',
      render: (val) => `$${val?.toLocaleString()}`
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={(status || 'Open') === 'Open' ? 'green' : 'orange'}>
          {status || 'Open'}
        </Tag>
      ),
    },
  ];

  const getPipelineData = () => {
    const statusCounts = {};
    candidates.forEach(c => {
      const status = (c.status || 'UNKNOWN').toUpperCase();
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const colorsArr = ['#8b5cf6', '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#64748b'];
    return Object.keys(statusCounts).map((status, index) => ({
      name: status,
      value: statusCounts[status],
      color: colorsArr[index % colorsArr.length]
    }));
  };

  const getJobStatusesData = () => {
    const statusCounts = {};
    jobs.forEach(j => {
      const status = j.status || 'Open';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return Object.keys(statusCounts).map(status => ({
      name: status,
      value: statusCounts[status]
    }));
  };

  const pipelineData = getPipelineData();
  const jobStatusesData = getJobStatusesData();

  if (loading) return <div style={{ padding: 24 }}>Loading Dashboard...</div>;

  return (
    <div>
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
        <Title level={2} style={{ margin: 0, color: '#1e293b', fontWeight: 700 }}>Analytics Dashboard</Title>
        <Space size="middle">
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            size="large"
            style={{ borderRadius: '8px' }}
            onClick={() => setPage('candidates')}
          >
            Add Candidate
          </Button>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            size="large"
            style={{ borderRadius: '8px', backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' }}
            onClick={() => setPage('jobs')}
          >
            Post a Job
          </Button>
        </Space>
      </div>

      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card
            hoverable
            onClick={() => showModal("Total Candidates", candidates, "candidates")}
            variant="borderless"
            style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', cursor: 'pointer' }}
          >
            <Statistic
              title={<span style={{ color: '#94a3b8' }}>Total Candidates</span>}
              value={totalCandidates}
              styles={{ content: { color: '#3b82f6', fontWeight: 600, fontSize: 32 } }}
              prefix={<UserOutlined style={{ marginRight: 8 }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            onClick={() => showModal("Total Jobs", jobs, "jobs")}
            variant="borderless"
            style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', cursor: 'pointer' }}
          >
            <Statistic
              title={<span style={{ color: '#94a3b8' }}>Total Jobs</span>}
              value={totalJobs}
              styles={{ content: { color: '#8b5cf6', fontWeight: 600, fontSize: 32 } }}
              prefix={<FileTextOutlined style={{ marginRight: 8 }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            onClick={() => showModal("Hired Candidates", candidates.filter(c => (c.status || '').toUpperCase() === 'HIRED' || (c.status || '').toUpperCase() === 'ACTIVE'), "candidates")}
            variant="borderless"
            style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', cursor: 'pointer' }}
          >
            <Statistic
              title={<span style={{ color: '#94a3b8' }}>Hired</span>}
              value={hiredCandidates}
              styles={{ content: { color: '#10b981', fontWeight: 600, fontSize: 32 } }}
              prefix={<CheckCircleOutlined style={{ marginRight: 8 }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            onClick={() => showModal("Open Jobs", jobs.filter(j => (j.status || 'Open') === 'Open'), "jobs")}
            variant="borderless"
            style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', cursor: 'pointer' }}
          >
            <Statistic
              title={<span style={{ color: '#94a3b8' }}>Open Jobs</span>}
              value={openJobs}
              styles={{ content: { color: '#f59e0b', fontWeight: 600, fontSize: 32 } }}
              prefix={<RocketOutlined style={{ marginRight: 8 }} />}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={modalTitle}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={1000}
      >
        <Table
          dataSource={modalData}
          columns={modalType === "candidates" ? candidateColumns : jobColumns}
          rowKey={record => record._id || record.id}
          pagination={{ pageSize: 5 }}
          size="large"
        />
      </Modal>

      <Row gutter={24}>
        <Col span={12}>
          <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%' }}>
            <Typography.Title level={5} style={{ marginBottom: 24, color: '#334155' }}>Candidate Pipeline</Typography.Title>
            <div style={{ width: '100%', height: 300, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pipelineData}
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: '100%' }}>
            <Typography.Title level={5} style={{ marginBottom: 24, color: '#334155' }}>Job Statuses</Typography.Title>
            <div style={{ width: '100%', height: 300, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobStatusesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[10, 10, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}