"use client";
import { useState } from "react";
import { createClient } from "../lib/supabase"; // <-- THIS IS THE NEW GUY!

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("signin");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (activeTab === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert("Success! Account created.");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else window.location.href = "/dashboard";
    }
  };