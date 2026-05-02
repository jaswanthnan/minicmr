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
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 32px)' }}>
      <div style={{ 
        textAlign: 'left', 
        marginBottom: 32,
        position: 'sticky',
        top: -24,
        zIndex: 10,
        background: '#f4f6f8',
        padding: '24px 0',
        margin: '-24px 0 0 0',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <Title level={2} style={{ margin: 0 }}><RobotOutlined style={{ marginRight: 12, color: '#1890ff' }} /> AI CV Summariser</Title>
        <Text type="secondary">Extract key insights and ask questions about any CV using Cloudflare AI</Text>
      </div>

      {/* Results / Content Area */}
      <div style={{ 
        flex: 1, 
        maxWidth: '800px', 
        margin: '0 auto', 
        width: '100%',
        paddingBottom: '120px', // Space for sticky bottom bar
        paddingTop: '40px'
      }}>
        {!cvText && !loading && !summary && (
          <div style={{ textAlign: 'center', marginTop: '10vh', color: '#94a3b8' }}>
            <RobotOutlined style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
            <Title level={4} style={{ color: '#64748b' }}>Ready to analyze</Title>
            <Text type="secondary">Upload a candidate's CV below to generate an instant summary.</Text>
          </div>
        )}

        {fileName && (
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Tag icon={<FilePdfOutlined />} color="processing" style={{ borderRadius: '12px', padding: '4px 12px' }}>
              Active CV: {fileName}
            </Tag>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Spin size="large" description="Cloudflare AI is reading the CV..." />
          </div>
        )}

        {summary && !loading && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <Card 
              variant="outlined" 
              style={{ borderRadius: '20px', border: '1px solid #e2e8f0', background: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
              title={<span style={{ color: '#64748b', fontWeight: 500 }}><RobotOutlined style={{ marginRight: 8 }} /> Analysis Insights</span>}
            >
              <Paragraph style={{ whiteSpace: 'pre-wrap', fontSize: '16px', lineHeight: '1.8', color: '#1e293b' }}>
                {summary}
              </Paragraph>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Command Bar */}
      <div style={{ 
        position: 'sticky', 
        bottom: 24, 
        zIndex: 10,
        maxWidth: '800px', 
        margin: '0 auto', 
        width: '100%'
      }}>
        <div style={{
          background: 'white',
          padding: '12px 24px',
          borderRadius: '30px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <Upload
            beforeUpload={() => false}
            onChange={handleUpload}
            showUploadList={false}
          >
            <Button 
              shape="circle" 
              icon={<CloudUploadOutlined style={{ fontSize: '18px' }} />} 
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
            />
          </Upload>
          <Input 
            placeholder={cvText ? "Ask anything about this candidate..." : "Click the icon to upload a CV and begin..."}
            variant="borderless"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onPressEnter={askQuestion}
            style={{ fontSize: '16px', flex: 1 }}
            disabled={answering || loading}
          />
          <Button 
            type="primary" 
            shape="circle" 
            icon={<SendOutlined />} 
            disabled={!question.trim() || answering || !cvText}
            onClick={askQuestion}
            loading={answering}
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