"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import "./globals.css"; // Ensures your global styles don't break

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

// 🌟 FIXED ROOT LAYOUT WITH SIDEBAR ALIGNMENT
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#050505", color: "#e8eaf2" }}>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          {/* Main Content Area */}
          <main style={{ flex: 1, minWidth: 0 }}>
            <AppProvider>
              {children}
            </AppProvider>
          </main>
        </div>
      </body>
    </html>
  );
}