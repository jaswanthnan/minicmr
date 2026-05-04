import React, { useState } from "react";
import axios from "axios";
import { CloudUploadOutlined, RobotOutlined, FilePdfOutlined, SendOutlined } from "@ant-design/icons";
import { Typography, Card, Upload, message, Spin, Divider, List, Input, Button, Space, Tag } from "antd";
import * as pdfjsLib from "pdfjs-dist";

const { Title, Text, Paragraph } = Typography;

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

function AISummariser() {
  const [cvText, setCvText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answering, setAnswering] = useState(false);
  const [fileName, setFileName] = useState("");

  const extractText = async (file) => {
    if (file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map((item) => item.str).join(" ") + "\n";
      }
      return fullText;
    } else {
      return await file.text();
    }
  };

  const handleUpload = async (info) => {
    const file = info.file;
    setFileName(file.name);
    setLoading(true);
    try {
      const text = await extractText(file);
      setCvText(text);
      
      const res = await axios.post("http://localhost:5000/api/ai/summary", {
        cvText: text,
      });
      setSummary(res.data.summary);
      message.success("CV analyzed successfully");
    } catch (error) {
      console.error("Error analyzing CV", error);
      message.error("Failed to analyze CV");
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async () => {
    if (!question.trim() || !cvText) return;
    setAnswering(true);
    try {
      const res = await axios.post("http://localhost:5000/api/ai/summary", {
        cvText: cvText,
        question: question
      });
      setSummary(prev => `**Q: ${question}**\n\n${res.data.summary}\n\n---\n\n${prev}`);
      setQuestion("");
    } catch (err) {
      message.error("AI failed to answer");
    } finally {
      setAnswering(false);
    }
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 32px)', background: '#f4f6f8' }}>
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
            <RobotOutlined style={{ marginRight: 12, color: '#4f46e5' }} /> AI CV Summariser
          </Title>
          <Text style={{ color: '#64748b', fontSize: '15px' }}>Extract key insights and ask questions about any CV using Cloudflare AI</Text>
        </div>
        {fileName && (
          <Tag icon={<FilePdfOutlined />} color="indigo" style={{ borderRadius: '12px', padding: '6px 16px', fontSize: '14px', fontWeight: 600 }}>
            Analyzing: {fileName}
          </Tag>
        )}
      </div>

      <div style={{ 
        flex: 1, 
        maxWidth: '900px', 
        margin: '0 auto', 
        width: '100%',
        paddingBottom: '140px',
        paddingTop: '20px'
      }}>


        {loading && (
          <div style={{ textAlign: 'center', marginTop: 60 }}>
            <Spin size="large" tip="Cloudflare AI is reading the CV..." />
          </div>
        )}

        {summary && !loading && (
          <Space direction="vertical" size="xlarge" style={{ width: '100%', animation: 'fadeIn 0.6s ease-out' }}>
            <Card 
              style={{ borderRadius: '24px', border: 'none', background: 'white', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}
              title={<span style={{ color: '#1e293b', fontWeight: 700, fontSize: '18px' }}><RobotOutlined style={{ marginRight: 12, color: '#4f46e5' }} /> Executive Summary</span>}
            >
              <Paragraph style={{ whiteSpace: 'pre-wrap', fontSize: '16px', lineHeight: '1.8', color: '#334155' }}>
                {summary}
              </Paragraph>
            </Card>

            <div style={{ padding: '0 8px' }}>
              <Title level={5} style={{ color: '#64748b', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Suggested Questions</Title>
              <Space wrap size="small">
                {[
                  "What are their top 3 technical strengths?",
                  "Assess their leadership potential based on this CV.",
                  "Identify any potential red flags or gaps.",
                  "Suggest 3 technical interview questions for this candidate."
                ].map(q => (
                  <Button 
                    key={q}
                    onClick={() => { setQuestion(q); }}
                    style={{ borderRadius: '20px', background: 'white', border: '1px solid #e2e8f0', color: '#4f46e5', fontWeight: 500 }}
                  >
                    {q}
                  </Button>
                ))}
              </Space>
            </div>
          </Space>
        )}
      </div>

      <div style={{ 
        position: 'sticky', 
        bottom: 32, 
        zIndex: 10,
        maxWidth: '900px', 
        margin: '0 auto', 
        width: '100%'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(16px)',
          padding: '16px 24px',
          borderRadius: '24px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          border: '1px solid rgba(255,255,255,0.5)'
        }}>
          <Upload beforeUpload={() => false} onChange={handleUpload} showUploadList={false}>
            <Button shape="circle" size="large" icon={<CloudUploadOutlined />} style={{ background: '#4f46e5', color: 'white', border: 'none' }} />
          </Upload>
          <Input 
            placeholder={cvText ? "Ask anything about this candidate..." : "Upload a CV to start chatting..."}
            variant="borderless"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onPressEnter={askQuestion}
            style={{ fontSize: '16px', flex: 1, color: '#1e293b' }}
            disabled={answering || loading}
          />
          <Button 
            type="primary" 
            shape="circle" 
            size="large"
            icon={<SendOutlined />} 
            disabled={!question.trim() || answering || !cvText}
            onClick={askQuestion}
            loading={answering}
            style={{ background: '#4f46e5' }}
          />
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default AISummariser;