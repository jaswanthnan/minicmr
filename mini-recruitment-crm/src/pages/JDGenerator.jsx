import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Select, Button, Card, Typography, Space, Tag, Divider, message, Spin } from "antd";
import { FileTextOutlined, RobotOutlined, SendOutlined, CopyOutlined } from "@ant-design/icons";

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
    <div style={{ padding: '24px' }}>
      <div style={{ 
        textAlign: 'left', 
        marginBottom: 32,
        position: 'sticky',
        top: -24,
        zIndex: 10,
        background: '#f4f6f8',
        padding: '24px 0',
        margin: '-24px 0 32px 0',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <Title level={2} style={{ margin: 0 }}><FileTextOutlined style={{ marginRight: 12, color: '#1890ff' }} /> AI Job Architect</Title>
        <Text type="secondary">Generate professional, comprehensive job descriptions in seconds using Cloudflare AI</Text>
      </div>

      <Row gutter={24}>
        <Col span={10}>
          <Card title="Job Parameters" variant="outlined">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{ workMode: 'Remote', department: 'Engineering', experience: '3-5 years' }}
            >
              <Form.Item label="Job Role / Title" name="role" rules={[{ required: true, message: 'Please enter a role' }]}>
                <Input placeholder="e.g. Full Stack Developer" />
              </Form.Item>

              <Form.Item label="Experience" name="experience">
                <Select>
                  <Option value="0-2 years">0-2 years (Junior)</Option>
                  <Option value="3-5 years">3-5 years (Mid-level)</Option>
                  <Option value="5-8 years">5-8 years (Senior)</Option>
                  <Option value="10+ years">10+ years (Lead/Architect)</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Department" name="department">
                <Select>
                  <Option value="Engineering">Engineering</Option>
                  <Option value="Product">Product</Option>
                  <Option value="Design">Design</Option>
                  <Option value="Marketing">Marketing</Option>
                  <Option value="Sales">Sales</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Work Mode" name="workMode">
                <Select>
                  <Option value="Remote">Remote</Option>
                  <Option value="Hybrid">Hybrid</Option>
                  <Option value="On-site">On-site</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Required Skills" name="skills">
                <Select mode="tags" placeholder="Select or type skills" style={{ width: '100%' }}>
                  {suggestedSkills.map(skill => (
                    <Option key={skill} value={skill}>{skill}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block icon={<RobotOutlined />} loading={loading}>
                  Generate with Cloudflare AI
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={14}>
          {loading ? (
            <Card style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spin description="Cloudflare AI is architecting your job description..." size="large" />
            </Card>
          ) : generatedJD ? (
            <Card 
              title="Generated Job Description" 
              variant="outlined"
              extra={<Button icon={<CopyOutlined />} onClick={copyToClipboard}>Copy</Button>}
            >
              <div style={{ 
                maxHeight: '600px', 
                overflowY: 'auto', 
                whiteSpace: 'pre-wrap', 
                backgroundColor: '#f8fafc', 
                padding: '20px', 
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                lineHeight: '1.8'
              }}>
                {generatedJD}
              </div>
            </Card>
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px dashed #d1d5db', padding: '40px' }}>
              <FileTextOutlined style={{ fontSize: 48, color: '#d1d5db', marginBottom: 16 }} />
              <Text type="secondary">Fill in the parameters and click generate to see the AI magic.</Text>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}

// Internal Col/Row since I forgot to import them
import { Row, Col } from "antd";

export default JDGenerator;
