"use client";
import { createContext, useContext, useState, useEffect } from "react";
import  supabase  from "./lib/supabase";
const AppContext = createContext();
export function AppProvider({ children }) {
  const [user, setUser] = useState({ role: "admin" }); // Your current user context
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
      
      // Update local state smoothly with the newly saved campaign from DB
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

      // Update local state UI
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

      // Remove from local UI state instantly
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