import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import Jobs from "./pages/Jobs";
import AISummariser from "./pages/AISummariser";
import JDGenerator from "./pages/JDGenerator";
import SearchPage from "./pages/Search";
import Login from "./pages/Login";
import { Layout, Menu, Button, Space } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  FileSearchOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from "@ant-design/icons";
import "./App.css";

const { Sider, Content } = Layout;

function App() {
  const [page, setPage] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#f4f6f8' }}>
      <Sider 
        width={280} 
        collapsed={collapsed}
        collapsible
        trigger={null}
        className="custom-sidebar" 
        style={{ 
          height: '100vh', 
          position: 'sticky', 
          top: 0, 
          left: 0,
          zIndex: 100,
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
        }}
      >
        <div style={{ 
          padding: '24px 16px', 
          color: 'white', 
          fontSize: '20px', 
          fontWeight: 'bold', 
          borderBottom: '1px solid #1e293b', 
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between'
        }}>
          {!collapsed && <span>Mini CRM</span>}
          <Button 
            type="text" 
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} 
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: 'white', fontSize: '18px' }}
          />
        </div>
        <Menu
          className="custom-menu"
          mode="inline"
          selectedKeys={[page]}
          onClick={(e) => setPage(e.key)}
          style={{ borderRight: 0 }}
          items={[
            { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
            { key: 'candidates', icon: <UserOutlined />, label: 'Candidates' },
            { key: 'jobs', icon: <FileTextOutlined />, label: 'Jobs Board' },
            { key: 'search', icon: <SearchOutlined />, label: 'Advanced Search' },
            { key: 'ai', icon: <FileSearchOutlined />, label: 'AI Summariser' },
            { key: 'jd', icon: <FileTextOutlined />, label: 'JD Generator' },
          ]}
        />
        <div style={{ position: 'absolute', bottom: 30, width: '100%', textAlign: 'center' }}>
          <Button type="text" style={{ color: '#ff4d4f', fontWeight: 600 }} onClick={handleLogout}>
            {collapsed ? "" : "Logout"}
          </Button>
        </div>
      </Sider>
      <Layout style={{ background: '#f4f6f8' }}>
        <Content style={{ padding: '40px', minHeight: '100vh' }}>
          <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
            {page === "dashboard" && <Dashboard setPage={setPage} />}
            {page === "candidates" && <Candidates />}
            {page === "jobs" && <Jobs />}
            {page === "search" && <SearchPage />}
            {page === "ai" && <AISummariser />}
            {page === "jd" && <JDGenerator />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;