import { useState, useEffect, useRef, FormEvent } from "react";
import { Globe, UserRound, UsersRound, Phone, MapPin, Check, ArrowRight, ArrowLeft, LoaderCircle } from "lucide-react";
import { wards, formatWard } from "../data/wards";
import { translations } from "../data/translations";
import { getParsadCandidatesForWard, ParsadCandidate } from "../data/parsadCandidates";
import { transliterateNameToHindi } from "../lib/transliterate";
import { API_BASE_URL } from "../config/apiConfig";

export type SurveyOption = "BJP" | "Congress" | "Others";

export type SurveyFormData = {
  wardNumber: string;
  voterName: string;
  fatherName: string;
  relationType: "father" | "husband";
  mobileNumber: string;
  address: string;
  candidateName: string;
};

export type SurveyField = keyof SurveyFormData;
export type SurveyErrors = Partial<Record<SurveyField | "selectedOption" | "selectedChairman" | "form", string>>;

const errorTranslationMap = {
  "Please select your ward and area.": "wardError",
  "Please enter the voter name.": "nameError",
  "Enter a valid name using letters, spaces, dots or hyphens.": "nameValidError",
  "Please enter the relative's name.": "fatherError",
  "Please enter the mobile number.": "mobileError",
  "Enter a valid 10-digit mobile number.": "mobileValidError",
  "Please enter the address.": "addressError",
  "Please enter a valid address (at least 3 characters).": "addressValidError",
  "Please select one option.": "optionError",
  "Please select a chairman.": "chairmanError",
  "Please select a Parsad candidate.": "chairmanError",
  "Entered name and relative's name do not match the voter list for this ward.": "formError",
  "You have already recorded your vote.": "duplicateError",
  "An error occurred during verification. Please try again or check internet connection.": "connectionError",
  "Verification failed on server side. Please try again.": "serverError",
  "A connection error occurred. Please try again.": "submitFailError",
};

function getTranslatedError(rawMsg: string | undefined, lang: "en" | "hi"): string {
  if (!rawMsg) return "";
  const key = errorTranslationMap[rawMsg as keyof typeof errorTranslationMap];
  if (key && translations[lang] && (translations[lang] as any)[key]) {
    return (translations[lang] as any)[key];
  }
  return rawMsg;
}

type Stage = "details" | "parsad" | "chairman" | "success";

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

const initialFormData: SurveyFormData = {
  wardNumber: "",
  voterName: "",
  fatherName: "",
  relationType: "father",
  mobileNumber: "",
  address: "",
  candidateName: "",
};

function FieldError({ id, message, centered = false }: { id: string; message: string; centered?: boolean }) {
  return (
    <span id={id} className={`field-error ${centered ? "is-centered" : ""}`} role="alert">
      {message}
    </span>
  );
}

