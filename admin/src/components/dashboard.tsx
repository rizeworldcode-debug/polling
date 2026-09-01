import { useState, useEffect } from "react";
import { Users, MapPin, Award, Trash2, ChevronDown, Check } from "lucide-react";
import { transliterateNameToHindi, ensureEnglish } from "../lib/transliterate";
import { wards, getWardCategoryLabel } from "../data/wards";
import { API_BASE_URL } from "../config/apiConfig";

export type WardVoter = {
  serialNumber: number;
  epicNumber?: string;
  voterName: string;
  relativeName: string;
  houseNumber?: string;
  age?: number;
  gender?: string;
  wardNumber: string;
};

function PartyLogo({ option, size = 20 }: { option: string; size?: number }) {
  if (option === "BJP") {
    return (
      <img 
        src="/images/bjp logo.jpg" 
        alt="BJP" 
        style={{ 
          width: size, 
          height: size, 
          objectFit: "contain", 
          mixBlendMode: "multiply", 
          borderRadius: "50%",
          display: "inline-block",
          verticalAlign: "middle"
        }} 
      />
    );
  }
  if (option === "Congress") {
    return (
      <img 
        src="/images/congress logo.jpg" 
        alt="INC" 
        style={{ 
          width: size, 
          height: size, 
          objectFit: "contain", 
          mixBlendMode: "multiply", 
          borderRadius: "50%",
          display: "inline-block",
          verticalAlign: "middle"
        }} 
      />
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <circle cx="12" cy="12" r="10" stroke="#6C757D" strokeWidth="2"/>
      <path d="M12 8v8M8 12h8" stroke="#6C757D" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export type VoterResponse = {
  id: string;
  wardNumber: string;
  voterName: string;
  fatherName: string;
  mobileNumber: string;
  address?: string;
  candidateName?: string;
  selectedChairman?: string;
  serialNumber?: number;
  epicNumber?: string;
  houseNumber?: string;
  age?: number;
  gender?: string;
  selectedOption: string;
  timestamp: string;
};

import { translations } from "../data/translations";

type DashboardProps = {
  voters: VoterResponse[];
  onPartyCardClick: (party: string) => void;
  onDelete: (id: string) => void;
  lang: "en" | "hi";
};

export function Dashboard({ voters, onPartyCardClick, onDelete, lang }: DashboardProps) {
  const totalVotes = voters.length;
  const t = translations[lang];

  const [selectedWard, setSelectedWard] = useState<string>("1");
  const [wardVoters, setWardVoters] = useState<WardVoter[]>([]);
  const [isLoadingWardVoters, setIsLoadingWardVoters] = useState<boolean>(false);
  const [isWardDropdownOpen, setIsWardDropdownOpen] = useState<boolean>(false);

  const selectedWardObj = wards.find(wd => String(wd.wardNumber) === String(selectedWard));
  const selectedCategoryLabel = selectedWardObj ? getWardCategoryLabel(selectedWardObj.category, lang) : "";

  useEffect(() => {
    let isMounted = true;
    async function fetchWardVoters() {
      setIsLoadingWardVoters(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/voters/ward/${selectedWard}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setWardVoters(data);
          }
        }
      } catch (error) {
        console.error("Error loading ward voters:", error);
      } finally {
        if (isMounted) {
          setIsLoadingWardVoters(false);
        }
      }
    }
    fetchWardVoters();
    return () => {
      isMounted = false;
    };
  }, [selectedWard]);

  // Calculate active wards
  const activeWards = new Set(voters.map((v) => v.wardNumber)).size;

  // Calculate vote share counts
  const voteShare = voters.reduce(
    (acc, curr) => {
      const option = curr.selectedOption;
      if (option === "BJP" || option === "Congress" || option === "Others") {
        acc[option]++;
      }
      return acc;
    },
    { BJP: 0, Congress: 0, Others: 0 }
  );


  // Get leading party
  let leadingParty = "None";
  let maxVotes = 0;
  Object.entries(voteShare).forEach(([party, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      leadingParty = party;
    }
  });

  // Calculate percentages
  const getPercentage = (count: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((count / totalVotes) * 100);
  };

  const bjpPercent = getPercentage(voteShare.BJP);
  const congressPercent = getPercentage(voteShare.Congress);
  const othersPercent = getPercentage(voteShare.Others);

  const [hoveredParty, setHoveredParty] = useState<{ name: string; percent: number; color: string; votes: number } | null>(null);

  const activeTooltip = hoveredParty || {
    name: "BJP",
    percent: totalVotes > 0 ? bjpPercent : 0,
    votes: voteShare.BJP,
    color: "#ff5500"
  };


  // Donut chart calculations
  const totalVotesCount = totalVotes > 0 ? totalVotes : 3;
  const bjpVal = totalVotes > 0 ? voteShare.BJP : 1;
  const congressVal = totalVotes > 0 ? voteShare.Congress : 1;
  const othersVal = totalVotes > 0 ? voteShare.Others : 1;

  const bjpPct = (bjpVal / totalVotesCount) * 100;
  const congressPct = (congressVal / totalVotesCount) * 100;
  const othersPct = (othersVal / totalVotesCount) * 100;

  const circ = 2 * Math.PI * 52; // 326.72
  const bjpLen = (bjpPct / 100) * circ;
  const congressLen = (congressPct / 100) * circ;
  const othersLen = (othersPct / 100) * circ;

  const bjpDash = bjpVal > 0 ? Math.max(0, bjpLen - 3) : 0;
  const congressDash = congressVal > 0 ? Math.max(0, congressLen - 3) : 0;
  const othersDash = othersVal > 0 ? Math.max(0, othersLen - 3) : 0;
  const votedVotersCount = wardVoters.filter((voter) => {
    return voters.some((response) => {
      if (String(response.wardNumber) !== String(selectedWard)) return false;
      const norm = (str: string = "") => str.trim().toLowerCase().replace(/\s+/g, " ");
      if (voter.epicNumber && response.epicNumber && norm(voter.epicNumber) === norm(response.epicNumber)) {
        return true;
      }
      const matchName = norm(response.voterName) === norm(voter.voterName);
      const matchFather = norm(response.fatherName) === norm(voter.relativeName);
      return matchName && matchFather;
    });
  }).length;

  return (
    <div style={{ paddingBottom: "40px" }}>
      {/* Stats Grid */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon navy">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span>{t.totalSubmissions}</span>
            <strong>{totalVotes}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon saffron">
            <MapPin size={24} />
          </div>
          <div className="stat-info">
            <span>{t.activeWards}</span>
            <strong>{activeWards}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <Award size={24} />
          </div>
          <div className="stat-info">
            <span>{t.leadingParty}</span>
            <strong>{totalVotes > 0 ? leadingParty : "N/A"}</strong>
          </div>
        </div>
      </div>

      {/* Party Preference Cards */}
      <h3 style={{ fontSize: "12px", fontWeight: 750, margin: "28px 0 14px", textTransform: "uppercase", color: "var(--navy)", letterSpacing: "0.05em" }}>
        {lang === "hi" ? "पार्टी प्राथमिकता (वोटर सूची देखने के लिए क्लिक करें)" : "Party Preference Channels (Click to see voter lists)"}
      </h3>
      <div className="dashboard-grid" style={{ marginBottom: "32px" }}>
        <div className="stat-card clickable-party-card bjp-card" onClick={() => onPartyCardClick("BJP")} style={{ cursor: "pointer", display: "flex", flexDirection: "row", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
            <div className="stat-icon bjp-logo-bg" style={{ flexShrink: 0, width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PartyLogo option="BJP" size={24} />
            </div>
            <div className="stat-info" style={{ minWidth: 0 }}>
              <span>{lang === "hi" ? "भाजपा प्राथमिकता" : "BJP Preference"}</span>
              <strong>{voteShare.BJP}</strong>
            </div>
          </div>
        </div>

        <div className="stat-card clickable-party-card congress-card" onClick={() => onPartyCardClick("Congress")} style={{ cursor: "pointer", display: "flex", flexDirection: "row", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
            <div className="stat-icon congress-logo-bg" style={{ flexShrink: 0, width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PartyLogo option="Congress" size={24} />
            </div>
            <div className="stat-info" style={{ minWidth: 0 }}>
              <span>{lang === "hi" ? "कांग्रेस प्राथमिकता" : "Congress Preference"}</span>
              <strong>{voteShare.Congress}</strong>
            </div>
          </div>
        </div>

        <div className="stat-card clickable-party-card others-card" onClick={() => onPartyCardClick("Others")} style={{ cursor: "pointer", display: "flex", flexDirection: "row", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
            <div className="stat-icon others-logo-bg" style={{ flexShrink: 0, width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PartyLogo option="Others" size={24} />
            </div>
            <div className="stat-info" style={{ minWidth: 0 }}>
              <span>{lang === "hi" ? "अन्य प्राथमिकता" : "Others Preference"}</span>
              <strong>{voteShare.Others}</strong>
            </div>
          </div>
        </div>
      </div>


      {/* Charts & Table Sections */}
      <div className="sections-grid">
        {/* Preference Analytics Chart */}
        <div className="card">
          <div className="card-header">
            <h3>{t.partyDistribution}</h3>
          </div>
          <div style={{ display: "flex", justifyContent: "center", padding: "10px 0", minHeight: "240px", alignItems: "center", overflow: "hidden", maxWidth: "100%" }}>
            <svg width="100%" height="240" viewBox="0 0 300 240" style={{ overflow: "visible" }}>
              <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* Donut Chart Group */}
              <g filter="url(#shadow)">
                {/* BJP / Leading Segment (Orange) */}
                {/* BJP / Leading Segment (Orange) */}
                <circle
                  cx="150"
                  cy="130"
                  r="52"
                  fill="none"
                  stroke="#ff5500"
                  strokeWidth="24"
                  strokeDasharray={`${bjpDash} ${circ}`}
                  strokeDashoffset="0"
                  style={{ transition: "stroke-dasharray 0.8s ease", cursor: "pointer" }}
                  onClick={() => onPartyCardClick("BJP")}
                  onMouseEnter={() => setHoveredParty({ name: "BJP", percent: bjpPercent, votes: voteShare.BJP, color: "#ff5500" })}
                  onMouseLeave={() => setHoveredParty(null)}
                  className="donut-slice"
                />

                {/* Congress Segment (Blue) */}
                <circle
                  cx="150"
                  cy="130"
                  r="52"
                  fill="none"
                  stroke="#1976d2"
                  strokeWidth="24"
                  strokeDasharray={`${congressDash} ${circ}`}
                  strokeDashoffset={-bjpLen}
                  style={{ transition: "stroke-dashoffset 0.8s ease, stroke-dasharray 0.8s ease", cursor: "pointer" }}
                  onClick={() => onPartyCardClick("Congress")}
                  onMouseEnter={() => setHoveredParty({ name: "INC", percent: congressPercent, votes: voteShare.Congress, color: "#1976d2" })}
                  onMouseLeave={() => setHoveredParty(null)}
                  className="donut-slice"
                />

                {/* Others Segment (Gray) */}
                <circle
                  cx="150"
                  cy="130"
                  r="52"
                  fill="none"
                  stroke="#7e8a96"
                  strokeWidth="24"
                  strokeDasharray={`${othersDash} ${circ}`}
                  strokeDashoffset={-(bjpLen + congressLen)}
                  style={{ transition: "stroke-dashoffset 0.8s ease, stroke-dasharray 0.8s ease", cursor: "pointer" }}
                  onClick={() => onPartyCardClick("Others")}
                  onMouseEnter={() => setHoveredParty({ name: "OTH", percent: othersPercent, votes: voteShare.Others, color: "#7e8a96" })}
                  onMouseLeave={() => setHoveredParty(null)}
                  className="donut-slice"
                />
              </g>

              {/* Center labels */}
              <circle cx="150" cy="130" r="40" fill="white" />
              <text x="150" y="126" fill="var(--muted)" fontSize="9" fontWeight="700" textAnchor="middle" letterSpacing="0.05em">{lang === "hi" ? "कुल मत" : "TOTAL VOTES"}</text>
              <text x="150" y="142" fill="#0f172a" fontSize="16" fontWeight="800" textAnchor="middle">{totalVotes}</text>

              {/* Top diamond marker & Tooltip dynamically updated */}
              <g style={{ transition: "all 0.3s ease" }}>
                <line x1="150" y1="90" x2="150" y2="114" stroke="white" strokeWidth="2.5" />
                <rect x="90" y="24" width="120" height="22" rx="6" fill={activeTooltip.color} style={{ transition: "fill 0.3s ease" }} />
                <polygon points="146,46 150,50 154,46" fill={activeTooltip.color} style={{ transition: "fill 0.3s ease" }} />
                <polygon points="150,56 153,60 150,64 147,60" fill={activeTooltip.color} style={{ transition: "fill 0.3s ease" }} />
                <text x="150" y="38" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="0.02em" style={{ transition: "fill 0.3s ease" }}>
                  {activeTooltip.name}: {activeTooltip.percent}% ({activeTooltip.votes} {lang === "hi" ? "मत" : "votes"})
                </text>
              </g>
            </svg>
          </div>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "16px", padding: "12px 16px", borderTop: "1px solid var(--border)", marginTop: "10px", background: "#f8fafc", borderRadius: "0 0 12px 12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "var(--navy)" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5500", display: "inline-block" }} />
              <span>{lang === "hi" ? "भाजपा" : "BJP"}: {bjpPercent}% ({voteShare.BJP})</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "var(--navy)" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#1976d2", display: "inline-block" }} />
              <span>{lang === "hi" ? "कांग्रेस" : "INC"}: {congressPercent}% ({voteShare.Congress})</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "var(--navy)" }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#7e8a96", display: "inline-block" }} />
              <span>{lang === "hi" ? "अन्य" : "OTH"}: {othersPercent}% ({voteShare.Others})</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Log with Ward Selection */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ margin: 0 }}>{t.recentActivityLog}</h3>
            <div className="header-controls">
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--muted)" }}>{t.selectWard}:</span>
              <div className="custom-select-container" style={{ position: "relative", minWidth: "120px" }}>
                <button
                  type="button"
                  className="select-trigger"
                  onClick={() => setIsWardDropdownOpen(!isWardDropdownOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--line)",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "var(--navy)",
                    background: "white",
                    cursor: "pointer",
                    width: "100%",
                    outline: "none"
                  }}
                >
                  <span>{lang === "hi" ? `वार्ड ${selectedWard} (${selectedCategoryLabel})` : `Ward ${selectedWard} (${selectedCategoryLabel})`}</span>
                  <ChevronDown size={14} style={{ transform: isWardDropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>

                {isWardDropdownOpen && (
                  <>
                    <div 
                      onClick={() => setIsWardDropdownOpen(false)} 
                      style={{ position: "fixed", inset: 0, zIndex: 999 }} 
                    />
                    <ul 
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        marginTop: "4px",
                        padding: "4px 0",
                        background: "white",
                        border: "1px solid var(--line)",
                        borderRadius: "6px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                        listStyle: "none",
                        maxHeight: "200px",
                        overflowY: "auto",
                        zIndex: 1000,
                        margin: 0
                      }}
                    >
                      {Array.from({ length: 25 }, (_, i) => String(i + 1)).map((w) => {
                        const isSelected = String(w) === String(selectedWard);
                        const wObj = wards.find(wd => String(wd.wardNumber) === String(w));
                        const cat = wObj ? getWardCategoryLabel(wObj.category, lang) : "";
                        return (
                          <li
                            key={w}
                            onClick={() => {
                              setSelectedWard(w);
                              setIsWardDropdownOpen(false);
                            }}
                            style={{
                              padding: "8px 12px",
                              fontSize: "13px",
                              fontWeight: isSelected ? "700" : "500",
                              color: isSelected ? "var(--saffron)" : "var(--ink)",
                              background: isSelected ? "var(--navy-soft)" : "transparent",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between"
                            }}
                          >
                            <span>{lang === "hi" ? `वार्ड ${w} (${cat})` : `Ward ${w} (${cat})`}</span>
                            {isSelected && <Check size={14} />}
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </div>
              {selectedCategoryLabel && (
                <span className="badge info" style={{ fontSize: "12px", padding: "6px 10px", fontWeight: "700", backgroundColor: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }}>
                  {lang === "hi" ? "सीट प्रकार" : "Seat Type"}: {selectedCategoryLabel}
                </span>
              )}
              <span className="badge info" style={{ fontSize: "12px", padding: "6px 10px", fontWeight: "700" }}>
                {t.totalMembers}: {wardVoters.length}
              </span>
              <span className="badge success" style={{ fontSize: "12px", padding: "6px 10px", fontWeight: "700", backgroundColor: "#d1fae5", color: "#065f46" }}>
                {lang === "hi" ? "चयनित (वोटेड)" : "Voted"}: {votedVotersCount}
              </span>
            </div>
          </div>
          {isLoadingWardVoters ? (
            <div style={{ color: "var(--muted)", padding: "32px 0", textAlign: "center", fontSize: "14px" }}>
              {lang === "hi" ? "मतदाता सूची लोड हो रही है..." : "Loading voter list..."}
            </div>
          ) : wardVoters.length === 0 ? (
            <div style={{ color: "var(--muted)", padding: "32px 0", textAlign: "center", fontSize: "14px" }}>
              {lang === "hi" ? "इस वार्ड में कोई मतदाता नहीं मिला।" : "No voters found in this ward."}
            </div>
          ) : (
            <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: "60px" }}>S.No</th>
                    <th>{t.thVoter}</th>
                    <th>{t.thFather}</th>
                    <th>House No.</th>
                    <th style={{ width: "130px" }}>{t.thChoice}</th>
                    <th style={{ width: "130px" }}>{t.thCandidate}</th>
                    <th style={{ textAlign: "right", width: "100px" }}>{t.thActions}</th>
                  </tr>
                </thead>
                <tbody>
                  {wardVoters.map((voter) => {
                    // Match with survey submissions
                    const matchedResponse = voters.find((response) => {
                      if (String(response.wardNumber) !== String(selectedWard)) return false;
                      const norm = (str: string = "") => str.trim().toLowerCase().replace(/\s+/g, " ");
                      if (voter.epicNumber && response.epicNumber && norm(voter.epicNumber) === norm(response.epicNumber)) {
                        return true;
                      }
                      const matchName = norm(response.voterName) === norm(voter.voterName);
                      const matchFather = norm(response.fatherName) === norm(voter.relativeName);
                      return matchName && matchFather;
                    });

                    return (
                      <tr key={voter.serialNumber}>
                        <td data-label={lang === "hi" ? "क्रमांक" : "S.No"}>{voter.serialNumber}</td>
                        <td data-label={lang === "hi" ? "मतदाता विवरण" : "Voter Details"} style={{ fontWeight: 600 }}>
                          {lang === "hi" ? transliterateNameToHindi(voter.voterName) : ensureEnglish(voter.voterName)}
                        </td>
                        <td data-label={lang === "hi" ? "संबंधी का नाम" : "Relative Name"}>
                          {lang === "hi" ? transliterateNameToHindi(voter.relativeName) : ensureEnglish(voter.relativeName)}
                        </td>
                        <td data-label={lang === "hi" ? "मकान संख्या" : "House No."}>{voter.houseNumber || "-"}</td>
                        <td data-label={lang === "hi" ? "पसंद" : "Choice"}>
                          {matchedResponse ? (
                            <span className={`badge ${matchedResponse.selectedOption.toLowerCase()}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                              <PartyLogo option={matchedResponse.selectedOption} size={22} />
                              {matchedResponse.selectedOption}
                            </span>
                          ) : (
                            <span className="badge" style={{ backgroundColor: "#fee2e2", color: "#ef4444", border: "1px solid #fecaca", fontWeight: "600" }}>
                              {t.notSelected}
                            </span>
                          )}
                        </td>
                        <td data-label={lang === "hi" ? "प्रत्याशी" : "Candidate"}>
                          {matchedResponse && matchedResponse.candidateName ? (
                            <span style={{ fontWeight: "500", color: "var(--navy)" }}>
                              {lang === "hi" ? transliterateNameToHindi(matchedResponse.candidateName) : ensureEnglish(matchedResponse.candidateName)}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td data-label={lang === "hi" ? "कार्रवाई" : "Actions"} style={{ textAlign: "right" }}>
                          {matchedResponse ? (
                            <button
                              className="btn-secondary btn-danger"
                              style={{ 
                                padding: "4px 8px", 
                                height: "auto", 
                                display: "inline-flex", 
                                alignItems: "center", 
                                gap: "4px",
                                fontSize: "11px",
                                fontWeight: 600
                              }}
                              onClick={() => onDelete(matchedResponse.id)}
                              title={t.btnDelete}
                            >
                              <Trash2 size={12} />
                              {t.btnDelete}
                            </button>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
