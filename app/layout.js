"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import "./globals.css";

export const AppContext = createContext(null);
export function useApp() { return useContext(AppContext); }

const ADMIN_NAV = [
  { path: "/dashboard",           icon: "▦", label: "Dashboard"           },
  { path: "/campaigns/create",    icon: "＋", label: "Create Campaign"     },
  { path: "/campaigns/active",    icon: "◉", label: "Active Campaigns"     },
  { path: "/campaigns/completed", icon: "✓", label: "Completed Campaigns" },
  { path: "/stats",               icon: "↗", label: "Reviewer Stats"      },
  { path: "/settings",            icon: "⚙", label: "Settings"            },
];

const REVIEWER_NAV = [
  { path: "/reviewer",           icon: "◉", label: "My Campaigns" },
  { path: "/reviewer/completed", icon: "✓", label: "Completed"    },
  { path: "/settings",            icon: "⚙", label: "Settings"    },
];

function Sidebar({ user, onSignOut }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const roleString = (user?.role || "admin").toLowerCase().trim();
  const isAdmin = roleString === "admin" || roleString === "manager";
  const NAV = isAdmin ? ADMIN_NAV : REVIEWER_NAV;

  return (
    <aside style={{ width: 248, background: "#0a0a0a", borderRight: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100 }}>
      
      {/* Clip Tech Symmetrical Custom C Logo */}
      <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 11 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 34, minWidth: 44 }}>
          <svg width="100%" height="100%" viewBox="0 0 130 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="130" height="100%" rx="24" fill="#22c00d" />
            <path d="M46 22H26V78H46V66H36V34H46V22Z" fill="#0a0a0a" />
            <path d="M84 22H104V78H84V66H94V34H84V22Z" fill="#0a0a0a" />
            <path d="M74 34H56V66H74V54H64V46H74V34Z" fill="#0a0a0a" />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 4 }}>
          <span className="font-display" style={{ fontSize: 16, fontWeight: 800, color: "#ffffff", lineHeight: 1.1, letterSpacing: -0.3 }}>Campaign</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#22c00d", lineHeight: 1.1 }}>ReviewFlow</span>
        </div>
      </div>

      {/* Nav Link Tree */}
      <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto" }}>
        <div className="section-label" style={{ padding: "0 10px 8px" }}>
          {isAdmin ? "Manager Panel" : "Reviewer Panel"}
        </div>
        {NAV.map(item => {
          const active = pathname === item.path;
          return (
            <Link key={item.path} href={item.path} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, marginBottom: 4, textDecoration: "none", fontSize: 13.5, fontWeight: active ? 600 : 500, color: active ? "#ffffff" : "#a3a3a3", background: active ? "rgba(34,192,13,0.12)" : "transparent", border: `1px solid ${active ? "rgba(34,192,13,0.3)" : "transparent"}` }}>
              <span style={{ fontSize: 15, width: 18, color: active ? "#22c00d" : "#a3a3a3" }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Profile Footer */}
      <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #22c00d, #059669)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#000" }}>
          {user?.name ? user.name[0].toUpperCase() : "N"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#fff" }}>
            {user?.name || "Nutan"}
          </div>
          <div style={{ fontSize: 11, color: "#22c00d", textTransform: "capitalize", fontWeight: 600 }}>
            {user?.role || "Admin"}
          </div>
        </div>
        <button onClick={onSignOut} style={{ background: "none", border: "none", color: "#a3a3a3", cursor: "pointer", fontSize: 16, padding: 4 }}>⏻</button>
      </div>
    </aside>
  );
}

export default function RootLayout({ children }) {
  const [user, setUser]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        setUser({
          id:    session.user.id,
          email: profile?.email || session.user.email,
          name:  profile?.full_name || profile?.name || session.user.user_metadata?.full_name || "Nutan",
          role:  profile?.role || "admin", 
        });
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => { if (user) fetchCampaigns(); }, [user]);

  const fetchCampaigns = async () => {
    const { data, error } = await supabase.from("campaigns").select("*").order("created_at", { ascending: false });
    if (!error && data) setCampaigns(data);
  };

  const addCampaign = async (campaign) => {
    const { data, error } = await supabase.from("campaigns")
      .insert([{ 
        title: campaign.title, 
        reviewer: campaign.reviewer, 
        priority: campaign.priority, 
        budget: campaign.budget, 
        deadline: campaign.deadline, 
        status: "active", 
        created_by: user.id 
      }])
      .select()
      .single();
    if (!error && data) setCampaigns(prev => [data, ...prev]);
  };

  const completeCampaign = async (id) => {
    const now = new Date().toISOString();
    const { error } = await supabase.from("campaigns").update({ status: "completed", completed_at: now }).eq("id", id);
    if (!error) setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: "completed", completed_at: now } : c));
  };

  const deleteCampaign = async (id) => {
    const { error } = await supabase.from("campaigns").delete().eq("id", id);
    if (!error) setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const updateCampaign = async (id, updates) => {
    const { error } = await supabase.from("campaigns").update(updates).eq("id", id);
    if (!error) setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  if (loading) return <html lang="en"><body style={{ margin: 0, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", color: "#22c00d" }}>Loading…</body></html>;

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#000" }}>
        <AppContext.Provider value={{ user, campaigns, addCampaign, completeCampaign, deleteCampaign, updateCampaign, fetchCampaigns, setUser }}>
          <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar user={user} onSignOut={async () => { await supabase.auth.signOut(); setUser(null); setCampaigns([]); }} />
            <main style={{ marginLeft: 248, flex: 1, minHeight: "100vh", background: "#000" }}>
              {children}
            </main>
          </div>
        </AppContext.Provider>
      </body>
    </html>
  );
}