import React, { useState } from "react";
import axios from "axios";
import { Input, Typography, Card, Row, Col, List, Tag, Checkbox, Empty, Spin, message, Avatar, Badge } from "antd";
import { SearchOutlined, FilterOutlined, UserOutlined, MailOutlined, EnvironmentOutlined, StarOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Title, Text } = Typography;

const statusColors = {
    Hired: { bg: '#dcfce7', color: '#16a34a', dot: '#22c55e' },
    Active: { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6' },
    Applied: { bg: '#fef9c3', color: '#a16207', dot: '#eab308' },
    Interview: { bg: '#ede9fe', color: '#6d28d9', dot: '#8b5cf6' },
    Rejected: { bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444' },
};

const avatarColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6'];

const SearchPage = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [facets, setFacets] = useState({ skills: [], status: [] });
    const [loading, setLoading] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (value) => {
        if (!value.trim()) return;
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/search/candidates?q=${encodeURIComponent(value)}`);
            setResults(res.data.candidates || []);
            setFacets(res.data.facets || { skills: [], status: [] });
            setQuery(value);
            setSearched(true);
        } catch (err) {
            message.error("Search failed. Ensure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const toggleSkill = (skill) => {
        setSelectedSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    const filteredResults = selectedSkills.length > 0
        ? results.filter(c => c.skills?.some(s => selectedSkills.includes(s)))
        : results;

    return (
        <div style={{ padding: '0 0 40px 0', minHeight: '100vh' }}>

            {/* ── Sticky Hero Header ── */}
            <div style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
                padding: '40px 32px 48px',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                overflow: 'hidden',
            }}>
                <style>
                    {`
                    @keyframes float {
                        0% { transform: translate(0, 0) rotate(0deg); }
                        50% { transform: translate(10px, 20px) rotate(5deg); }
                        100% { transform: translate(0, 0) rotate(0deg); }
                    }
                    .decorative-circle {
                        animation: float 10s ease-in-out infinite;
                    }
                    `}
                </style>
                {/* decorative circles */}
                <div className="decorative-circle" style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                <div className="decorative-circle" style={{ position: 'absolute', bottom: -40, left: 80, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', animationDelay: '-5s' }} />

                <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 800, letterSpacing: '-0.5px', fontSize: 32 }}>
                        Advanced Candidate Search
                    </Title>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, display: 'block', marginTop: 4, marginBottom: 24, fontWeight: 400 }}>
                        Discover top talent using intelligent filters and real-time indexing.
                    </Text>
                </div>
            </div>

            {/* ── Trending Row ── */}
            <div style={{ padding: '16px 32px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Text style={{ color: '#64748b', fontSize: 13, fontWeight: 600 }}>Trending:</Text>
                    {['React', 'Node.js', 'Python', 'AWS'].map(tag => (
                        <Tag 
                            key={tag} 
                            onClick={() => { setQuery(tag); handleSearch(tag); }}
                            style={{ 
                                background: '#fff', 
                                border: '1px solid #e2e8f0', 
                                color: '#475569', 
                                borderRadius: 20, 
                                padding: '2px 14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontWeight: 600
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}
                        >
                            {tag}
                        </Tag>
                    ))}
                    {searched && !loading && (
                        <Text style={{ color: '#94a3b8', fontSize: 13, marginLeft: 'auto', fontWeight: 500 }}>
                            {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} for "{query}"
                        </Text>
                    )}
                </div>
            </div>

            {/* ── Body ── */}
            <div style={{ padding: '32px 32px 0', maxWidth: 1400, margin: '0 auto' }}>

                {/* Relocated Search Bar - Pill Style */}
                <div style={{
                    background: '#fff',
                    borderRadius: '50px',
                    padding: '8px 8px 8px 32px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    maxWidth: 800,
                    margin: '0 auto 40px',
                    border: '1px solid #f1f5f9',
                    transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 15px 40px rgba(99, 102, 241, 0.15)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)'}
                >
                    <SearchOutlined style={{ color: '#6366f1', fontSize: 22 }} />
                    <input
                        placeholder="Search by name, skills, or experience…"
                        value={query}
                        onKeyDown={e => e.key === 'Enter' && handleSearch(e.target.value)}
                        onChange={e => setQuery(e.target.value)}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            color: '#1e293b',
                            fontSize: 16,
                            fontWeight: 500,
                        }}
                    />
                    <button
                        onClick={() => handleSearch(query)}
                        disabled={loading}
                        style={{
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            border: 'none',
                            borderRadius: '40px',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: 15,
                            padding: '12px 40px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            transition: 'all 0.2s',
                            boxShadow: '0 8px 16px rgba(99,102,241,0.3)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {loading ? <Spin size="small" /> : <><SearchOutlined /> Search</>}
                    </button>
                </div>

                <Row gutter={24}>

                    <Col span={6}>
                        <Card
                            variant="borderless"
                            style={{
                                borderRadius: 24,
                                boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
                                position: 'sticky',
                                top: 24,
                                background: '#fff',
                                border: '1px solid #f1f5f9'
                            }}
                            styles={{ body: { padding: '24px' } }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
                                    <FilterOutlined style={{ color: '#fff', fontSize: 16 }} />
                                </div>
                                <Text style={{ fontWeight: 800, fontSize: 17, color: '#1e293b' }}>Filters</Text>
                                {selectedSkills.length > 0 && (
                                    <Tag
                                        color="purple"
                                        style={{ marginLeft: 'auto', cursor: 'pointer', borderRadius: 20, border: 'none', background: '#f5f3ff', color: '#7c3aed', fontWeight: 700 }}
                                        onClick={() => setSelectedSkills([])}
                                    >
                                        Clear
                                    </Tag>
                                )}
                            </div>

                            {/* Skills */}
                            <div style={{ marginBottom: 32 }}>
                                <Text style={{ fontWeight: 800, fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 16 }}>Skills Coverage</Text>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    {facets.skills.length > 0 ? facets.skills.map(item => (
                                        <div
                                            key={item.key}
                                            onClick={() => toggleSkill(item.key)}
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                padding: '10px 12px', borderRadius: 12, cursor: 'pointer',
                                                background: selectedSkills.includes(item.key) ? '#f5f3ff' : 'transparent',
                                                transition: 'all 0.2s',
                                            }}
                                            onMouseEnter={e => !selectedSkills.includes(item.key) && (e.currentTarget.style.background = '#f8fafc')}
                                            onMouseLeave={e => !selectedSkills.includes(item.key) && (e.currentTarget.style.background = 'transparent')}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <Checkbox checked={selectedSkills.includes(item.key)} onChange={() => toggleSkill(item.key)} style={{ pointerEvents: 'none' }} />
                                                <Text style={{ fontSize: 14, color: selectedSkills.includes(item.key) ? '#6366f1' : '#475569', fontWeight: selectedSkills.includes(item.key) ? 700 : 500 }}>
                                                    {item.key}
                                                </Text>
                                            </div>
                                            <span style={{ fontSize: 11, background: selectedSkills.includes(item.key) ? '#fff' : '#f1f5f9', color: '#64748b', borderRadius: 6, padding: '2px 8px', fontWeight: 700, border: selectedSkills.includes(item.key) ? '1px solid #e0e7ff' : '1px solid transparent' }}>
                                                {item.doc_count}
                                            </span>
                                        </div>
                                    )) : (
                                        <Text type="secondary" style={{ fontSize: 13, padding: '0 12px' }}>Perform a search to see skills</Text>
                                    )}
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <Text style={{ fontWeight: 800, fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 16 }}>Talent Status</Text>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {facets.status.length > 0 ? facets.status.map(item => {
                                        const s = statusColors[item.key] || { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' };
                                        return (
                                            <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 12, transition: 'all 0.2s' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot, boxShadow: `0 0 8px ${s.dot}66` }} />
                                                    <Text style={{ fontSize: 14, color: '#334155', fontWeight: 500 }}>{item.key}</Text>
                                                </div>
                                                <span style={{ fontSize: 11, background: s.bg, color: s.color, borderRadius: 20, padding: '2px 10px', fontWeight: 800 }}>
                                                    {item.doc_count}
                                                </span>
                                            </div>
                                        );
                                    }) : (
                                        <Text type="secondary" style={{ fontSize: 13, padding: '0 12px' }}>Perform a search to see status</Text>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </Col>

                    {/* ── Results ── */}
                    <Col span={18}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '80px 0' }}>
                                <Spin size="large" />
                                <Text style={{ display: 'block', marginTop: 16, color: '#94a3b8' }}>Searching candidates…</Text>
                            </div>
                        ) : filteredResults.length > 0 ? (
                            <List
                                dataSource={filteredResults}
                                pagination={{
                                    pageSize: 10,
                                    showSizeChanger: true,
                                    pageSizeOptions: ['10', '20', '50'],
                                    position: 'bottom',
                                    align: 'center',
                                    style: { marginTop: 32 }
                                }}
                                renderItem={(item, idx) => {
                                    const s = statusColors[item.status] || { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' };
                                    const av = avatarColors[idx % avatarColors.length];
                                    return (
                                        <List.Item style={{ padding: '0 0 20px 0', border: 'none' }}>
                                            <Card
                                                hoverable
                                                variant="borderless"
                                                style={{
                                                    width: '100%',
                                                    borderRadius: 20,
                                                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    border: '1px solid #f1f5f9',
                                                    background: '#fff',
                                                    overflow: 'hidden'
                                                }}
                                                styles={{ body: { padding: '24px 28px' } }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.005)';
                                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.12)';
                                                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)';
                                                    e.currentTarget.style.borderColor = '#f1f5f9';
                                                }}
                                            >
                                                <Row align="middle" gutter={24}>
                                                    <Col flex="64px">
                                                        <Avatar 
                                                            size={64} 
                                                            style={{ 
                                                                background: `linear-gradient(135deg, ${av} 0%, ${av}dd 100%)`, 
                                                                fontSize: 24, 
                                                                fontWeight: 700, 
                                                                boxShadow: `0 8px 16px ${av}33`
                                                            }}
                                                        >
                                                            {item.name?.[0]?.toUpperCase() || <UserOutlined />}
                                                        </Avatar>
                                                    </Col>
                                                    <Col flex="1">
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                                <Title level={4} style={{ margin: 0, color: '#1e293b', fontWeight: 700 }}>{item.name}</Title>
                                                                <div style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 6,
                                                                    padding: '4px 12px',
                                                                    borderRadius: 20,
                                                                    background: s.bg,
                                                                    color: s.color,
                                                                    fontSize: 12,
                                                                    fontWeight: 700,
                                                                    textTransform: 'uppercase',
                                                                    letterSpacing: '0.5px'
                                                                }}>
                                                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }} />
                                                                    {item.status || 'Unknown'}
                                                                </div>
                                                            </div>
                                                            <StarOutlined style={{ color: '#cbd5e1', fontSize: 20, cursor: 'pointer' }} />
                                                        </div>

                                                        <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 14 }}>
                                                                <MailOutlined style={{ fontSize: 14 }} />
                                                                {item.email}
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 14 }}>
                                                                <EnvironmentOutlined style={{ fontSize: 14 }} />
                                                                {item.location}
                                                            </div>
                                                        </div>

                                                        {item.skills?.length > 0 && (
                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                                                {item.skills.map((skill, i) => (
                                                                    <Tag
                                                                        key={`${skill}-${i}`}
                                                                        style={{
                                                                            borderRadius: 8,
                                                                            fontSize: 12,
                                                                            fontWeight: 600,
                                                                            margin: 0,
                                                                            padding: '4px 12px',
                                                                            background: selectedSkills.includes(skill) ? '#6366f1' : '#f8fafc',
                                                                            color: selectedSkills.includes(skill) ? '#fff' : '#475569',
                                                                            border: selectedSkills.includes(skill) ? '1px solid #6366f1' : '1px solid #e2e8f0',
                                                                            transition: 'all 0.2s'
                                                                        }}
                                                                    >
                                                                        {skill}
                                                                    </Tag>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </List.Item>
                                    );
                                }}
                            />
                        ) : (
                            <div style={{ textAlign: 'center', padding: '80px 0' }}>
                                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#ede9fe,#dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                    <SearchOutlined style={{ fontSize: 32, color: '#8b5cf6' }} />
                                </div>
                                <Title level={4} style={{ color: '#1e293b', margin: 0 }}>
                                    {searched ? 'No candidates found' : 'Search to get started'}
                                </Title>
                                <Text style={{ color: '#94a3b8', fontSize: 14, marginTop: 8, display: 'block' }}>
                                    {searched
                                        ? `No results match "${query}". Try different keywords.`
                                        : 'Type a name, skill, or keyword above to find candidates.'}
                                </Text>
                            </div>
                        )}
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default SearchPage;