function CustomWardSelect({
  value,
  onChange,
  hasError,
  placeholder,
  lang,
}: {
  value: string;
  onChange: (val: string) => void;
  hasError: boolean;
  placeholder: string;
  lang: "en" | "hi";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedWard = wards.find((w) => String(w.wardNumber) === String(value));

  return (
    <div className="custom-select-container">
      <button
        type="button"
        id="wardNumber"
        className={`input-shell select-trigger ${hasError ? "has-error" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <MapPin size={19} aria-hidden="true" />
        <span className={`select-label ${!selectedWard ? "is-placeholder" : ""}`}>
          {selectedWard ? formatWard(selectedWard, lang) : placeholder}
        </span>
        <ChevronDown
          className={`select-chevron ${isOpen ? "is-open" : ""}`}
          size={19}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <>
          <div className="custom-select-backdrop" onClick={() => setIsOpen(false)} />
          <ul className="custom-select-menu" role="listbox" tabIndex={-1}>
            {wards.map((ward) => {
              const isSelected = String(ward.wardNumber) === String(value);
              return (
                <li
                  key={ward.wardNumber}
                  className={`custom-select-option ${isSelected ? "is-selected" : ""}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(String(ward.wardNumber));
                    setIsOpen(false);
                  }}
                >
                  <span>{formatWard(ward, lang)}</span>
                  {isSelected && <Check size={16} />}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

function ChevronDown({ className, size, ...props }: { className?: string; size?: number; [key: string]: any }) {
  return (
    <svg className={className} width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}

function validateSurveyDetails(data: SurveyFormData): SurveyErrors {
  const detailErrors: SurveyErrors = {};
  const wardNum = Number(data.wardNumber);

  const cleanName = (text: string, maxLength: number) => {
    if (typeof text !== "string") return "";
    return text
      .normalize("NFKC")
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, maxLength);
  };

  const nameFormatRegex = /^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]*$/u;
  const indianMobileRegex = /^[6-9]\d{9}$/;

  const cleanedVoterName = cleanName(data.voterName, 80);
  const cleanedFatherName = cleanName(data.fatherName, 80);
  const cleanedMobileNumber = cleanName(data.mobileNumber, 15).replace(/\s/g, "");
  const cleanedAddress = cleanName(data.address, 200);

  if (!wards.some((w) => w.wardNumber === wardNum)) {
    detailErrors.wardNumber = "Please select your ward and area.";
  }

  if (!cleanedVoterName) {
    detailErrors.voterName = "Please enter the voter name.";
  } else if (cleanedVoterName.length < 2 || !nameFormatRegex.test(cleanedVoterName)) {
    detailErrors.voterName = "Enter a valid name using letters, spaces, dots or hyphens.";
  }

  if (!cleanedFatherName) {
    detailErrors.fatherName = "Please enter the relative's name.";
  } else if (cleanedFatherName.length < 2 || !nameFormatRegex.test(cleanedFatherName)) {
    detailErrors.fatherName = "Enter a valid name using letters, spaces, dots or hyphens.";
  }

  if (!cleanedMobileNumber) {
    detailErrors.mobileNumber = "Please enter the mobile number.";
  } else if (!indianMobileRegex.test(cleanedMobileNumber)) {
    detailErrors.mobileNumber = "Enter a valid 10-digit mobile number.";
  }

  if (!cleanedAddress) {
    detailErrors.address = "Please enter the address.";
  } else if (cleanedAddress.length < 3) {
    detailErrors.address = "Please enter a valid address (at least 3 characters).";
  }

  return detailErrors;
}

export function SurveyFlow() {
  const [stage, setStage] = useState<Stage>("details");
  const [formData, setFormData] = useState<SurveyFormData>(initialFormData);
  const [selectedOption, setSelectedOption] = useState<SurveyOption | null>(null);
  const [selectedChairman, setSelectedChairman] = useState<string | null>(null);
  const [chairmanParty, setChairmanParty] = useState<"BJP" | "Congress" | null>(null);
  const [errors, setErrors] = useState<SurveyErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [verifiedVoterDetails, setVerifiedVoterDetails] = useState<{
    serialNumber?: number;
    epicNumber?: string;
    houseNumber?: string;
    age?: number;
    gender?: string;
  } | null>(null);
  const isVerifiedRef = useRef(false);
  const [lang, setLang] = useState<"hi" | "en">("hi");

  const t = translations[lang];

  // Sync stage with URL Hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "parsad" || hash === "choice") {
        if (isVerifiedRef.current || verifiedVoterDetails) {
          setStage("parsad");
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          window.location.hash = "details";
        }
      } else if (hash === "chairman") {
        if ((isVerifiedRef.current || verifiedVoterDetails) && selectedChairman) {
          setStage("chairman");
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          window.location.hash = "details";
        }
      } else if (hash === "success") {
        if ((isVerifiedRef.current || verifiedVoterDetails) && selectedChairman && chairmanParty) {
          setStage("success");
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          window.location.hash = "details";
        }
      } else {
        setStage("details");
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (window.location.hash !== "#details" && window.location.hash !== "") {
          window.location.hash = "details";
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    const initialHash = window.location.hash.replace("#", "");
    if ((initialHash === "parsad" || initialHash === "choice") && (isVerifiedRef.current || verifiedVoterDetails)) {
      setStage("parsad");
    } else if (initialHash === "chairman" && (isVerifiedRef.current || verifiedVoterDetails) && selectedChairman) {
      setStage("chairman");
    } else if (initialHash === "success" && (isVerifiedRef.current || verifiedVoterDetails) && selectedChairman && chairmanParty) {
      setStage("success");
    } else {
      setStage("details");
      if (window.location.hash !== "#details") {
        window.location.hash = "details";
      }
    }

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [verifiedVoterDetails, selectedOption, selectedChairman, chairmanParty]);

  function updateField(field: keyof SurveyFormData, value: string) {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
    if (field === "wardNumber") {
      setSelectedChairman(null);
      setSelectedOption(null);
      setChairmanParty(null);
    }
  }

  function focusFirstError(nextErrors: SurveyErrors) {
    const order: Array<keyof SurveyFormData> = [
      "wardNumber",
      "voterName",
      "fatherName",
      "mobileNumber",
      "address",
    ];
    const field = order.find((name) => nextErrors[name]);
    if (field) requestAnimationFrame(() => document.getElementById(field)?.focus());
  }

  async function handleNext(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateSurveyDetails(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
      return;
    }

    // Check localStorage fallback for duplicate voterName + fatherName
    const normStr = (str: string) =>
      (str || "")
        .trim()
        .toLowerCase()
        .replace(/^(shri|smt|ku|dr|mr|mrs|shrimati|श्री|श्रीमती)\s+/i, "")
        .replace(/[\s\.\,\_\-\/]+/g, "")
        .replace(/[^a-z0-9\u0900-\u097F]/gi, "");

    const normV = normStr(formData.voterName);
    const normF = normStr(formData.fatherName);

    const localResponsesStr = localStorage.getItem("community_survey_responses");
    if (localResponsesStr && normV && normF) {
      try {
        const localResponses = JSON.parse(localResponsesStr);
        const isLocalDuplicate = localResponses.some((r: any) => {
          const rV = normStr(r.voterName);
          const rF = normStr(r.fatherName);
          return rV && rF && rV === normV && rF === normF;
        });
        if (isLocalDuplicate) {
          setErrors((current) => ({
            ...current,
            form: "यह मतदाता पहले ही अपना वोट/उत्तर दर्ज कर चुका है।",
          }));
          return;
        }
      } catch (err) {
        console.error("Local responses parse error", err);
      }
    }

    setIsValidating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/voters/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voterName: formData.voterName,
          fatherName: formData.fatherName,
          wardNumber: formData.wardNumber,
          mobileNumber: formData.mobileNumber,
        }),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const result = await response.json();
      if (result.valid) {
        isVerifiedRef.current = true;
        setVerifiedVoterDetails({
          serialNumber: result.voter?.serialNumber,
          epicNumber: result.voter?.epicNumber,
          houseNumber: result.voter?.houseNumber,
          age: result.voter?.age,
          gender: result.voter?.gender,
        });
        setStage("parsad");
        window.location.hash = "parsad";
      } else {
        setErrors((current) => ({
          ...current,
          form: result.message || "यह मतदाता पहले ही अपना वोट/उत्तर दर्ज कर चुका है।",
        }));
      }
    } catch (e) {
      console.error("Verification failed", e);
      setErrors((current) => ({
        ...current,
        form: "सत्यापन (Verification) के दौरान कोई त्रुटि हुई। कृपया पुनः प्रयास करें या Internet connection चेक करें।",
      }));
    } finally {
      setIsValidating(false);
    }
  }

  function handleParsadNext(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedChairman) {
      setErrors({ selectedChairman: "Please select a Parsad candidate." });
      return;
    }
    setErrors({});
    setStage("chairman");
    window.location.hash = "chairman";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!chairmanParty) {
      setErrors({ selectedChairman: (t as any).selectChairmanPartyError || "Please select a Chairman option." });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const chairmanCandidateName = chairmanParty === "BJP" 
        ? (lang === "hi" ? "BJP अध्यक्ष प्रत्याशी" : "BJP Chairman Candidate")
        : (lang === "hi" ? "Congress अध्यक्ष प्रत्याशी" : "Congress Chairman Candidate");

      const newResponse = {
        id: Date.now().toString(),
        wardNumber: formData.wardNumber,
        voterName: lang === "hi" ? transliterateNameToHindi(formData.voterName) : formData.voterName,
        fatherName: lang === "hi" ? transliterateNameToHindi(formData.fatherName) : formData.fatherName,
        relationType: formData.relationType || "father",
        mobileNumber: formData.mobileNumber,
        address: lang === "hi" ? transliterateNameToHindi(formData.address) : formData.address,
        candidateName: selectedChairman,
        selectedOption: selectedOption || "BJP",
        selectedChairman: selectedChairman,
        chairmanParty: chairmanParty,
        chairmanCandidate: chairmanCandidateName,
        timestamp: new Date().toISOString(),
        serialNumber: verifiedVoterDetails?.serialNumber,
        epicNumber: verifiedVoterDetails?.epicNumber,
        houseNumber: verifiedVoterDetails?.houseNumber,
        age: verifiedVoterDetails?.age,
        gender: verifiedVoterDetails?.gender,
      };

      try {
        await fetch(`${API_BASE_URL}/api/responses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newResponse),
        });
      } catch (apiError) {
        console.error("Local API server error, falling back to localStorage", apiError);
      }

      const existing = localStorage.getItem("community_survey_responses");
      const list = existing ? JSON.parse(existing) : [];
      list.push(newResponse);
      localStorage.setItem("community_survey_responses", JSON.stringify(list));

      setStage("success");
      window.location.hash = "success";
    } catch {
      setErrors({ form: "A connection error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetSurvey() {
    isVerifiedRef.current = false;
    setFormData(initialFormData);
    setSelectedOption(null);
    setSelectedChairman(null);
    setChairmanParty(null);
    setVerifiedVoterDetails(null);
    setErrors({});
    setStage("details");
    window.location.hash = "details";
  }

  const stepNumber = stage === "details" ? 1 : stage === "parsad" ? 2 : 3;
  const totalSteps = 3;

  return (
    <section className="survey-card single-panel" aria-label="Community voter counting survey">
      <div className="election-header-banner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", padding: "14px 20px" }}>
        <h1 className="election-header-title" style={{ margin: 0 }}>
          {lang === "hi" ? "बहादुरपुर पार्षद चुनाव सर्वे" : "Bahadurpur Parsad Election Survey"}
        </h1>
        <button
          type="button"
          className="lang-toggle-btn"
          onClick={() => setLang((prev) => (prev === "hi" ? "en" : "hi"))}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            fontSize: "13px",
            fontWeight: 700,
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.4)",
            background: "rgba(255, 255, 255, 0.95)",
            color: "#0f172a",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            transition: "all 0.2s ease"
          }}
          title={lang === "hi" ? "Switch to English" : "हिंदी में बदलें"}
        >
          <Globe size={16} color="#dc2626" />
          <span>{lang === "hi" ? "English" : "हिंदी"}</span>
        </button>
      </div>

      <div className="form-panel">
        {stage !== "success" && (
          <div className="progress-wrap" aria-label={`Step ${stepNumber} of ${totalSteps}`}>
            <div className="progress-meta">
              <span>{t.surveyProgress}</span>
              <strong>{stepNumber} {t.of} {totalSteps}</strong>
            </div>
            <div className="progress-track" aria-hidden="true">
              <span style={{ width: stage === "details" ? "33.33%" : stage === "parsad" ? "66.66%" : "100%" }} />
            </div>
          </div>
        )}

        <div className="panel-content">
          {stage === "details" && (
            <form className="stage stage-details" onSubmit={handleNext} noValidate>
              <div className="stage-heading">
                <span className="step-chip">{t.step} 01</span>
                <h2>{t.voterDetails}</h2>
                <p>{t.voterDetailsDesc}</p>
              </div>

              <div className="field-group">
                <label htmlFor="wardNumber">{t.wardLabel}</label>
                <CustomWardSelect
                  value={formData.wardNumber}
                  onChange={(val) => updateField("wardNumber", val)}
                  hasError={Boolean(errors.wardNumber)}
                  placeholder={t.wardPlaceholder}
                  lang={lang}
                />
                {errors.wardNumber && <FieldError id="wardNumber-error" message={getTranslatedError(errors.wardNumber, lang)} />}
              </div>

              <div className="field-grid">
                <div className="field-group">
                  <label htmlFor="voterName">{t.voterName}</label>
                  <div className={`input-shell ${errors.voterName ? "has-error" : ""}`}>
                    <UserRound size={19} aria-hidden="true" />
                    <input
                      id="voterName"
                      name="voterName"
                      type="text"
                      placeholder={t.voterNamePlaceholder}
                      value={formData.voterName}
                      onChange={(event) => updateField("voterName", event.target.value)}
                      maxLength={80}
                      autoComplete="off"
                      aria-invalid={Boolean(errors.voterName)}
                      aria-describedby={errors.voterName ? "voterName-error" : undefined}
                    />
                  </div>
                  {errors.voterName && <FieldError id="voterName-error" message={getTranslatedError(errors.voterName, lang)} />}
                </div>

                <div className="field-group">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "7px", flexWrap: "wrap", gap: "4px" }}>
                    <label htmlFor="fatherName" style={{ margin: 0 }}>
                      {formData.relationType === "father" ? (lang === "hi" ? "पिता का नाम" : "Father Name") : (lang === "hi" ? "पति का नाम" : "Husband Name")}
                    </label>
                    <div style={{ display: "inline-flex", background: "#e2e8f0", borderRadius: "20px", padding: "2px" }}>
                      <button
                        type="button"
                        onClick={() => updateField("relationType", "father")}
                        style={{
                          padding: "3px 10px",
                          fontSize: "10.5px",
                          fontWeight: 700,
                          borderRadius: "18px",
                          border: 0,
                          cursor: "pointer",
                          background: formData.relationType === "father" ? "#dc2626" : "transparent",
                          color: formData.relationType === "father" ? "#ffffff" : "#475569",
                          transition: "all 0.15s ease"
                        }}
                      >
                        {lang === "hi" ? "पिता (Father)" : "Father"}
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField("relationType", "husband")}
                        style={{
                          padding: "3px 10px",
                          fontSize: "10.5px",
                          fontWeight: 700,
                          borderRadius: "18px",
                          border: 0,
                          cursor: "pointer",
                          background: formData.relationType === "husband" ? "#dc2626" : "transparent",
                          color: formData.relationType === "husband" ? "#ffffff" : "#475569",
                          transition: "all 0.15s ease"
                        }}
                      >
                        {lang === "hi" ? "पति (Husband)" : "Husband"}
                      </button>
                    </div>
                  </div>
                  <div className={`input-shell ${errors.fatherName ? "has-error" : ""}`}>
                    <UsersRound size={19} aria-hidden="true" />
                    <input
                      id="fatherName"
                      name="fatherName"
                      type="text"
                      placeholder={formData.relationType === "father" ? (lang === "hi" ? "पिता का नाम दर्ज करें" : "Enter father's name") : (lang === "hi" ? "पति का नाम दर्ज करें" : "Enter husband's name")}
                      value={formData.fatherName}
                      onChange={(event) => updateField("fatherName", event.target.value)}
                      maxLength={80}
                      autoComplete="off"
                      aria-invalid={Boolean(errors.fatherName)}
                      aria-describedby={errors.fatherName ? "fatherName-error" : undefined}
                    />
                  </div>
                  {errors.fatherName && <FieldError id="fatherName-error" message={getTranslatedError(errors.fatherName, lang)} />}
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="mobileNumber">{t.mobileNumber}</label>
                <div className={`input-shell ${errors.mobileNumber ? "has-error" : ""}`}>
                  <Phone size={19} aria-hidden="true" />
                  <input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="tel"
                    placeholder={t.mobileNumberPlaceholder}
                    value={formData.mobileNumber}
                    onChange={(event) => updateField("mobileNumber", event.target.value.replace(/\D/g, "").slice(0, 10))}
                    maxLength={10}
                    autoComplete="off"
                    aria-invalid={Boolean(errors.mobileNumber)}
                    aria-describedby={errors.mobileNumber ? "mobileNumber-error" : undefined}
                  />
                </div>
                {errors.mobileNumber && <FieldError id="mobileNumber-error" message={getTranslatedError(errors.mobileNumber, lang)} />}
              </div>

              <div className="field-group">
                <label htmlFor="address">{t.address}</label>
                <div className={`input-shell ${errors.address ? "has-error" : ""}`}>
                  <MapPin size={19} aria-hidden="true" />
                  <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder={t.addressPlaceholder}
                    value={formData.address}
                    onChange={(event) => updateField("address", event.target.value)}
                    maxLength={200}
                    autoComplete="off"
                    aria-invalid={Boolean(errors.address)}
                    aria-describedby={errors.address ? "address-error" : undefined}
                  />
                </div>
                {errors.address && <FieldError id="address-error" message={getTranslatedError(errors.address, lang)} />}
              </div>

              {errors.form && <div className="form-error" role="alert">{getTranslatedError(errors.form, lang)}</div>}

              <button className="primary-button" type="submit" disabled={isValidating}>
                {isValidating ? (
                  <>
                    <LoaderCircle className="spinner" size={19} aria-hidden="true" />
                    <span>{t.validatingBtn}</span>
                  </>
                ) : (
                  <>
                    <span>{t.nextBtn}</span>
                    <ArrowRight size={19} strokeWidth={2.2} aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          )}

          {stage === "parsad" && (() => {
            const wardCandidates = getParsadCandidatesForWard(formData.wardNumber);

            return (
              <form className="stage stage-choice" onSubmit={handleParsadNext} noValidate>
                <button
                  className="back-button"
                  type="button"
                  onClick={() => {
                    setErrors({});
                    setStage("details");
                    window.location.hash = "details";
                  }}
                >
                  <ArrowLeft size={17} aria-hidden="true" />
                  {t.backBtn}
                </button>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                  {formData.wardNumber && (
                    <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#1e3a8a", background: "#dbeafe", padding: "8px 14px", borderRadius: "8px", border: "1px solid #bfdbfe", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <span>📍</span>
                      <span>
                        {lang === "hi" 
                          ? `चयनित वार्ड: वार्ड ${String(formData.wardNumber).padStart(2, "0")}` 
                          : `Selected Ward: Ward ${String(formData.wardNumber).padStart(2, "0")}`}
                      </span>
                    </div>
                  )}

                  {formData.voterName && (
                    <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--navy)", background: "#f1f5f9", padding: "8px 14px", borderRadius: "8px", border: "1px solid var(--border)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <span>👤</span>
                      <span>
                        {lang === "hi" 
                          ? `मतदाता: ${transliterateNameToHindi(formData.voterName)}` 
                          : `Voter: ${formData.voterName}`}
                      </span>
                    </div>
                  )}
                </div>

                <div className="stage-heading choice-heading">
                  <span className="step-chip">{t.step} 02</span>
                  <h2>{t.selectChairman}</h2>
                  <p>
                    {lang === "hi"
                      ? `वार्ड ${String(formData.wardNumber).padStart(2, "0")} के लिए कृपया अपना पार्षद प्रत्याशी चुनें`
                      : `Please select Parsad Candidate for Ward ${String(formData.wardNumber).padStart(2, "0")}`}
                  </p>
                </div>

                <div
                  className="option-list"
                  role="radiogroup"
                  aria-label="Parsad candidate options"
                  aria-describedby={errors.selectedChairman ? "selectedChairman-error" : undefined}
                >
                  {wardCandidates.map((parsad, index) => {
                    const displayName = lang === "hi" ? parsad.nameHi : parsad.nameEn;
                    const isSelected = selectedChairman === parsad.nameEn || selectedChairman === parsad.nameHi;
                    const desc = lang === "hi" ? (parsad.partyNameHi || parsad.party) : (parsad.partyNameEn || parsad.party);

                    return (
                      <button
                        key={parsad.id || index}
                        type="button"
                        className={`option-card ${isSelected ? "is-selected" : ""}`}
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => {
                          setSelectedOption(parsad.party as SurveyOption);
                          setSelectedChairman(parsad.nameEn);
                          updateField("candidateName", parsad.nameEn);
                          setErrors((current) => ({ ...current, selectedChairman: undefined, selectedOption: undefined, form: undefined }));
                        }}
                      >
                        <span className="option-index">0{index + 1}</span>
                        <span className="option-copy">
                          <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <PartyLogo option={parsad.party} size={32} />
                            <strong>{displayName}</strong>
                          </span>
                          <small>{desc}</small>
                          {parsad.symbol && (
                            <small style={{ color: "#2563eb", fontWeight: 600, marginTop: "2px", display: "block" }}>
                              {lang === "hi" ? `चुनाव चिह्न: ${parsad.symbol}` : `Symbol: ${parsad.symbol}`}
                            </small>
                          )}
                        </span>
                        <span className="radio-indicator" aria-hidden="true">
                          {isSelected && <Check size={16} strokeWidth={3} />}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {errors.selectedChairman && (
                  <FieldError id="selectedChairman-error" message={getTranslatedError(errors.selectedChairman, lang)} centered />
                )}
                {errors.form && <div className="form-error" role="alert">{getTranslatedError(errors.form, lang)}</div>}

                <button className="primary-button" type="submit" disabled={!selectedChairman}>
                  <span>{t.nextBtn}</span>
                  <ArrowRight size={19} strokeWidth={2.2} aria-hidden="true" />
                </button>
              </form>
            );
          })()}

          {stage === "chairman" && (
            <form className="stage stage-choice" onSubmit={handleSubmit} noValidate>
              <button
                className="back-button"
                type="button"
                onClick={() => {
                  setErrors({});
                  setStage("parsad");
                  window.location.hash = "parsad";
                }}
              >
                <ArrowLeft size={17} aria-hidden="true" />
                {(t as any).backToParsadBtn || t.backBtn}
              </button>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                {formData.wardNumber && (
                  <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#1e3a8a", background: "#dbeafe", padding: "8px 14px", borderRadius: "8px", border: "1px solid #bfdbfe", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <span>📍</span>
                    <span>
                      {lang === "hi" 
                        ? `वार्ड: ${String(formData.wardNumber).padStart(2, "0")}` 
                        : `Ward: ${String(formData.wardNumber).padStart(2, "0")}`}
                    </span>
                  </div>
                )}

                {selectedChairman && (
                  <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#065f46", background: "#d1fae5", padding: "8px 14px", borderRadius: "8px", border: "1px solid #a7f3d0", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <span>🤝</span>
                    <span>
                      {lang === "hi" 
                        ? `पार्षद प्रत्याशी: ${transliterateNameToHindi(selectedChairman)}` 
                        : `Parsad: ${selectedChairman}`}
                    </span>
                  </div>
                )}
              </div>

              <div className="stage-heading choice-heading">
                <span className="step-chip">{t.step} 03</span>
                <h2>{(t as any).selectChairmanTitle || "अध्यक्ष/चेयरमैन पद प्रत्याशी का चयन करें"}</h2>
                <p>{(t as any).selectChairmanSub || "नगर पालिका अध्यक्ष पद हेतु अपनी पसंद का चुनाव करें"}</p>
              </div>

              <div
                className="option-list"
                role="radiogroup"
                aria-label="Chairman options"
              >
                <button
                  type="button"
                  className={`option-card ${chairmanParty === "BJP" ? "is-selected" : ""}`}
                  role="radio"
                  aria-checked={chairmanParty === "BJP"}
                  onClick={() => {
                    setChairmanParty("BJP");
                    setErrors((current) => ({ ...current, selectedChairman: undefined, form: undefined }));
                  }}
                  style={{ borderLeft: chairmanParty === "BJP" ? "6px solid #f97316" : undefined }}
                >
                  <span className="option-index">01</span>
                  <span className="option-copy">
                    <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <PartyLogo option="BJP" size={36} />
                      <strong style={{ fontSize: "17px", color: "#1e293b" }}>
                        {(t as any).bjpChairmanTitle || "भारतीय जनता पार्टी (BJP)"}
                      </strong>
                    </span>
                    <small style={{ fontSize: "13px", marginTop: "4px", color: "#475569" }}>
                      {(t as any).bjpChairmanDesc || "अध्यक्ष पद प्रत्याशी - भाजपा (BJP)"}
                    </small>
                  </span>
                  <span className="radio-indicator" aria-hidden="true">
                    {chairmanParty === "BJP" && <Check size={16} strokeWidth={3} />}
                  </span>
                </button>

                <button
                  type="button"
                  className={`option-card ${chairmanParty === "Congress" ? "is-selected" : ""}`}
                  role="radio"
                  aria-checked={chairmanParty === "Congress"}
                  onClick={() => {
                    setChairmanParty("Congress");
                    setErrors((current) => ({ ...current, selectedChairman: undefined, form: undefined }));
                  }}
                  style={{ borderLeft: chairmanParty === "Congress" ? "6px solid #16a34a" : undefined }}
                >
                  <span className="option-index">02</span>
                  <span className="option-copy">
                    <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <PartyLogo option="Congress" size={36} />
                      <strong style={{ fontSize: "17px", color: "#1e293b" }}>
                        {(t as any).congressChairmanTitle || "भारतीय राष्ट्रीय कांग्रेस (Congress)"}
                      </strong>
                    </span>
                    <small style={{ fontSize: "13px", marginTop: "4px", color: "#475569" }}>
                      {(t as any).congressChairmanDesc || "अध्यक्ष पद प्रत्याशी - कांग्रेस (INC)"}
                    </small>
                  </span>
                  <span className="radio-indicator" aria-hidden="true">
                    {chairmanParty === "Congress" && <Check size={16} strokeWidth={3} />}
                  </span>
                </button>
              </div>

              {errors.selectedChairman && (
                <FieldError id="selectedChairman-error" message={getTranslatedError(errors.selectedChairman, lang)} centered />
              )}
              {errors.form && <div className="form-error" role="alert">{getTranslatedError(errors.form, lang)}</div>}

              <button className="primary-button" type="submit" disabled={!chairmanParty || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="spinner" size={19} aria-hidden="true" />
                    <span>{t.submittingBtn}</span>
                  </>
                ) : (
                  <>
                    <span>{t.submitBtn}</span>
                    <Check size={19} strokeWidth={2.5} aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          )}

          {stage === "success" && (
            <div className="stage stage-success">
              <div className="success-badge" aria-hidden="true">
                <Check size={36} strokeWidth={2.8} />
              </div>
              <h2>{t.successMsg}</h2>
              <p>{t.recordedMsg}</p>

              <div className="summary-box">
                <div className="summary-item" style={{ marginBottom: "8px", borderBottom: "1px dashed #cbd5e1", paddingBottom: "8px" }}>
                  <span className="summary-label">{lang === "hi" ? "चयनित वार्ड" : "Selected Ward"}</span>
                  <span className="summary-value" style={{ fontWeight: 700, color: "#1e3a8a" }}>
                    {lang === "hi" ? `वार्ड ${String(formData.wardNumber).padStart(2, "0")}` : `Ward ${String(formData.wardNumber).padStart(2, "0")}`}
                  </span>
                </div>

                <div className="summary-item" style={{ marginBottom: "8px", borderBottom: "1px dashed #cbd5e1", paddingBottom: "8px" }}>
                  <span className="summary-label">{t.selectedChairmanChoice}</span>
                  <span className="summary-value" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                    {selectedOption && <PartyLogo option={selectedOption} size={22} />}
                    {selectedChairman ? (lang === "hi" ? transliterateNameToHindi(selectedChairman) : selectedChairman) : "-"}
                  </span>
                </div>

                <div className="summary-item">
                  <span className="summary-label">{(t as any).selectedChairmanPartyLabel || "चुना गया अध्यक्ष (चेयरमैन)"}</span>
                  <span className="summary-value" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
                    {chairmanParty && <PartyLogo option={chairmanParty} size={22} />}
                    <span>{chairmanParty === "BJP" ? (lang === "hi" ? "भाजपा (BJP)" : "BJP") : chairmanParty === "Congress" ? (lang === "hi" ? "कांग्रेस (Congress)" : "Congress") : "-"}</span>
                  </span>
                </div>
              </div>

              <p className="privacy-note">{t.privacyText}</p>

              <button className="secondary-button" type="button" onClick={resetSurvey}>
                {t.anotherResponseBtn}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
