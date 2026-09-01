import { useState, useEffect } from "react";
import { Dashboard } from "./dashboard";
import type { VoterResponse } from "./dashboard";
import { SubmissionsList } from "./submissions-list";
import { ChairmanList } from "./chairman-list";
import { LayoutDashboard, Users, LogOut, KeyRound, Mail, Award, Eye, EyeOff } from "lucide-react";
import { translations } from "../data/translations";

export function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "forgot_send" | "forgot_verify" | "forgot_reset">("login");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentTab, setCurrentTab] = useState<"dashboard" | "submissions" | "chairman">("dashboard");
  const [voters, setVoters] = useState<VoterResponse[]>([]);
  const [initialChoiceFilter, setInitialChoiceFilter] = useState("");
  const [initialChairmanFilter, setInitialChairmanFilter] = useState("");
  const [lang] = useState<"en" | "hi">("en");
  const t = translations[lang];

  // Sync tab with URL Hash for browser back/next navigation support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "dashboard" || hash === "submissions" || hash === "chairman") {
        setCurrentTab(hash);
      } else {
        // Default to current location hash if empty
        window.location.hash = currentTab;
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    
    // Set initial tab from hash or set hash to default
    const initialHash = window.location.hash.replace("#", "");
    if (initialHash === "dashboard" || initialHash === "submissions" || initialHash === "chairman") {
      setCurrentTab(initialHash);
    } else {
      window.location.hash = "dashboard";
    }

    return () => window.location.hash && window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Load responses from API / localStorage
  useEffect(() => {
    const checkToken = localStorage.getItem("survey_admin_token");
    if (checkToken) {
      setIsAuthenticated(true);
    }
    loadVoters();

    // Auto-poll the database every 3 seconds to fetch new responses in real-time
    const interval = setInterval(loadVoters, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadVoters = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/responses");
      if (res.ok) {
        const data = await res.json();
        setVoters(data);
        localStorage.setItem("community_survey_responses", JSON.stringify(data));
        return;
      }
    } catch (e) {
      console.warn("Local API fetch failed, loading fallback from localStorage", e);
    }
    
    const data = localStorage.getItem("community_survey_responses");
    if (data) {
      setVoters(JSON.parse(data));
    } else {
      setVoters([]);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setSuccessMessage("");
    try {
      const res = await fetch("http://localhost:3001/api/admin/admin_login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          frontend_email: username,
          frontend_password: password,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("survey_admin_token", data.token);
        setIsAuthenticated(true);
        setPassword("");
      } else {
        setAuthError(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      setAuthError("Failed to connect to backend server");
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("survey_admin_token");
      await fetch("http://localhost:3001/api/admin/admin_logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
    } catch (e) {
      console.error("Logout request failed", e);
    }
    localStorage.removeItem("survey_admin_token");
    setIsAuthenticated(false);
    setAuthMode("login");
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setSuccessMessage("");
    try {
      const res = await fetch("http://localhost:3001/api/admin/sendOtpTOadmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage("OTP sent successfully to your email!");
        setAuthMode("forgot_verify");
      } else {
        setAuthError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      setAuthError("Failed to connect to backend server");
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setSuccessMessage("");
    try {
      const res = await fetch("http://localhost:3001/api/admin/verifyOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, otp: otp }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("survey_admin_token", data.token);
        setSuccessMessage("OTP verified successfully! Please set your new password.");
        setAuthMode("forgot_reset");
      } else {
        setAuthError(data.message || "Invalid or expired OTP");
      }
    } catch (err) {
      console.error(err);
      setAuthError("Failed to connect to backend server");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setSuccessMessage("");
    try {
      const token = localStorage.getItem("survey_admin_token");
      const res = await fetch("http://localhost:3001/api/admin/admin_forgatePassword", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ email: username, newPassword: newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage("Password updated successfully! Please login with your new password.");
        setAuthMode("login");
        setOtp("");
        setNewPassword("");
        setPassword("");
      } else {
        setAuthError(data.message || "Failed to update password. Try again.");
      }
    } catch (err) {
      console.error(err);
      setAuthError("Failed to connect to backend server");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t.deleteAlert)) {
      try {
        await fetch(`http://localhost:3001/api/responses/${id}`, {
          method: "DELETE",
        });
      } catch (e) {
        console.error("Failed to delete from API", e);
      }
      const updated = voters.filter((v) => v.id !== id);
      localStorage.setItem("community_survey_responses", JSON.stringify(updated));
      setVoters(updated);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="bg-scene" aria-hidden="true" />
        <div className="bg-overlay" aria-hidden="true" />
        
        <div className="auth-card">

          <div className="auth-header">
            <h1>{t.adminPortal}</h1>
            <p>{t.voterCountingAdmin}</p>
          </div>
          
          {authError && <div className="error-banner">{authError}</div>}
          {successMessage && (
            <div className="success-banner" style={{ color: "#10b981", backgroundColor: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "10px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", textAlign: "center" }}>
              {successMessage}
            </div>
          )}
          
          {authMode === "login" && (
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">{t.emailAddress}</label>
                <div className="input-wrapper">
                  <Mail size={16} />
                  <input
                    id="email"
                    type="email"
                    placeholder={t.enterEmail}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="password">{t.password}</label>
                <div className="input-wrapper">
                  <KeyRound size={16} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t.enterPassword}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: "44px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "var(--muted)",
                      zIndex: 10,
                      height: "20px",
                      width: "20px"
                    }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              <button className="btn-primary" type="submit">
                {t.signIn}
              </button>

              <div style={{ marginTop: "16px", textAlign: "center" }}>
                <button 
                  type="button" 
                  className="link-btn" 
                  onClick={() => { setAuthMode("forgot_send"); setAuthError(""); setSuccessMessage(""); }}
                  style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: "14px", textDecoration: "underline" }}
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          )}

          {authMode === "forgot_send" && (
            <form className="auth-form" onSubmit={handleSendOTP}>
              <div className="form-group">
                <label htmlFor="email">{t.emailAddress}</label>
                <div className="input-wrapper">
                  <Mail size={16} />
                  <input
                    id="email"
                    type="email"
                    placeholder={t.enterEmail}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <button className="btn-primary" type="submit">
                Send OTP
              </button>

              <div style={{ marginTop: "16px", textAlign: "center" }}>
                <button 
                  type="button" 
                  className="link-btn" 
                  onClick={() => { setAuthMode("login"); setAuthError(""); setSuccessMessage(""); }}
                  style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: "14px", textDecoration: "underline" }}
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {authMode === "forgot_verify" && (
            <form className="auth-form" onSubmit={handleVerifyOTP}>
              <div className="form-group">
                <label htmlFor="email">{t.emailAddress}</label>
                <div className="input-wrapper">
                  <Mail size={16} />
                  <input
                    id="email"
                    type="email"
                    value={username}
                    disabled
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="otp">Enter 4-Digit OTP</label>
                <div className="input-wrapper">
                  <KeyRound size={16} />
                  <input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <button className="btn-primary" type="submit">
                Verify OTP
              </button>

              <div style={{ marginTop: "16px", textAlign: "center" }}>
                <button 
                  type="button" 
                  className="link-btn" 
                  onClick={() => { setAuthMode("forgot_send"); setAuthError(""); setSuccessMessage(""); }}
                  style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: "14px", textDecoration: "underline" }}
                >
                  Resend OTP / Back
                </button>
              </div>
            </form>
          )}

          {authMode === "forgot_reset" && (
            <form className="auth-form" onSubmit={handleResetPassword}>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <div className="input-wrapper">
                  <KeyRound size={16} />
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    style={{ paddingRight: "44px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "var(--muted)",
                      zIndex: 10,
                      height: "20px",
                      width: "20px"
                    }}
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              <button className="btn-primary" type="submit">
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="app-layout">
        <div className="bg-scene" aria-hidden="true" />
        <div className="bg-overlay" aria-hidden="true" />

        {/* Sidebar Navigation */}
        <aside className="sidebar">
          <div>
            <div className="sidebar-brand">
              <h2>{t.surveyAdmin}</h2>
            </div>
            <nav className="nav-links">
              <button
                className={`nav-item ${currentTab === "dashboard" ? "active" : ""}`}
                onClick={() => { window.location.hash = "dashboard"; }}
              >
                <LayoutDashboard size={18} />
                {t.dashboard}
              </button>
              <button
                className={`nav-item ${currentTab === "submissions" ? "active" : ""}`}
                onClick={() => { window.location.hash = "submissions"; }}
              >
                <Users size={18} />
                {t.submissions}
              </button>
              <button
                className={`nav-item ${currentTab === "chairman" ? "active" : ""}`}
                onClick={() => { window.location.hash = "chairman"; }}
              >
                <Award size={18} />
                {lang === "hi" ? "चेयरमैन प्राथमिकता" : "Chairman Preferences"}
              </button>
              <button className="nav-item nav-item-logout" onClick={handleLogout} style={{ marginTop: "16px" }}>
                <LogOut size={18} />
                {t.logout}
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          <header className="top-bar">
            <h1>
              {currentTab === "dashboard" && t.performanceDashboard}
              {currentTab === "submissions" && t.submissionsListTitle}
              {currentTab === "chairman" && (lang === "hi" ? "चेयरमैन मत रिपोर्ट सूची" : "Chairman Submissions Log")}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div className="user-profile">
                <span>{t.administrator}</span>
              </div>
              <button 
                className="btn-secondary btn-danger header-logout-btn" 
                onClick={handleLogout}
                style={{ 
                  height: "36px", 
                  padding: "0 14px", 
                  fontSize: "13px", 
                  display: "inline-flex", 
                  alignItems: "center",
                  gap: "6px",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                <LogOut size={15} />
                <span>{t.logout}</span>
              </button>
            </div>
          </header>

          <div className="page-body">
            {currentTab === "dashboard" && (
              <Dashboard 
                voters={voters} 
                onPartyCardClick={(party) => {
                  setInitialChoiceFilter(party);
                  window.location.hash = "submissions";
                }}
                onDelete={handleDelete}
                lang={lang}
              />
            )}
            {currentTab === "submissions" && (
              <SubmissionsList 
                voters={voters} 
                onDelete={handleDelete} 
                initialChoiceFilter={initialChoiceFilter}
                onClearFilter={() => {
                  setInitialChoiceFilter("");
                }}
                lang={lang}
              />
            )}
            {currentTab === "chairman" && (
              <ChairmanList 
                voters={voters} 
                initialChairmanFilter={initialChairmanFilter}
                onClearFilter={() => {
                  setInitialChairmanFilter("");
                }}
                lang={lang}
              />
            )}
          </div>
        </main>
      </div>

      {/* Floating Bottom Tab Bar for Mobile */}
      <div
        className="mobile-bottom-nav"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: "68px",
          background: "#ffffff",
          borderTop: "1px solid #e2e8f0",
          boxShadow: "0 -4px 20px rgba(15, 23, 42, 0.08)",
          zIndex: 999999,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "4px 8px"
        }}
      >
        <button
          type="button"
          className={`mobile-nav-item ${currentTab === "dashboard" ? "active" : ""}`}
          onClick={() => { window.location.hash = "dashboard"; }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "3px",
            flex: 1,
            maxWidth: "110px",
            height: "56px",
            borderRadius: "16px",
            padding: "6px 4px",
            border: "none",
            cursor: "pointer",
            background: currentTab === "dashboard" ? "#eeedfe" : "transparent",
            color: currentTab === "dashboard" ? "#5542f6" : "#64748b",
            fontWeight: currentTab === "dashboard" ? 700 : 500
          }}
        >
          <LayoutDashboard size={22} color={currentTab === "dashboard" ? "#5542f6" : "#64748b"} strokeWidth={currentTab === "dashboard" ? 2.3 : 2} />
          <span style={{ fontSize: "11px", color: currentTab === "dashboard" ? "#5542f6" : "#64748b" }}>
            {lang === "hi" ? "डैशबोर्ड" : "Dashboard"}
          </span>
        </button>

        <button
          type="button"
          className={`mobile-nav-item ${currentTab === "submissions" ? "active" : ""}`}
          onClick={() => { window.location.hash = "submissions"; }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "3px",
            flex: 1,
            maxWidth: "110px",
            height: "56px",
            borderRadius: "16px",
            padding: "6px 4px",
            border: "none",
            cursor: "pointer",
            background: currentTab === "submissions" ? "#eeedfe" : "transparent",
            color: currentTab === "submissions" ? "#5542f6" : "#64748b",
            fontWeight: currentTab === "submissions" ? 700 : 500
          }}
        >
          <Users size={22} color={currentTab === "submissions" ? "#5542f6" : "#64748b"} strokeWidth={currentTab === "submissions" ? 2.3 : 2} />
          <span style={{ fontSize: "11px", color: currentTab === "submissions" ? "#5542f6" : "#64748b" }}>
            {lang === "hi" ? "वोट सूची" : "Voters"}
          </span>
        </button>

        <button
          type="button"
          className={`mobile-nav-item ${currentTab === "chairman" ? "active" : ""}`}
          onClick={() => { window.location.hash = "chairman"; }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "3px",
            flex: 1,
            maxWidth: "110px",
            height: "56px",
            borderRadius: "16px",
            padding: "6px 4px",
            border: "none",
            cursor: "pointer",
            background: currentTab === "chairman" ? "#eeedfe" : "transparent",
            color: currentTab === "chairman" ? "#5542f6" : "#64748b",
            fontWeight: currentTab === "chairman" ? 700 : 500
          }}
        >
          <Award size={22} color={currentTab === "chairman" ? "#5542f6" : "#64748b"} strokeWidth={currentTab === "chairman" ? 2.3 : 2} />
          <span style={{ fontSize: "11px", color: currentTab === "chairman" ? "#5542f6" : "#64748b" }}>
            {lang === "hi" ? "चेयरमैन" : "Chairman"}
          </span>
        </button>
      </div>
    </>
  );
}
