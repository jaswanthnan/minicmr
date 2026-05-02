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
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={250}
        collapsed={collapsed}
        className="custom-sidebar"
        style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0, transition: 'all 0.2s' }}
      >
        <div style={{
          padding: '20px 16px',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
          borderBottom: '1px solid #1e293b',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: '12px'
        }}>
          {!collapsed && <span>Mini CRM</span>}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: 'white', fontSize: '16px', padding: 0 }}
          />
        </div>
        <Menu
          className="custom-menu"
          mode="inline"
          selectedKeys={[page]}
          onClick={(e) => setPage(e.key)}
          items={[
            { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
            { key: 'candidates', icon: <UserOutlined />, label: 'Candidates' },
            { key: 'jobs', icon: <FileTextOutlined />, label: 'Jobs Board' },
            { key: 'search', icon: <SearchOutlined />, label: 'Advanced Search' },
            { key: 'ai', icon: <FileSearchOutlined />, label: 'AI Summariser' },
            { key: 'jd', icon: <FileTextOutlined />, label: 'JD Generator' },
          ]}
        />
        <div style={{ position: 'absolute', bottom: 20, width: '100%', textAlign: 'center' }}>
          <Button type="text" style={{ color: '#ef4444' }} onClick={handleLogout}>
            {collapsed ? "" : "Logout"}
          </Button>
        </div>
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'all 0.2s' }}>
        <Content style={{ padding: '16px', background: '#f4f6f8', minHeight: '100vh' }}>
          {page === "dashboard" && <Dashboard setPage={setPage} />}
          {page === "candidates" && <Candidates />}
          {page === "jobs" && <Jobs />}
          {page === "search" && <SearchPage />}
          {page === "ai" && <AISummariser />}
          {page === "jd" && <JDGenerator />}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;