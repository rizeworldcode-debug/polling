import { useState, useEffect } from "react";
import type { VoterResponse } from "./dashboard";
import { Trash2, Search } from "lucide-react";
import { getWardAreaName } from "../data/wards";
import { translations } from "../data/translations";
import { transliterateNameToHindi, ensureEnglish } from "../lib/transliterate";

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

type SubmissionsListProps = {
  voters: VoterResponse[];
  onDelete: (id: string) => void;
  initialChoiceFilter: string;
  onClearFilter: () => void;
  lang: "en" | "hi";
  initialSearch?: string;
};

export function SubmissionsList({ 
  voters, 
  onDelete, 
  initialChoiceFilter, 
  onClearFilter,
  lang,
  initialSearch
}: SubmissionsListProps) {
  const [search, setSearch] = useState(initialSearch || "");
  const [wardFilter, setWardFilter] = useState("");
  const [choiceFilter, setChoiceFilter] = useState(initialChoiceFilter);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setSearch(initialSearch || "");
  }, [initialSearch]);
  const itemsPerPage = 10;

  useEffect(() => {
    setChoiceFilter(initialChoiceFilter);
  }, [initialChoiceFilter]);

  // Filter and search voters
  const filteredVoters = voters.filter((v) => {
    const matchesSearch =
      v.voterName.toLowerCase().includes(search.toLowerCase()) ||
      v.fatherName.toLowerCase().includes(search.toLowerCase()) ||
      v.mobileNumber.includes(search) ||
      (v.epicNumber && v.epicNumber.toLowerCase().includes(search.toLowerCase())) ||
      (v.address && v.address.toLowerCase().includes(search.toLowerCase())) ||
      (v.candidateName && v.candidateName.toLowerCase().includes(search.toLowerCase())) ||
      (v.selectedChairman && v.selectedChairman.toLowerCase().includes(search.toLowerCase()));
    const matchesWard = wardFilter === "" || v.wardNumber === wardFilter;
    const matchesChoice = choiceFilter === "" || v.selectedOption === choiceFilter;

    return matchesSearch && matchesWard && matchesChoice;
  });

  // Extract unique wards for filters
  const uniqueWards = Array.from(new Set(voters.map((v) => v.wardNumber))).sort(
    (a, b) => Number(a) - Number(b)
  );

  // Pagination calculation
  const totalItems = filteredVoters.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVoters = filteredVoters
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const t = translations[lang];

  return (
    <div className="card">
      <div className="card-header">
        <h3>{t.voterResponsesLog}</h3>
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
          value={choiceFilter}
          onChange={(e) => {
            const val = e.target.value;
            setChoiceFilter(val);
            if (val === "") {
              onClearFilter();
            }
            setCurrentPage(1);
          }}
        >
          <option value="">{t.allPreferences}</option>
          <option value="BJP">BJP</option>
          <option value="Congress">Congress</option>
          <option value="Others">Others</option>
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
                <th>{t.thWard}</th>
                <th>{t.thVoter}</th>
                <th>{t.thFather}</th>
                <th>{t.thMobile}</th>
                <th>{t.thAddress}</th>
                <th>{t.thCandidate}</th>
                <th>{t.thChoice}</th>
                <th>{t.thTime}</th>
                <th style={{ textAlign: "right" }}>{t.thActions}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVoters.map((v) => (
                <tr key={v.id}>
                  <td data-label={lang === "hi" ? "वार्ड" : "Ward"} style={{ fontWeight: 700 }}>
                    {lang === "hi" ? "वार्ड" : "Ward"} {v.wardNumber} — {getWardAreaName(v.wardNumber, lang)}
                  </td>
                  <td className="voter-details-cell">
                    <div style={{ fontWeight: 600 }}>
                      {lang === "hi" ? transliterateNameToHindi(v.voterName) : ensureEnglish(v.voterName)}
                    </div>
                    {v.epicNumber && (
                      <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>
                        {lang === "hi" ? "इपिक" : "EPIC"}: <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{v.epicNumber}</span>
                        {v.serialNumber && ` | ${lang === "hi" ? "क्रम संख्या" : "Sl.No"}: ${v.serialNumber}`}
                      </div>
                    )}
                    {(v.age || v.gender) && (
                      <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>
                        {v.age ? `${lang === "hi" ? "उम्र" : "Age"}: ${v.age}` : ""}{v.gender ? ` | ${lang === "hi" ? (v.gender === "Male" ? "पुरुष" : "महिला") : v.gender}` : ""}
                      </div>
                    )}
                  </td>
                  <td data-label={lang === "hi" ? "संबंधी का नाम" : "Relative Name"}>
                    <div>
                      {lang === "hi" ? transliterateNameToHindi(v.fatherName) : ensureEnglish(v.fatherName)}
                    </div>
                  </td>
                  <td data-label={lang === "hi" ? "मोबाइल" : "Mobile"} style={{ fontFamily: "monospace" }}>{v.mobileNumber}</td>
                  <td data-label={lang === "hi" ? "पता" : "Address"}>
                    <div>{lang === "hi" && v.address ? transliterateNameToHindi(v.address) : ensureEnglish(v.address) || "—"}</div>
                    {v.houseNumber && (
                      <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "2px" }}>
                        {lang === "hi" ? "मकान संख्या" : "House No"}: {v.houseNumber}
                      </div>
                    )}
                  </td>
                  <td data-label={lang === "hi" ? "प्रत्याशी" : "Candidate"}>{v.candidateName ? (lang === "hi" ? transliterateNameToHindi(v.candidateName) : ensureEnglish(v.candidateName)) : "—"}</td>
                  <td data-label={lang === "hi" ? "पसंद" : "Choice"}>
                    <span className={`badge ${v.selectedOption.toLowerCase()}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <PartyLogo option={v.selectedOption} size={22} />
                      {v.selectedOption}
                    </span>
                  </td>
                  <td data-label={lang === "hi" ? "समय" : "Time"} style={{ fontSize: "12px", color: "var(--muted)" }}>
                    {new Date(v.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td data-label={lang === "hi" ? "कार्रवाई" : "Actions"} style={{ textAlign: "right" }}>
                    <button
                      className="btn-secondary btn-danger"
                      style={{ 
                        padding: "6px 12px", 
                        height: "auto", 
                        display: "inline-flex", 
                        alignItems: "center", 
                        gap: "6px",
                        fontSize: "12px",
                        fontWeight: 600
                      }}
                      onClick={() => onDelete(v.id)}
                      title={t.btnDelete}
                    >
                      <Trash2 size={14} />
                      {t.btnDelete}
                    </button>
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
