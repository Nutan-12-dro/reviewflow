"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "./lib/supabase";
import "./globals.css";

export const AppContext = createContext(null);
export function useApp() { return useContext(AppContext); }

const NAV = [
  { path: "/dashboard",           icon: "▦",  label: "Dashboard"           },
  { path: "/campaigns/create",    icon: "＋",  label: "Create Campaign"     },
  { path: "/campaigns/active",    icon: "◉",  label: "Active Campaigns"    },
  { path: "/campaigns/completed", icon: "✓",  label: "Completed Campaigns" },
  { path: "/stats",               icon: "↗",  label: "Reviewer Stats"      },
  { path: "/settings",            icon: "⚙",  label: "Settings"            },
];

function Sidebar({ user, onSignOut }) {
  const pathname = usePathname();
  return (
    <aside style={{ width: 248, background: "#0a0c12", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100 }}>
      <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 11 }}>
        <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #4f7cff, #8b5cf6)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "0 0 20px rgba(79,124,255,0.35)", flexShrink: 0 }}>⚡</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: -0.2, lineHeight: 1.2 }}>Campaign</div>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: -0.2, color: "#4f7cff", lineHeight: 1.2 }}>ReviewFlow</div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#2e3348", padding: "0 10px 8px" }}>Manager Panel</div>
        {NAV.map(item => {
          const active = pathname === item.path;
          return (
            <Link key={item.path} href={item.path} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, marginBottom: 2, textDecoration: "none", fontSize: 13.5, fontWeight: active ? 600 : 500, color: active ? "#c7d2fe" : "#5a6480", background: active ? "rgba(79,124,255,0.1)" : "transparent", border: `1px solid ${active ? "rgba(79,124,255,0.25)" : "transparent"}`, transition: "all 0.15s" }}>
              <span style={{ fontSize: 15, width: 18, textAlign: "center", opacity: active ? 1 : 0.7 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: "linear-gradient(135deg, #4f7cff, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "white" }}>
          {user?.name?.split(" ").map((n) => n[0]).join("") || user?.email?.[0]?.toUpperCase() || "U"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name || user?.email || "User"}</div>
          <div style={{ fontSize: 11, color: "#2e3348", textTransform: "capitalize" }}>{user?.role || "admin"}</div>
        </div>
        <button onClick={onSignOut} title="Sign out" style={{ background: "none", border: "none", color: "#2e3348", cursor: "pointer", fontSize: 16, padding: 4, borderRadius: 6 }}>⏻</button>
      </div>
    </aside>
  );
}

// ── AUTH PAGE (Login + Signup combined) ──────────────────────────
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleLogin = async () => {
    setLoading(true); setError(""); setMessage("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    // Get profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
    onLogin({ 
      id: data.user.id,
      email: data.user.email, 
      name: profile?.full_name || data.user.email,
      role: profile?.role || "admin"
    });
    setLoading(false);
  };

  const handleSignup = async () => {
    setLoading(true); setError(""); setMessage("");
    if (!name.trim()) { setError("Please enter your name."); setLoading(false); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); setLoading(false); return; }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setMessage("Account created! You can now sign in.");
    setMode("login");
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#07090f", backgroundImage: "radial-gradient(ellipse 80% 50% at 30% 0%, rgba(79,124,255,0.08) 0%, transparent 60%)" }}>
      <div style={{ width: 400, padding: "44px 38px", background: "#0a0c12", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, boxShadow: "0 40px 100px rgba(0,0,0,0.6)" }}>
        
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 34 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: "linear-gradient(135deg, #4f7cff, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 0 24px rgba(79,124,255,0.4)" }}>⚡</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.3, lineHeight: 1.2 }}>Campaign ReviewFlow</div>
            <div style={{ fontSize: 11, color: "#3a4055" }}>Review Management Platform</div>
          </div>
        </div>

        {/* Toggle Login/Signup */}
        <div style={{ display: "flex", background: "#0f1118", borderRadius: 10, padding: 4, marginBottom: 28, border: "1px solid rgba(255,255,255,0.06)" }}>
          {["login", "signup"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); setMessage(""); }} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", background: mode === m ? "linear-gradient(135deg, #4f7cff, #6366f1)" : "transparent", color: mode === m ? "white" : "#5a6480" }}>
              {m === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
          {mode === "login" ? "Welcome back" : "Create your account"}
        </div>
        <div style={{ fontSize: 14, color: "#5a6480", marginBottom: 24 }}>
          {mode === "login" ? "Sign in to your dashboard" : "Set up your own username and password"}
        </div>

        {error   && <div style={{ fontSize: 13, color: "#f87171", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>{error}</div>}
        {message && <div style={{ fontSize: 13, color: "#86efac", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>{message}</div>}

        {/* Name field (signup only) */}
        {mode === "signup" && (
          <>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: "#5a6480", marginBottom: 6 }}>Full Name</label>
            <input type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)}
              style={{ width: "100%", padding: "11px 14px", background: "#0f1118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "#e8eaf2", fontSize: 14, outline: "none", marginBottom: 14, boxSizing: "border-box", fontFamily: "inherit" }} />
          </>
        )}

        <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: "#5a6480", marginBottom: 6 }}>Email</label>
        <input type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && (mode === "login" ? handleLogin() : handleSignup())}
          style={{ width: "100%", padding: "11px 14px", background: "#0f1118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "#e8eaf2", fontSize: 14, outline: "none", marginBottom: 14, boxSizing: "border-box", fontFamily: "inherit" }} />

        <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: "#5a6480", marginBottom: 6 }}>Password</label>
        <input type="password" placeholder={mode === "signup" ? "Min. 6 characters" : "••••••••"} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && (mode === "login" ? handleLogin() : handleSignup())}
          style={{ width: "100%", padding: "11px 14px", background: "#0f1118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, color: "#e8eaf2", fontSize: 14, outline: "none", marginBottom: 22, boxSizing: "border-box", fontFamily: "inherit" }} />

        <button onClick={mode === "login" ? handleLogin : handleSignup} disabled={!email || !password || loading}
          style={{ width: "100%", padding: 13, background: (!email || !password || loading) ? "#1a1f2e" : "linear-gradient(135deg, #4f7cff, #6366f1)", color: (!email || !password || loading) ? "#3a4055" : "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: (!email || !password || loading) ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "all 0.2s", boxShadow: (!email || !password || loading) ? "none" : "0 4px 20px rgba(79,124,255,0.3)" }}>
          {loading ? "Please wait…" : mode === "login" ? "Sign in →" : "Create account →"}
        </button>

        <div style={{ fontSize: 12, color: "#3a4055", textAlign: "center", marginTop: 18 }}>
          {mode === "login" ? "No account yet? " : "Already have an account? "}
          <span onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setMessage(""); }} style={{ color: "#4f7cff", cursor: "pointer", fontWeight: 600 }}>
            {mode === "login" ? "Create one →" : "Sign in →"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const supabase = createClient();

  // Check if already logged in on page load
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: profile?.full_name || session.user.email,
          role: profile?.role || "admin"
        });
      }
      setLoading(false);
    });
  }, []);

  const handleLogin = (u) => setUser(u);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCampaigns([]);
  };

  const addCampaign = (campaign) => {
    setCampaigns(prev => [...prev, { ...campaign, id: Date.now(), status: "active", createdAt: new Date().toISOString() }]);
  };

  const completeCampaign = (id) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: "completed", completedAt: new Date().toISOString() } : c));
  };

  const updateCampaign = (id, updates) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  if (loading) {
    return (
      <html lang="en">
        <body style={{ margin: 0, background: "#07090f", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
          <div style={{ color: "#4f7cff", fontSize: 14 }}>Loading…</div>
        </body>
      </html>
    );
  }

  if (!user) {
    return (
      <html lang="en">
        <body style={{ margin: 0, fontFamily: "'Geist', 'Segoe UI', sans-serif", background: "#07090f", color: "#e8eaf2" }}>
          <AuthPage onLogin={handleLogin} />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "'Geist', 'Segoe UI', sans-serif", background: "#07090f", color: "#e8eaf2" }}>
        <AppContext.Provider value={{ user, campaigns, addCampaign, completeCampaign, updateCampaign }}>
          <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar user={user} onSignOut={handleSignOut} />
            <main style={{ marginLeft: 248, flex: 1, minHeight: "100vh" }}>
              {children}
            </main>
          </div>
        </AppContext.Provider>
      </body>
    </html>
  );
}