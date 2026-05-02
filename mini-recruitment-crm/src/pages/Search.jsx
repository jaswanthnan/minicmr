import React, { useState } from "react";
import axios from "axios";
import { Input, Typography, Card, Row, Col, List, Tag, Checkbox, Empty, Spin, message } from "antd";
import { SearchOutlined, FilterOutlined, UserOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Title, Text } = Typography;

const SearchPage = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [facets, setFacets] = useState({ skills: [], status: [] });
    const [loading, setLoading] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState([]);

    const handleSearch = async (value) => {
        if (!value.trim()) return;
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/search/candidates?q=${encodeURIComponent(value)}`);
            setResults(res.data.candidates || []);
            setFacets(res.data.facets || { skills: [], status: [] });
            setQuery(value);
        } catch (err) {
            message.error("Search failed. Ensure Elasticsearch is running.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleSkill = (skill) => {
        setSelectedSkills(prev => 
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
        // Note: For real faceted search, we should re-query with filters.
        // For this capstone, we'll filter the current results locally for UI demonstration.
    };

    const filteredResults = selectedSkills.length > 0
        ? results.filter(c => c.skills?.some(s => selectedSkills.includes(s)))
        : results;

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Advanced Candidate Search</Title>
            <Text type="secondary">Powered by Elasticsearch with faceted filtering</Text>

            <div style={{ marginTop: 24, marginBottom: 32 }}>
                <Search
                    placeholder="Search by name, skills, or experience..."
                    enterButton={<Button icon={<SearchOutlined />}>Search</Button>}
                    size="large"
                    onSearch={handleSearch}
                    loading={loading}
                />
            </div>

            <Row gutter={24}>
                {/* Sidebar Facets */}
                <Col span={6}>
                    <Card title={<span><FilterOutlined /> Filters</span>} variant="outlined">
                        <div style={{ marginBottom: 20 }}>
                            <Title level={5}>Skills</Title>
                            {facets.skills.length > 0 ? (
                                <List
                                    dataSource={facets.skills}
                                    renderItem={item => (
                                        <div key={item.key} style={{ marginBottom: 8 }}>
                                            <Checkbox 
                                                onChange={() => toggleSkill(item.key)}
                                                checked={selectedSkills.includes(item.key)}
                                            >
                                                {item.key} <Text type="secondary">({item.doc_count})</Text>
                                            </Checkbox>
                                        </div>
                                    )}
                                />
                            ) : <Text type="secondary">No skills found</Text>}
                        </div>

                        <div>
                            <Title level={5}>Status</Title>
                            {facets.status.length > 0 ? (
                                <List
                                    dataSource={facets.status}
                                    renderItem={item => (
                                        <div key={item.key} style={{ marginBottom: 8 }}>
                                            <Tag color="blue">{item.key}: {item.doc_count}</Tag>
                                        </div>
                                    )}
                                />
                            ) : <Text type="secondary">No status facets</Text>}
                        </div>
                    </Card>
                </Col>

                {/* Search Results */}
                <Col span={18}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
                    ) : filteredResults.length > 0 ? (
                        <List
                            grid={{ gutter: 16, column: 1 }}
                            dataSource={filteredResults}
                            renderItem={item => (
                                <List.Item>
                                    <Card hoverable>
                                        <Row align="middle">
                                            <Col span={2}>
                                                <UserOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                                            </Col>
                                            <Col span={22}>
                                                <Title level={4} style={{ margin: 0 }}>{item.name}</Title>
                                                <Text type="secondary">{item.email} • {item.location}</Text>
                                                <div style={{ marginTop: 8 }}>
                                                    {item.skills?.map((skill, index) => (
                                                        <Tag key={`${skill}-${index}`} color="geekblue">{skill}</Tag>
                                                    ))}
                                                </div>
                                                <div style={{ marginTop: 12 }}>
                                                    <Tag color={item.status === 'Hired' ? 'green' : 'orange'}>{item.status}</Tag>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    ) : (
                        <Empty description="No candidates found matching your query" />
                    )}
                </Col>
            </Row>
        </div>
    );
};

// Internal Button component since I didn't import it from antd in the top
import { Button } from "antd";

export default SearchPage;
