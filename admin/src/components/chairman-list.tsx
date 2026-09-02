import { useState, useEffect } from "react";
import type { VoterResponse } from "./dashboard";
import { Search } from "lucide-react";
import { getWardAreaName } from "../data/wards";
import { translations } from "../data/translations";
import { transliterateNameToHindi, ensureEnglish } from "../lib/transliterate";
import { bjpCandidates, isBjpCandidate } from "../data/bjpCandidates";
import { congressCandidates, isCongressCandidate } from "../data/congressCandidates";

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

type ChairmanListProps = {
  voters: VoterResponse[];
  lang: "en" | "hi";
  initialChairmanFilter: string;
  onClearFilter: () => void;
};

export function ChairmanList({ 
  voters, 
  lang,
  initialChairmanFilter,
  onClearFilter
}: ChairmanListProps) {
  const [search, setSearch] = useState("");
  const [wardFilter, setWardFilter] = useState("");
  const [chairmanFilter, setChairmanFilter] = useState(initialChairmanFilter);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setChairmanFilter(initialChairmanFilter);
  }, [initialChairmanFilter]);
  const itemsPerPage = 10;

  const t = translations[lang];

  // Filter list
  const filteredVoters = voters.filter((v) => {
    const matchesSearch =
      v.voterName.toLowerCase().includes(search.toLowerCase()) ||
      v.fatherName.toLowerCase().includes(search.toLowerCase()) ||
      v.mobileNumber.includes(search) ||
      (v.epicNumber && v.epicNumber.toLowerCase().includes(search.toLowerCase())) ||
      (v.address && v.address.toLowerCase().includes(search.toLowerCase()));
    const matchesWard = wardFilter === "" || v.wardNumber === wardFilter;
    const matchesChairman = chairmanFilter === "" || v.selectedChairman === chairmanFilter;

    return matchesSearch && matchesWard && matchesChairman;
  });

  // Calculate unique wards for filter
  const uniqueWards = Array.from(new Set(voters.map((v) => v.wardNumber))).sort(
    (a, b) => Number(a) - Number(b)
  );

  // Dynamic chairman dropdown options
  const chairmanDropdownOptions = Array.from(
    new Set([
      ...bjpCandidates.filter((c) => !c.isVacant).map((c) => c.nameEn),
      ...congressCandidates.filter((c) => !c.isVacant).map((c) => c.nameEn),
      "Mohit",
      "Manoj",
      ...voters.map((v) => v.selectedChairman).filter(Boolean) as string[],
    ])
  );

  // Pagination calculations
  const totalItems = filteredVoters.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVoters = filteredVoters.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getChairmanPartyLogo = (name?: string) => {
    if (!name) return "Others";
    if (isCongressCandidate(name)) return "Congress";
    if (isBjpCandidate(name)) return "BJP";
    return "Others";
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>{lang === "hi" ? "चेयरमैन मत सूची" : "Chairman Voting Logs"}</h3>
      </div>

      {/* Toolbar / Search & Filter */}
      <div className="toolbar">
        <div className="input-wrapper" style={{ flex: 1, minWidth: "220px" }}>
          <Search size={16} />
          <input
            type="text"
            className="search-input"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <select
          className="filter-select"
          value={wardFilter}
          onChange={(e) => {
            setWardFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">{t.allWards}</option>
          {uniqueWards.map((ward) => (
            <option key={ward} value={ward}>
              {t.ward} {ward}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={chairmanFilter}
          onChange={(e) => {
            const val = e.target.value;
            setChairmanFilter(val);
            if (val === "") {
              onClearFilter();
            }
            setCurrentPage(1);
          }}
        >
          <option value="">{lang === "hi" ? "सभी चेयरमैन" : "All Chairmen"}</option>
          {chairmanDropdownOptions.map((name) => (
            <option key={name} value={name}>
              {lang === "hi" ? transliterateNameToHindi(name) : ensureEnglish(name)}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {filteredVoters.length === 0 ? (
        <div style={{ color: "var(--muted)", padding: "32px 0", textAlign: "center", fontSize: "14px" }}>
          {t.noRecords}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t.thVoter}</th>
                <th>{lang === "hi" ? "चेयरमैन का नाम" : "Chairman Name"}</th>
                <th>{lang === "hi" ? "चेयरमैन की पार्टी" : "Chairman Party"}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVoters.map((v) => (
                <tr key={v.id}>
                  <td className="voter-details-cell">
                    <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--navy)" }}>
                      {lang === "hi" ? transliterateNameToHindi(v.voterName) : ensureEnglish(v.voterName)}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>
                      <strong>{t.thFather}:</strong> {lang === "hi" ? transliterateNameToHindi(v.fatherName) : ensureEnglish(v.fatherName)} | <strong>{t.thMobile}:</strong> <span style={{ fontFamily: "monospace" }}>{v.mobileNumber}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
                      <strong>{t.thWard}:</strong> {v.wardNumber} — {getWardAreaName(v.wardNumber, lang)}
                      {v.epicNumber && ` | ${lang === "hi" ? "इपिक" : "EPIC"}: ${v.epicNumber}`}
                      {v.houseNumber && ` | ${lang === "hi" ? "मकान संख्या" : "House No"}: ${v.houseNumber}`}
                    </div>
                    {v.address && (
                      <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
                        <strong>{t.thAddress}:</strong> {lang === "hi" ? transliterateNameToHindi(v.address) : ensureEnglish(v.address)}
                      </div>
                    )}
                  </td>
                  <td className="chairman-name-cell" data-label={lang === "hi" ? "चेयरमैन" : "Chairman"} style={{ fontWeight: 700, fontSize: "14px" }}>
                    {v.selectedChairman ? (lang === "hi" ? transliterateNameToHindi(v.selectedChairman) : ensureEnglish(v.selectedChairman)) : "—"}
                  </td>
                  <td className="chairman-party-cell" data-label={lang === "hi" ? "पार्टी" : "Party"}>
                    <span className={`badge ${getChairmanPartyLogo(v.selectedChairman).toLowerCase()}`} style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                      <PartyLogo option={getChairmanPartyLogo(v.selectedChairman)} size={18} />
                      <span style={{ fontWeight: 700 }}>
                        {getChairmanPartyLogo(v.selectedChairman)}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            {t.showing} {startIndex + 1}–{Math.min(startIndex + itemsPerPage, totalItems)} {t.of} {totalItems} {t.entries}
          </div>
          <div className="pagination-controls">
            <button
              type="button"
              className="btn-secondary"
              disabled={currentPage === 1}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage - 1);
              }}
            >
              {t.btnPrev}
            </button>
            <button
              type="button"
              className="btn-secondary"
              disabled={currentPage === totalPages}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
            >
              {t.btnNext}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
