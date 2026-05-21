// ================================================
// EasyExcel - Updated Version with Dashboard
// ================================================

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

// Supabase Config
const SUPABASE_URL = "https://xtgfkriudzwpobkfufow.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Z2Zrcml1ZHp3cG9ia2Z1Zm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwOTIxNDYsImV4cCI6MjA5NDY2ODE0Nn0.47l-Z8hrMmd4X2FlVb-hspkNjxuQ7DCt91EskEGvY1A";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const ADMIN_EMAIL = "mahmud716868@gmail.com";

// CSS Styles
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', 'Noto Sans Bengali', sans-serif;
    background: #f8fafc;
    color: #0f172a;
    line-height: 1.6;
  }

  .navbar {
    background: white;
    border-bottom: 1px solid #e2e8f0;
    padding: 0 24px;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  .navbar-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 700;
    font-size: 22px;
    color: #2563eb;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
  }
  .btn-primary { background: #2563eb; color: white; }
  .btn-primary:hover { background: #1d4ed8; }
  .btn-outline { background: white; border: 1px solid #cbd5e1; color: #334155; }
  .btn-outline:hover { background: #f1f5f9; }
  .btn-danger { background: #dc2626; color: white; }

  .dashboard-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 32px 24px;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
  }
  .dashboard-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
    border-color: #2563eb;
  }

  .panel {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }

  .data-table th {
    background: #f8fafc;
    padding: 14px 12px;
    text-align: left;
    font-weight: 600;
    color: #475569;
  }
  .data-table td { padding: 12px; border-bottom: 1px solid #f1f5f9; }
  .data-table tr:hover td { background: #f8fafc; }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
  }
  .modal {
    background: white;
    border-radius: 16px;
    padding: 28px;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  }
`;

// ==================== MAIN APP ====================
export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [page, setPage] = useState("home");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    setProfileLoading(true);
    supabase.from("user_profiles").select("*").eq("user_id", user.id).single()
      .then(({ data }) => {
        if (data) setProfile(data);
        else {
          const isAdmin = user.email === ADMIN_EMAIL;
          setProfile({ status: isAdmin ? "approved" : "pending" });
        }
        setProfileLoading(false);
      });
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setPage("home");
  };

  if (authLoading || (user && profileLoading)) {
    return (
      <>
        <style>{css}</style>
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <div className="spinner" style={{width:"30px",height:"30px",border:"4px solid #e2e8f0",borderTopColor:"#2563eb",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 16px"}}></div>
          লোড হচ্ছে...
        </div>
      </>
    );
  }

  const isAdmin = user && user.email === ADMIN_EMAIL;

  if (user && isAdmin) return <AdminPanel user={user} onLogout={handleLogout} />;

  if (user && profile && profile.status !== "approved") {
    return (
      <>
        <style>{css}</style>
        <div className="pending-notice" style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
          <div className="pending-card" style={{background:"white",padding:"40px",borderRadius:"16px",textAlign:"center",maxWidth:"420px",boxShadow:"0 10px 15px rgba(0,0,0,0.1)"}}>
            <i className="ti ti-clock" style={{fontSize:"48px",color:"#d97706"}}></i>
            <h2>অনুমোদনের অপেক্ষায়</h2>
            <p>আপনার অ্যাকাউন্ট এখনো Admin এর অনুমোদন পায়নি।</p>
            <button className="btn btn-outline" onClick={handleLogout}>লগআউট</button>
          </div>
        </div>
      </>
    );
  }

  if (user && profile && profile.status === "approved") {
    return (
      <>
        <style>{css}</style>
        <MainApp user={user} onLogout={handleLogout} />
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <HomePage onLogin={() => setPage("login")} onRegister={() => setPage("register")} />
    </>
  );
}

// ==================== MAIN APP WITH DASHBOARD ====================
function MainApp({ user, onLogout }) {
  const [tabs, setTabs] = useState(() => {
    const saved = localStorage.getItem(`excel_tabs_${user.id}`);
    return saved ? JSON.parse(saved) : [{ id: "default", name: "Excel ১" }];
  });
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    localStorage.setItem(`excel_tabs_${user.id}`, JSON.stringify(tabs));
  }, [tabs, user.id]);

  const addTab = (name = "") => {
    const newId = `excel_${Date.now()}`;
    const newName = name || `Excel ${tabs.length + 1}`;
    setTabs(prev => [...prev, { id: newId, name: newName }]);
    setActiveTab(newId);
  };

  const removeTab = (id) => {
    if (tabs.length === 1) return;
    setTabs(prev => prev.filter(t => t.id !== id));
    if (activeTab === id) setActiveTab(tabs[0]?.id);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">
          <i className="ti ti-file-spreadsheet" style={{fontSize: "28px"}} />
          EasyExcel
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "14px", color: "#64748b" }}>{user.email}</span>
          <button className="btn btn-outline" onClick={onLogout}>লগআউট</button>
        </div>
      </nav>

      {!activeTab ? (
        // ==================== DASHBOARD ====================
        <div style={{ padding: "40px 24px", maxWidth: "1300px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
            <div>
              <h1 style={{ fontSize: "32px", fontWeight: 700 }}>আপনার ড্যাশবোর্ড</h1>
              <p style={{ color: "#64748b", fontSize: "17px" }}>আপনার সব Excel ফাইল এখানে দেখুন এবং ম্যানেজ করুন</p>
            </div>
            <button className="btn btn-primary" onClick={() => addTab()}>
              <i className="ti ti-plus" /> নতুন Excel তৈরি করুন
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {tabs.map((tab) => (
              <div key={tab.id} className="dashboard-card" onClick={() => setActiveTab(tab.id)}>
                <i className="ti ti-file-spreadsheet" style={{ fontSize: "52px", color: "#2563eb", marginBottom: "20px" }} />
                <h3 style={{ marginBottom: "8px", fontSize: "18px" }}>{tab.name}</h3>
                <p style={{ color: "#64748b" }}>ক্লিক করে খুলুন</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // ==================== EXCEL VIEW ====================
        <div>
          <div style={{ padding: "16px 24px", background: "white", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "16px" }}>
            <button className="btn btn-outline" onClick={() => setActiveTab(null)}>
              ← ড্যাশবোর্ডে ফিরুন
            </button>
            <h2 style={{ margin: 0, fontSize: "22px" }}>
              {tabs.find(t => t.id === activeTab)?.name}
            </h2>
          </div>

          <ExcelTab 
            user={user} 
            excelId={activeTab} 
            tabName={tabs.find(t => t.id === activeTab)?.name} 
          />
        </div>
      )}
    </div>
  );
}

// আপনার পুরানো বাকি কোড (HomePage, AuthPage, AdminPanel, ExcelTab, StepOne, StepTwo, StepThree) এখানে রাখুন
// যদি চান তাহলে StepThree এর আপডেটেড ভার্সন (Font + Size) আলাদা করে দিতে পারি।

function HomePage({ onLogin, onRegister }) {
  // আপনার পুরানো HomePage কোড এখানে রাখুন
  return <div>হোম পেজ...</div>; // আপনি নিজের কোড ব্যবহার করুন
}

// অন্যান্য কম্পোনেন্ট (AdminPanel, ExcelTab ইত্যাদি) আপনার আগের ফাইল থেকে কপি করে নিন
