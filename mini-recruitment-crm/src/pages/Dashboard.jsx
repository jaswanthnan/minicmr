import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Statistic, Button, Space, Modal, Table, Tag, Avatar, Popover } from 'antd';
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
      render: (skills) => {
        const overflow = skills?.slice(3) || [];
        return (
          <Space size={[0, 4]} wrap>
            {skills?.slice(0, 3).map((skill, index) => (
              <Tag color="purple" key={`${skill}-${index}`}>
                {skill}
              </Tag>
            ))}
            {overflow.length > 0 && (
              <Popover
                content={
                  <Space size={[4, 4]} wrap style={{ maxWidth: 260 }}>
                    {overflow.map((skill, i) => (
                      <Tag color="purple" key={`overflow-${i}`}>{skill}</Tag>
                    ))}
                  </Space>
                }
                title="All Skills"
                trigger="click"
              >
                <Tag
                  color="default"
                  style={{ borderStyle: 'dashed', cursor: 'pointer' }}
                >
                  +{overflow.length}
                </Tag>
              </Popover>
            )}
          </Space>
        );
      },
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
      render: (skills) => {
        const overflow = skills?.slice(3) || [];
        return (
          <Space size={[0, 4]} wrap>
            {skills?.slice(0, 3).map((skill, index) => (
              <Tag color="geekblue" key={`${skill}-${index}`}>
                {skill}
              </Tag>
            ))}
            {overflow.length > 0 && (
              <Popover
                content={
                  <Space size={[4, 4]} wrap style={{ maxWidth: 260 }}>
                    {overflow.map((skill, i) => (
                      <Tag color="geekblue" key={`overflow-${i}`}>{skill}</Tag>
                    ))}
                  </Space>
                }
                title="All Skills"
                trigger="click"
              >
                <Tag
                  color="default"
                  style={{ borderStyle: 'dashed', cursor: 'pointer' }}
                >
                  +{overflow.length}
                </Tag>
              </Popover>
            )}
          </Space>
        );
      },
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

  const getTopSkillsData = () => {
    const skillCounts = {};
    jobs.forEach(j => {
      (j.skillsRequired || []).forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });
    return Object.keys(skillCounts)
      .map(skill => ({ name: skill, count: skillCounts[skill] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  };

  const topSkillsData = getTopSkillsData();
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
        <Title level={2} style={{ margin: 0, color: '#1e293b', fontWeight: 700 }}>Recruitment Intelligence</Title>
        <Space size="middle">
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            size="large"
            style={{ borderRadius: '12px', height: '48px', background: '#4f46e5' }}
            onClick={() => setPage('candidates')}
          >
            Add Candidate
          </Button>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            size="large"
            style={{ borderRadius: '12px', height: '48px', backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' }}
            onClick={() => setPage('jobs')}
          >
            Post a Job
          </Button>
        </Space>
      </div>

      <Row gutter={24} style={{ marginBottom: 32 }}>
        <Col span={6}>
          <Card
            hoverable
            onClick={() => showModal("Total Candidates", candidates, "candidates")}
            variant="borderless"
            style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', cursor: 'pointer', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}
          >
            <Statistic
              title={<span style={{ color: '#64748b', fontWeight: 500 }}>Total Talent</span>}
              value={totalCandidates}
              styles={{ content: { color: '#3b82f6', fontWeight: 700, fontSize: 32 } }}
              prefix={<div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                <UserOutlined style={{ color: '#3b82f6', fontSize: 20 }} />
              </div>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            onClick={() => showModal("Total Jobs", jobs, "jobs")}
            variant="borderless"
            style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', cursor: 'pointer', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}
          >
            <Statistic
              title={<span style={{ color: '#64748b', fontWeight: 500 }}>Active Roles</span>}
              value={totalJobs}
              styles={{ content: { color: '#8b5cf6', fontWeight: 700, fontSize: 32 } }}
              prefix={<div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                <FileTextOutlined style={{ color: '#8b5cf6', fontSize: 20 }} />
              </div>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            onClick={() => showModal("Hired Candidates", candidates.filter(c => (c.status || '').toUpperCase() === 'HIRED' || (c.status || '').toUpperCase() === 'ACTIVE'), "candidates")}
            variant="borderless"
            style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', cursor: 'pointer', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}
          >
            <Statistic
              title={<span style={{ color: '#64748b', fontWeight: 500 }}>Hired</span>}
              value={hiredCandidates}
              styles={{ content: { color: '#10b981', fontWeight: 700, fontSize: 32 } }}
              prefix={<div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                <CheckCircleOutlined style={{ color: '#10b981', fontSize: 20 }} />
              </div>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            onClick={() => showModal("Open Jobs", jobs.filter(j => (j.status || 'Open') === 'Open'), "jobs")}
            variant="borderless"
            style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', cursor: 'pointer', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}
          >
            <Statistic
              title={<span style={{ color: '#64748b', fontWeight: 500 }}>Open Jobs</span>}
              value={openJobs}
              styles={{ content: { color: '#f59e0b', fontWeight: 700, fontSize: 32 } }}
              prefix={<div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                <RocketOutlined style={{ color: '#f59e0b', fontSize: 20 }} />
              </div>}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={modalTitle}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={750}
      >
        <Table
          dataSource={modalData}
          columns={modalType === "candidates" ? candidateColumns : jobColumns}
          rowKey={record => record._id || record.id}
          pagination={{ pageSize: 5 }}
          size="small"
        />
      </Modal>

      <Row gutter={24} style={{ marginBottom: 32 }}>
        <Col span={12}>
          <Card
            variant="borderless"
            style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', height: '100%', background: 'white' }}
            title={<span style={{ fontWeight: 700, color: '#1e293b' }}>Recruitment Performance</span>}
          >
            <div style={{ width: '100%', height: 300, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={jobStatusesData}
                    cx="50%"
                    cy="80%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {jobStatusesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{
                position: 'absolute',
                bottom: '25%',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                pointerEvents: 'none'
              }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>{totalJobs}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Total Jobs</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginTop: -10 }}>
              {jobStatusesData.map((entry, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '4px 8px', borderRadius: '8px' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: colors[index % colors.length] }} />
                  <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card
            variant="borderless"
            style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', height: '100%', background: 'white' }}
            title={<span style={{ fontWeight: 700, color: '#1e293b' }}>Hiring Progress</span>}
          >
            <div style={{ width: '100%', height: 300, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pipelineData}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none'
              }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>{totalCandidates}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Talent</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginTop: 0 }}>
              {pipelineData.map((entry, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '4px 8px', borderRadius: '8px' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: entry.color }} />
                  <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{entry.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

    </div>
  );
}
