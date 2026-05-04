import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Select, Button, Card, Typography, Space, Tag, Divider, message, Spin, Row, Col } from "antd";
import { FileTextOutlined, RobotOutlined, CopyOutlined, CheckCircleOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

function JDGenerator() {
  const [generatedJD, setGeneratedJD] = useState("");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const suggestedSkills = ["React", "Node.js", "Python", "TypeScript", "AWS", "Docker", "SQL", "MongoDB", "GraphQL", "Java", "Kubernetes"];

  const onFinish = async (values) => {
    setLoading(true);
    setGeneratedJD("");

    try {
      const res = await axios.post("http://localhost:5000/api/ai/generate-jd", {
        ...values,
        skills: values.skills || []
      });
      setGeneratedJD(res.data.jobDescription);
      message.success("Job Description generated!");
    } catch (error) {
      console.error("Error generating JD:", error);
      message.error("Failed to generate job description.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedJD);
    message.success("Copied to clipboard!");
  };

  return (
    <div style={{ padding: '24px', background: '#f4f6f8', minHeight: '100%' }}>
      <div style={{
        textAlign: 'left',
        marginBottom: 32,
        position: 'sticky',
        top: -40,
        zIndex: 10,
        background: '#f4f6f8',
        padding: '40px 0',
        margin: '-40px 0 0 0',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>
            <FileTextOutlined style={{ marginRight: 12, color: '#4f46e5' }} /> AI Job Architect
          </Title>
          <Text style={{ color: '#64748b', fontSize: '15px' }}>Generate professional, comprehensive job descriptions in seconds using Cloudflare AI</Text>
        </div>
      </div>

      <Row gutter={32} style={{ marginTop: 24 }}>
        <Col span={9}>
          <Card
            title={<span style={{ fontWeight: 700 }}><RobotOutlined style={{ marginRight: 8, color: '#4f46e5' }} /> Configuration</span>}
            style={{ borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: 'none' }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{ workMode: 'Remote', department: 'Engineering', experience: '3-5 years' }}
              size="large"
            >
              <Form.Item label="Job Role / Title" name="role" rules={[{ required: true, message: 'Please enter a role' }]}>
                <Input placeholder="e.g. Full Stack Developer" style={{ borderRadius: '12px' }} />
              </Form.Item>

              <Form.Item label="Experience Level" name="experience">
                <Select style={{ borderRadius: '12px' }}>
                  <Option value="0-2 years">0-2 years (Junior)</Option>
                  <Option value="3-5 years">3-5 years (Mid-level)</Option>
                  <Option value="5-8 years">5-8 years (Senior)</Option>
                  <Option value="10+ years">10+ years (Lead/Architect)</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Department" name="department">
                <Select style={{ borderRadius: '12px' }}>
                  <Option value="Engineering">Engineering</Option>
                  <Option value="Product">Product</Option>
                  <Option value="Design">Design</Option>
                  <Option value="Marketing">Marketing</Option>
                  <Option value="Sales">Sales</Option>
                  <Option value="Human Resources">Human Resources</Option>
                  <Option value="Finance">Finance</Option>
                  <Option value="Operations">Operations</Option>
                  <Option value="Customer Support">Customer Support</Option>
                  <Option value="Data & Analytics">Data & Analytics</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Work Mode" name="workMode">
                <Select style={{ borderRadius: '12px' }}>
                  <Option value="Remote">Remote</Option>
                  <Option value="Hybrid">Hybrid</Option>
                  <Option value="On-site">On-site</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Required Skills" name="skills">
                <Select mode="tags" placeholder="Select or type skills" style={{ width: '100%', borderRadius: '12px' }}>
                  {suggestedSkills.map(skill => (
                    <Option key={skill} value={skill}>{skill}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  style={{ height: '52px', borderRadius: '16px', background: '#4f46e5', fontWeight: 600, fontSize: '16px' }}
                >
                  Architect Description
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={15}>
          {loading ? (
            <Card style={{ height: '100%', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'white' }}>
              <Space direction="vertical" align="center" size="large">
                <Spin size="large" />
                <Text style={{ color: '#64748b', fontSize: '16px' }}>AI is crafting your professional JD...</Text>
              </Space>
            </Card>
          ) : generatedJD ? (
            <Card
              title={<span style={{ fontWeight: 700 }}><CheckCircleOutlined style={{ marginRight: 8, color: '#10b981' }} /> Generated Architecture</span>}
              style={{ borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: 'none', height: '100%' }}
              extra={<Button type="primary" ghost icon={<CopyOutlined />} onClick={copyToClipboard} style={{ borderRadius: '10px' }}>Copy Text</Button>}
            >
              <div style={{
                maxHeight: '650px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                backgroundColor: '#f8fafc',
                padding: '32px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                lineHeight: '1.8',
                fontSize: '15px',
                color: '#1e293b'
              }}>
                {generatedJD}
              </div>
            </Card>
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'white', borderRadius: '24px', border: '2px dashed #e2e8f0', padding: '60px' }}>
              <div style={{ width: 64, height: 64, background: '#f1f5f9', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                <FileTextOutlined style={{ fontSize: 32, color: '#cbd5e1' }} />
              </div>
              <Title level={4} style={{ color: '#64748b', marginBottom: 8 }}>Ready to Generate</Title>
              <Text style={{ color: '#94a3b8', fontSize: '15px', textAlign: 'center', maxWidth: '300px' }}>Select the job parameters on the left to architect a professional description.</Text>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default JDGenerator;
