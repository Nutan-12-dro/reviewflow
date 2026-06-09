"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import "./globals.css";

// INITIALIZE SUPABASE CLIENT INSTANCE
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState({ role: "admin" }); 
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. FETCH ALL CAMPAIGNS FROM DATABASE ON LOAD
  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const { data, error } = await supabase
          .from("campaigns")
          .select("*");
        
        if (error) throw error;
        setCampaigns(data || []);
      } catch (err) {
        console.error("Error fetching from Supabase:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  // 2. ADD A NEW CAMPAIGN TO THE REAL DATABASE
  const addCampaign = async (newCampaign) => {
    try {
      const { data, error } = await supabase
        .from("campaigns")
        .insert([{ 
          title: newCampaign.title,
          reviewer: newCampaign.reviewer,
          budget: newCampaign.budget,
          deadline: newCampaign.deadline,
          status: "active",
          priority: newCampaign.priority || "medium"
        }])
        .select();

      if (error) throw error;
      setCampaigns((prev) => [data[0], ...prev]);
    } catch (err) {
      console.error("Error adding campaign to Supabase:", err.message);
    }
  };

  // 3. COMPLETE A CAMPAIGN (UPDATE STATUS TO COMPLETED)
  const completeCampaign = async (id) => {
    try {
      const { error } = await supabase
        .from("campaigns")
        .update({ status: "completed" })
        .eq("id", id);

      if (error) throw error;

      setCampaigns((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "completed" } : c))
      );
    } catch (err) {
      console.error("Error completing campaign in Supabase:", err.message);
    }
  };

  // 4. DELETE A CAMPAIGN PERMANENTLY FROM DATABASE
  const deleteCampaign = async (id) => {
    try {
      const { error } = await supabase
        .from("campaigns")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting campaign from Supabase:", err.message);
    }
  };

  return (
    <AppContext.Provider value={{ user, campaigns, loading, addCampaign, completeCampaign, deleteCampaign }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

// 🌟 THE FIX: ROOT LAYOUT THAT ADDS THE SIDEBAR AND MAIN CONTENT SIDE-BY-SIDE
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#050505", color: "#e8eaf2" }}>
        <AppProvider>
          <div style={{ display: "flex", minHeight: "100vh" }}>
            
            {/* 🛠️ YOUR SIDEBAR WRAPPER (This forces it to sit on the left side) */}
            <aside style={{ width: "240px", minWidth: "240px", background: "#0a0a0a", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
              {/* If you have a custom Sidebar component file, you can import and put it here instead, 
                  but for now this keeps your navigation links safely structured side-by-side! */}
              <div style={{ padding: "24px", fontWeight: "bold", fontSize: "18px", letterSpacing: "-0.5px" }}>ReviewFlow</div>
              <nav style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "0 16px" }}>
                <a href="/dashboard" style={{ color: "#e8eaf2", textDecoration: "none", padding: "10px", borderRadius: "8px", fontSize: "14px", background: "rgba(255,255,255,0.03)" }}>📊 Dashboard</a>
                <a href="/campaigns/active" style={{ color: "#5a6480", textDecoration: "none", padding: "10px", borderRadius: "8px", fontSize: "14px" }}>🟢 Active</a>
                <a href="/campaigns/create" style={{ color: "#5a6480", textDecoration: "none", padding: "10px", borderRadius: "8px", fontSize: "14px" }}>✨ Create New</a>
              </nav>
            </aside>

            {/* MAIN APP CONTENT (Dashboard, Create Page, etc.) */}
            <main style={{ flex: 1, minWidth: 0, background: "#050505" }}>
              {children}
            </main>

          </div>
        </AppProvider>
      </body>
    </html>
  );
}