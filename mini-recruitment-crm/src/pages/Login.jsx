import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Form, Input, Button, Typography, Alert, Divider } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const QUOTES = [
  {
    line1: "Hire character.",
    line2: "Train skill.",
    gradient: "linear-gradient(90deg, #06b6d4, #0d9488)",
    glow: "rgba(6,182,212,0.25)",
    sub: '"The most important thing we do is hire the right people."',
    author: "— Reed Hastings, Netflix",
  },
  {
    line1: "The best talent",
    line2: "starts here.",
    gradient: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
    glow: "rgba(59,130,246,0.25)",
    sub: '"I\'d rather interview 50 people and not hire anyone than hire the wrong person."',
    author: "— Jeff Bezos, Amazon",
  },
  {
    line1: "Great vision needs",
    line2: "great people.",
    gradient: "linear-gradient(90deg, #10b981, #14b8a6)",
    glow: "rgba(16,185,129,0.25)",
    sub: '"Great vision without great people is irrelevant."',
    author: "— Jim Collins, Good to Great",
  },
  {
    line1: "People first,",
    line2: "always.",
    gradient: "linear-gradient(90deg, #f43f5e, #f97316)",
    glow: "rgba(244,63,94,0.25)",
    sub: '"Take care of your employees and they will take care of your clients."',
    author: "— Richard Branson, Virgin Group",
  },
  {
    line1: "Hire the best,",
    line2: "outperform the rest.",
    gradient: "linear-gradient(90deg, #7c3aed, #db2777)",
    glow: "rgba(124,58,237,0.25)",
    sub: '"We go to exceptional lengths to hire the best people in the world."',
    author: "— Steve Jobs, Apple",
  },
  {
    line1: "Culture is your",
    line2: "competitive edge.",
    gradient: "linear-gradient(90deg, #d97706, #dc2626)",
    glow: "rgba(217,119,6,0.25)",
    sub: '"Culture eats strategy for breakfast."',
    author: "— Peter Drucker",
  },
  {
    line1: "Smart hiring is",
    line2: "smart business.",
    gradient: "linear-gradient(90deg, #0ea5e9, #4f46e5)",
    glow: "rgba(14,165,233,0.25)",
    sub: '"The key for us, number one, has always been hiring very smart people."',
    author: "— Bill Gates, Microsoft",
  },
  {
    line1: "Train people well,",
    line2: "treat them better.",
    gradient: "linear-gradient(90deg, #16a34a, #059669)",
    glow: "rgba(22,163,74,0.25)",
    sub: '"Train people well enough so they can leave, treat them well enough so they don\'t want to."',
    author: "— Richard Branson",
  },
  {
    line1: "Your team is",
    line2: "your product.",
    gradient: "linear-gradient(90deg, #e879f9, #6366f1)",
    glow: "rgba(232,121,249,0.25)",
    sub: '"A company is only as good as the people it keeps."',
    author: "— Mary Kay Ash",
  },
  {
    line1: "Right people,",
    line2: "right results.",
    gradient: "linear-gradient(90deg, #38bdf8, #34d399)",
    glow: "rgba(56,189,248,0.25)",
    sub: '"You need the right people with you, not the best people."',
    author: "— Jack Ma, Alibaba",
  },
  {
    line1: "Diversity builds",
    line2: "strength.",
    gradient: "linear-gradient(90deg, #fb923c, #f472b6)",
    glow: "rgba(251,146,60,0.25)",
    sub: '"A diverse mix of voices leads to better decisions and outcomes for everyone."',
    author: "— Sundar Pichai, Google",
  },
  {
    line1: "Invest in people,",
    line2: "reap loyalty.",
    gradient: "linear-gradient(90deg, #facc15, #f97316)",
    glow: "rgba(250,204,21,0.25)",
    sub: '"An employee\'s motivation is a direct result of interactions with their manager."',
    author: "— Bob Nelson",
  },
  {
    line1: "Lead with purpose,",
    line2: "hire with passion.",
    gradient: "linear-gradient(90deg, #6366f1, #06b6d4)",
    glow: "rgba(99,102,241,0.25)",
    sub: '"Passion is the difference between having a job or having a career."',
    author: "— Unknown",
  },
  {
    line1: "The future belongs",
    line2: "to the curious.",
    gradient: "linear-gradient(90deg, #f472b6, #fb923c)",
    glow: "rgba(244,114,182,0.25)",
    sub: '"Curiosity is the engine of achievement."',
    author: "— Ken Robinson",
  },
  {
    line1: "Empower teams,",
    line2: "inspire success.",
    gradient: "linear-gradient(90deg, #2dd4bf, #3b82f6)",
    glow: "rgba(45,212,191,0.25)",
    sub: '"The strength of the team is each individual member."',
    author: "— Phil Jackson",
  },
];

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % QUOTES.length);
        setFade(true);
      }, 450);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const q = QUOTES[idx];

  const goTo = (i) => {
    setFade(false);
    setTimeout(() => { setIdx(i); setFade(true); }, 300);
  };

  const onFinish = async (values) => {
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, values.email, values.password);
      } else {
        await createUserWithEmailAndPassword(auth, values.email, values.password);
      }
    } catch (err) {
      setError(err.message.includes("auth/invalid-credential")
        ? "Invalid email or password. Please try again."
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: "100vh", width: "100vw",
      display: "flex", background: "white",
      fontFamily: "'Inter', sans-serif", overflow: "hidden"
    }}>

      {/* ── LEFT HERO PANEL ── */}
      <div style={{
        flex: 1,
        background: "linear-gradient(145deg, #0f172a 0%, #1e3a5f 45%, #0e4f6e 100%)",
        display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "72px",
        color: "white", position: "relative", overflow: "hidden"
      }}>

        {/* Glowing orbs */}
        <div style={{ position:"absolute", top:-90, right:-90, width:300, height:300, borderRadius:"50%", background:`radial-gradient(circle, ${q.glow} 0%, transparent 70%)`, transition:"background 0.8s ease" }} />
        <div style={{ position:"absolute", bottom:-70, left:-70, width:240, height:240, borderRadius:"50%", background:"radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)" }} />
        <div style={{ position:"absolute", top:"50%", right:"6%", width:120, height:120, borderRadius:"50%", background:`radial-gradient(circle, ${q.glow} 0%, transparent 70%)`, transition:"background 0.8s ease" }} />

        {/* Subtle grid */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize:"40px 40px" }} />

        {/* Ring decoration */}
        <div style={{ position:"absolute", bottom:"-90px", right:"10%", width:260, height:260, borderRadius:"50%", border:"1.5px solid rgba(255,255,255,0.07)", display:"flex", justifyContent:"center", alignItems:"center" }}>
          <div style={{ width:170, height:170, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.05)" }} />
        </div>

        {/* Content */}
        <div style={{ position:"relative", zIndex:1 }}>

          {/* Badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:999, padding:"6px 18px", marginBottom:36 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#10b981", boxShadow:"0 0 8px #10b981" }} />
            <span style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.7)", letterSpacing:"0.08em", textTransform:"uppercase" }}>Recruitment Intelligence</span>
          </div>

          {/* Animated Quote */}
          <div style={{ transition:"opacity 0.45s ease, transform 0.45s ease", opacity: fade ? 1 : 0, transform: fade ? "translateY(0)" : "translateY(14px)" }}>
            <div style={{ fontSize:52, fontWeight:900, lineHeight:1.1, marginBottom:24, letterSpacing:"-0.02em" }}>
              <div style={{ color:"white" }}>{q.line1}</div>
              <div style={{
                display: "inline-block",
                background: q.gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}>{q.line2}</div>
            </div>

            <p style={{ color:"rgba(255,255,255,0.6)", fontSize:16, maxWidth:360, lineHeight:1.8, fontStyle:"italic", margin:"0 0 10px" }}>
              {q.sub}
            </p>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, margin:0, fontWeight:500 }}>
              {q.author}
            </p>
          </div>

          {/* Dot indicators */}
          <div style={{ display:"flex", gap:8, marginTop:28, flexWrap:"wrap", maxWidth:320 }}>
            {QUOTES.map((_, i) => (
              <div
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === idx ? 28 : 8,
                  height: 8,
                  borderRadius: 999,
                  background: i === idx ? q.gradient.match(/#[0-9a-f]{6}/i)?.[0] || "#06b6d4" : "rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  transition: "all 0.4s ease",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>

          {/* Stats */}
          <div style={{ display:"flex", gap:36, marginTop:52 }}>
            {[["500+","Candidates"],["120+","Jobs Posted"],["98%","Satisfaction"]].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontSize:28, fontWeight:800, background: q.gradient, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", display:"inline-block", transition:"background 0.8s ease" }}>{val}</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)", fontWeight:500, marginTop:2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT LOGIN FORM ── */}
      <div style={{
        flex: 1, display:"flex", flexDirection:"column",
        justifyContent:"center", alignItems:"center",
        padding:"40px", background:"#f8fafc"
      }}>
        <div style={{ width:"100%", maxWidth:400 }}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{
              width:56, height:56, background:"#4f46e5",
              borderRadius:14, display:"flex", justifyContent:"center",
              alignItems:"center", margin:"0 auto 20px",
              boxShadow:"0 10px 15px -3px rgba(79,70,229,0.35)"
            }}>
              <Title level={3} style={{ margin:0, color:"white" }}>M</Title>
            </div>
            <Title level={3} style={{ margin:0, fontWeight:700 }}>Hello! Welcome back</Title>
            <Text style={{ color:"#64748b", fontSize:14 }}>Sign in to your account to continue</Text>
          </div>

          {error && <Alert message={error} type="error" showIcon style={{ marginBottom:24, borderRadius:12 }} />}

          <Form layout="vertical" onFinish={onFinish} size="large">
            <Form.Item name="email" rules={[{ required:true, type:"email", message:"Please enter your email!" }]}>
              <Input prefix={<MailOutlined style={{ color:"#94a3b8" }} />} placeholder="Email Address" style={{ borderRadius:10 }} />
            </Form.Item>
            <Form.Item name="password" rules={[{ required:true, message:"Please enter your password!" }]}>
              <Input.Password prefix={<LockOutlined style={{ color:"#94a3b8" }} />} placeholder="Password" style={{ borderRadius:10 }} />
            </Form.Item>

            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:24 }}>
              <Text style={{ fontSize:12, color:"#64748b" }}>Remember me</Text>
              <Button type="link" size="small" style={{ fontSize:12, padding:0 }}>Forgot Password?</Button>
            </div>

            <Form.Item style={{ marginBottom:12 }}>
              <Button type="primary" htmlType="submit" block loading={loading} style={{
                height:50, borderRadius:12, fontWeight:600,
                background:"#4f46e5", border:"none",
                boxShadow:"0 4px 14px 0 rgba(79,70,229,0.39)"
              }}>
                {isLogin ? "Login" : "Sign Up"}
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ margin:"32px 0" }}>
            <Text style={{ color:"#94a3b8", fontSize:12 }}>OR</Text>
          </Divider>

          <div style={{ display:"flex", justifyContent:"center", gap:20, marginBottom:32 }}>
            <Button shape="circle" icon={<i className="fab fa-google" />} size="large" />
            <Button shape="circle" icon={<i className="fab fa-facebook-f" />} size="large" />
            <Button shape="circle" icon={<i className="fab fa-github" />} size="large" />
          </div>

          <div style={{ textAlign:"center" }}>
            <Text style={{ color:"#64748b" }}>Don't have an account? </Text>
            <Button type="link" onClick={() => setIsLogin(!isLogin)} style={{ padding:0, fontWeight:600, color:"#4f46e5" }}>
              {isLogin ? "Create Account" : "Login Now"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
