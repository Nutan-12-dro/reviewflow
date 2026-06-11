"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../layout";
import Link from "next/link";

const PC = { urgent:"#ef4444", high:"#f59e0b", medium:"#22c00d", low:"#555" };
const PO = { urgent:0, high:1, medium:2, low:3 };

export default function ActiveCampaignsPage() {
  const { campaigns, completeCampaign, deleteCampaign, updateCampaign, user } = useApp();
  const router = useRouter();
  
const { campaigns, completeCampaign, deleteCampaign, updateCampaign, user } = useApp();
  const router = useRouter();

  const isAdmin = user?.role?.toLowerCase()?.trim() === "admin";

  useEffect(() => {
    if (user && !isAdmin) {
      router.push("/reviewer");
    }
  }, [user, isAdmin, router]);

  if (!user || !isAdmin) {
    return null; 
  }

  if (!user || user.role !== "admin") {
    return null; 
  }

  const iS = { padding:"10px 14px", background:"#0a0a0a", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, color:"#fff", fontSize:13, outline:"none", fontFamily:"Inter,sans-serif" };

  const active = (campaigns || [])
    .filter(c => c.status === "active")
    .filter(c => c.title?.toLowerCase().includes(search.toLowerCase()) || c.reviewer?.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => {
      if (sortBy==="newest")   return b.id - a.id;
      if (sortBy==="oldest")   return a.id - b.id;
      if (sortBy==="priority") return PO[a.priority]-PO[b.priority];
      if (sortBy==="deadline") return new Date(a.deadline)-new Date(b.deadline);
      return 0;
    });

  return (
    <div style={{ padding:"36px 40px", background:"#000", minHeight:"100vh" }}>
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:28 }}>
        <div>
          <div className="section-label">Campaign Management</div>
          <h1 className="page-title">Active Campaigns</h1>
          <p style={{ fontSize:14, color:"#555", marginTop:4 }}>{active.length} campaign{active.length!==1?"s":""} in progress</p>
        </div>
        <Link href="/campaigns/create" className="btn-primary" style={{ padding:"11px 20px", color:"#000", borderRadius:10, fontSize:13, fontWeight:700, textDecoration:"none", boxShadow:"0 4px 20px rgba(34,192,13,0.3)" }}>
          + New Campaign
        </Link>
      </div>

      <div style={{ display:"flex", gap:12, marginBottom:24 }}>
        <input placeholder="Search campaigns or reviewers…" value={search} onChange={e=>setSearch(e.target.value)} style={{...iS, flex:1}} />
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{...iS, cursor:"pointer"}}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="priority">By priority</option>
          <option value="deadline">By deadline</option>
        </select>
      </div>

      {active.length===0 && (
        <div style={{ background:"#0a0a0a", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14 }}>
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-title">{search?"No campaigns match":"No active campaigns"}</div>
            <div className="empty-state-sub">{search?"Try a different search":<Link href="/campaigns/create" style={{color:"#22c00d",textDecoration:"none"}}>Create your first →</Link>}</div>
          </div>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(340px,1fr))", gap:16 }}>
        {active.map(c=>(
          <div key={c.id} className="card-hover" style={{ background:"#0a0a0a", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:24, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:PC[c.priority]||"#333" }} />
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#fff", lineHeight:1.3, flex:1, paddingRight:12 }}>{c.title}</div>
              <div style={{ display:"flex", gap:8, alignItems:"center", flexShrink:0 }}>
                <button onClick={()=>setDeleteId(c.id)} className="btn-danger" style={{ width:32, height:32, borderRadius:8, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>🗑</button>
                <span className="badge" style={{ color:PC[c.priority], background:`${PC[c.priority]}15`, border:`1px solid ${PC[c.priority]}30` }}>{c.priority?.toUpperCase()}</span>
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:13 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span>👤</span>
                  {editingReviewer===c.id ? (
                    <select value={c.reviewer} onChange={async e=>{await updateCampaign(c.id,{reviewer:e.target.value});setEditingReviewer(null);}} style={{ background:"#000", border:"1px solid #22c00d", borderRadius:6, color:"#fff", fontSize:12, padding:"3px 8px", outline:"none" }}>
                      <option value="Nutan">Nutan</option>
                      <option value="Jazee">Jazee</option>
                    </select>
                  ) : <span style={{ fontWeight:500, color:"#fff" }}>{c.reviewer}</span>}
                </div>
                {editingReviewer!==c.id && (
                  <button onClick={()=>setEditingReviewer(c.id)} className="btn-ghost" style={{ fontSize:11, fontWeight:600, borderRadius:6, padding:"3px 9px", cursor:"pointer" }}>↺ Change</button>
                )}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"#a3a3a3" }}>
                <span>💰</span><span style={{ color:"#22c00d", fontWeight:600 }}>{c.budget}</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:"#a3a3a3" }}>
                <span>📅</span><span>Due <strong style={{ color:"#fff" }}>{c.deadline}</strong></span>
              </div>
            </div>
            <div style={{ height:1, background:"rgba(255,255,255,0.06)", marginBottom:14 }} />
          </div>
        ))}
      </div>

      {confirmId && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", backdropFilter:"blur(4px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div className="modal-enter" style={{ background:"#0a0a0a", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, padding:28, width:400 }}>
            <div style={{ fontSize:18, fontWeight:700, marginBottom:8, color:"#fff" }}>Mark as Complete?</div>
            <div style={{ fontSize:14, color:"#555", marginBottom:24 }}>This campaign moves to Completed. Cannot be undone.</div>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button onClick={()=>setConfirmId(null)} style={{ padding:"9px 18px", background:"none", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#a3a3a3", fontSize:13, cursor:"pointer" }}>Cancel</button>
              <button onClick={()=>{completeCampaign(confirmId);setConfirmId(null);}} style={{ padding:"9px 20px", background:"#22c00d", border:"none", borderRadius:10, color:"#000", fontSize:13, fontWeight:700, cursor:"pointer" }}>✓ Complete</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", backdropFilter:"blur(4px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div className="modal-enter" style={{ background:"#0a0a0a", border:"1px solid rgba(239,68,68,0.2)", borderRadius:16, padding:28, width:400 }}>
            <div style={{ fontSize:18, fontWeight:700, marginBottom:8, color:"#fff" }}>Delete Campaign?</div>
            <div style={{ fontSize:14, color:"#555", marginBottom:24 }}>This will permanently delete the campaign.</div>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button onClick={()=>setDeleteId(null)} style={{ padding:"9px 18px", background:"none", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#a3a3a3", fontSize:13, cursor:"pointer" }}>Cancel</button>
              <button onClick={()=>deleteCampaign(deleteId)&&setDeleteId(null)||setDeleteId(null)} style={{ padding:"9px 20px", background:"#ef4444", border:"none", borderRadius:10, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}