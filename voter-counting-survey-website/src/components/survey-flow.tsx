"use client";

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  CircleCheck,
  ClipboardCheck,
  LockKeyhole,
  LoaderCircle,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import { FormEvent, useState, useEffect, useRef } from "react";
import { formatWard, wards } from "@/data/wards";
import {
  normalizeSurveyInput,
  SurveyErrors,
  SurveyFormData,
  SurveyOption,
  surveyOptions,
  validateSurveyDetails,
} from "@/lib/survey";
import { translations } from "@/data/translations";
import { transliterateNameToHindi } from "@/lib/transliterate";
import { bjpCandidates, getBjpCandidateForWard } from "@/data/bjpCandidates";
import { congressCandidates, getCongressCandidateForWard } from "@/data/congressCandidates";
import { API_BASE_URL } from "@/config/apiConfig";

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
  "दर्ज किया गया नाम और पिता का नाम इस वार्ड की मतदाता सूची से मेल नहीं खाता है।": "formError",
  "आप पहले ही अपना उत्तर दर्ज कर चुके हैं।": "duplicateError",
  "सत्यापन (Verification) के दौरान कोई त्रुटि हुई। कृपया पुनः प्रयास करें या Internet connection चेक करें।": "connectionError",
  "A connection error occurred. Please try again.": "submitFailError",
};

function getTranslatedError(err: string | undefined, lang: "hi" | "en") {
  if (!err) return "";
  const key = errorTranslationMap[err as keyof typeof errorTranslationMap];
  if (key) {
    return translations[lang][key as keyof typeof translations["hi"]];
  }
  return err;
}

type Stage = "details" | "choice" | "chairman" | "success";

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

type ChairmanOption = {
  name: string;
  party: string;
  descHi: string;
  descEn: string;
};

const chairmanOptions: ChairmanOption[] = [
  { name: "Vikas", party: "BJP", descHi: "विकास - BJP पार्टी", descEn: "Vikas - BJP Party" },
  { name: "Devender", party: "Congress", descHi: "देवेन्द्र - Congress पार्टी", descEn: "Devender - Congress Party" },
];

type ApiResponse = {
  ok?: boolean;
  message?: string;
  errors?: SurveyErrors;
};

const initialFormData: SurveyFormData = {
  wardNumber: "",
  voterName: "",
  fatherName: "",
  mobileNumber: "",
  address: "",
  candidateName: "",
};

const optionDescriptions: Record<SurveyOption, string> = {
  BJP: "Select this option for BJP",
  Congress: "Select this option for Congress",
  Others: "Select for any other preference",
};

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

export function SurveyFlow() {
  const [stage, setStage] = useState<Stage>("details");
  const [formData, setFormData] = useState<SurveyFormData>(initialFormData);
  const [selectedOption, setSelectedOption] = useState<SurveyOption | null>(null);
  const [selectedChairman, setSelectedChairman] = useState<string | null>(null);
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
  const [lang] = useState<"hi" | "en">("en");

  const t = translations[lang];

  // Sync stage with URL Hash for browser back/next navigation support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "choice") {
        if (isVerifiedRef.current || verifiedVoterDetails) {
          setStage("choice");
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          window.location.hash = "details";
        }
      } else if (hash === "chairman") {
        if ((isVerifiedRef.current || verifiedVoterDetails) && selectedOption) {
          setStage("chairman");
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (isVerifiedRef.current || verifiedVoterDetails) {
          window.location.hash = "choice";
        } else {
          window.location.hash = "details";
        }
      } else if (hash === "success") {
        if ((isVerifiedRef.current || verifiedVoterDetails) && selectedOption && selectedChairman) {
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

    // Initial check on mount
    const initialHash = window.location.hash.replace("#", "");
    if (initialHash === "choice" && (isVerifiedRef.current || verifiedVoterDetails)) {
      setStage("choice");
    } else if (initialHash === "chairman" && (isVerifiedRef.current || verifiedVoterDetails) && selectedOption) {
      setStage("chairman");
    } else if (initialHash === "success" && (isVerifiedRef.current || verifiedVoterDetails) && selectedOption && selectedChairman) {
      setStage("success");
    } else {
      setStage("details");
      if (window.location.hash !== "#details") {
        window.location.hash = "details";
      }
    }

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [verifiedVoterDetails, selectedOption, selectedChairman]);

  function updateField(field: keyof SurveyFormData, value: string) {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
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
        setStage("choice");
        window.location.hash = "choice";
      } else {
        setErrors((current) => ({
          ...current,
          form: result.message || "दर्ज किया गया नाम और पिता का नाम इस वार्ड की मतदाता सूची से मेल नहीं खाता है।",
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

  function handleChoiceNext(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedOption) {
      setErrors({ selectedOption: "Please select one option." });
      return;
    }
    setErrors({});
    setStage("chairman");
    window.location.hash = "chairman";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedChairman) {
      setErrors({ selectedChairman: "Please select a chairman." });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newResponse = {
        id: Date.now().toString(),
        wardNumber: formData.wardNumber,
        voterName: lang === "hi" ? transliterateNameToHindi(formData.voterName) : formData.voterName,
        fatherName: lang === "hi" ? transliterateNameToHindi(formData.fatherName) : formData.fatherName,
        mobileNumber: formData.mobileNumber,
        address: lang === "hi" ? transliterateNameToHindi(formData.address) : formData.address,
        candidateName: lang === "hi" ? transliterateNameToHindi(formData.candidateName) : formData.candidateName,
        selectedOption: selectedOption,
        selectedChairman: selectedChairman,
        timestamp: new Date().toISOString(),
        serialNumber: verifiedVoterDetails?.serialNumber,
        epicNumber: verifiedVoterDetails?.epicNumber,
        houseNumber: verifiedVoterDetails?.houseNumber,
        age: verifiedVoterDetails?.age,
        gender: verifiedVoterDetails?.gender,
      };
      
      // Save to local shared API server
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

      // Also save to localStorage as fallback
      const existing = localStorage.getItem("community_survey_responses");
      const list = existing ? JSON.parse(existing) : [];
      list.push(newResponse);
      localStorage.setItem("community_survey_responses", JSON.stringify(list));

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
    setVerifiedVoterDetails(null);
    setErrors({});
    setStage("details");
    window.location.hash = "details";
  }

  const stepNumber = stage === "details" ? 1 : stage === "choice" ? 2 : 3;
  const totalSteps = 3;

  return (
    <section className="survey-card single-panel" aria-label="Community voter counting survey">
      <div className="election-header-banner">
        <h1 className="election-header-title">Bahadurpur parsad election</h1>
      </div>

      <div className="form-panel">
        {stage !== "success" && (
          <div className="progress-wrap" aria-label={`Step ${stepNumber} of ${totalSteps}`}>
            <div className="progress-meta">
              <span>{t.surveyProgress}</span>
              <strong>{stepNumber} {t.of} {totalSteps}</strong>
            </div>
            <div className="progress-track" aria-hidden="true">
              <span style={{ width: stage === "details" ? "33%" : stage === "choice" ? "66%" : "100%" }} />
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
                  <label htmlFor="fatherName">{t.fatherName}</label>
                  <div className={`input-shell ${errors.fatherName ? "has-error" : ""}`}>
                    <UsersRound size={19} aria-hidden="true" />
                    <input
                      id="fatherName"
                      name="fatherName"
                      type="text"
                      placeholder={t.fatherNamePlaceholder}
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

          {stage === "choice" && (
            <form className="stage stage-choice" onSubmit={handleChoiceNext} noValidate>
              <button
                className="back-button"
                type="button"
                onClick={() => {
                  setErrors({});
                  window.location.hash = "details";
                }}
              >
                <ArrowLeft size={17} aria-hidden="true" />
                {t.backBtn}
              </button>

              {formData.voterName && (
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--navy)", marginBottom: "16px", background: "#f1f5f9", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span>👤</span>
                  <span>
                    {lang === "hi" 
                      ? `मतदाता: ${transliterateNameToHindi(formData.voterName)}` 
                      : `Voter: ${formData.voterName}`}
                  </span>
                </div>
              )}

              <div className="stage-heading choice-heading">
                <span className="step-chip">{t.step} 02</span>
                <h2>{t.selectOption}</h2>
                <p>{t.selectOptionDesc}</p>
              </div>

              <div
                className="option-list"
                role="radiogroup"
                aria-label="Survey options"
                aria-describedby={errors.selectedOption ? "selectedOption-error" : undefined}
              >
                {surveyOptions.map((option, index) => {
                  const isSelected = selectedOption === option;
                  const desc = option === "BJP" ? t.bjpDesc : option === "Congress" ? t.congressDesc : t.othersDesc;
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`option-card ${isSelected ? "is-selected" : ""}`}
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => {
                        setSelectedOption(option);
                        setErrors((current) => ({ ...current, selectedOption: undefined, form: undefined }));
                      }}
                    >
                      <span className="option-index">0{index + 1}</span>
                      <span className="option-copy">
                        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <PartyLogo option={option} size={32} />
                          <strong>{option}</strong>
                        </span>
                        <small>{desc}</small>
                      </span>
                      <span className="radio-indicator" aria-hidden="true">
                        {isSelected && <Check size={16} strokeWidth={3} />}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="field-group" style={{ marginTop: "24px" }}>
                <label htmlFor="candidateName">{t.candidateLabel}</label>
                <div className={`input-shell ${errors.candidateName ? "has-error" : ""}`}>
                  <UserRound size={19} aria-hidden="true" />
                  <input
                    id="candidateName"
                    name="candidateName"
                    type="text"
                    placeholder={t.candidatePlaceholder}
                    value={formData.candidateName}
                    onChange={(event) => updateField("candidateName", event.target.value)}
                    maxLength={80}
                    autoComplete="off"
                    aria-invalid={Boolean(errors.candidateName)}
                    aria-describedby={errors.candidateName ? "candidateName-error" : undefined}
                  />
                </div>
                {errors.candidateName && <FieldError id="candidateName-error" message={getTranslatedError(errors.candidateName, lang)} />}
              </div>

              {errors.selectedOption && (
                <FieldError id="selectedOption-error" message={getTranslatedError(errors.selectedOption, lang)} centered />
              )}
              {errors.form && <div className="form-error" role="alert">{getTranslatedError(errors.form, lang)}</div>}

              <button className="primary-button" type="submit" disabled={!selectedOption}>
                <span>{t.nextBtn}</span>
                <ArrowRight size={19} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </form>
          )}

          {stage === "chairman" && (() => {
            const wardBjpCandidate = getBjpCandidateForWard(formData.wardNumber);
            const wardCongressCandidate = getCongressCandidateForWard(formData.wardNumber);

            const bjpCandidateName = wardBjpCandidate?.nameEn || "Vikas";
            const bjpCandidateNameHi = wardBjpCandidate?.nameHi || "विकास";

            const congressCandidateName = wardCongressCandidate?.nameEn || "Devender";
            const congressCandidateNameHi = wardCongressCandidate?.nameHi || "देवेन्द्र";

            const wardNumFormatted = String(formData.wardNumber).padStart(2, "0");

            const activeChairmanOptions: ChairmanOption[] = [
              {
                name: bjpCandidateName,
                party: "BJP",
                descHi: wardBjpCandidate
                  ? `${bjpCandidateNameHi} - BJP प्रत्याशी (वार्ड ${wardNumFormatted} - ${wardBjpCandidate.categoryHi})`
                  : `विकास - BJP पार्टी`,
                descEn: wardBjpCandidate
                  ? `${bjpCandidateName} - BJP Candidate (Ward ${wardNumFormatted} - ${wardBjpCandidate.categoryEn})`
                  : `Vikas - BJP Party`,
              },
              {
                name: congressCandidateName,
                party: "Congress",
                descHi: wardCongressCandidate
                  ? `${congressCandidateNameHi} - Congress प्रत्याशी (वार्ड ${wardNumFormatted} - ${wardCongressCandidate.categoryHi})`
                  : `देवेन्द्र - Congress पार्टी`,
                descEn: wardCongressCandidate
                  ? `${congressCandidateName} - Congress Candidate (Ward ${wardNumFormatted} - ${wardCongressCandidate.categoryEn})`
                  : `Devender - Congress Party`,
              },
            ];

            return (
              <form className="stage stage-choice" onSubmit={handleSubmit} noValidate>
                <button
                  className="back-button"
                  type="button"
                  onClick={() => {
                    setErrors({});
                    window.location.hash = "choice";
                  }}
                >
                  <ArrowLeft size={17} aria-hidden="true" />
                  {lang === "hi" ? "पार्टी विकल्प पर वापस जाएँ" : "Back to party preference"}
                </button>

                {formData.voterName && (
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--navy)", marginBottom: "16px", background: "#f1f5f9", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <span>👤</span>
                    <span>
                      {lang === "hi" 
                        ? `मतदाता: ${transliterateNameToHindi(formData.voterName)}` 
                        : `Voter: ${formData.voterName}`}
                    </span>
                  </div>
                )}

                <div className="stage-heading choice-heading">
                  <span className="step-chip">{t.step} 03</span>
                  <h2>{t.selectChairman}</h2>
                  <p>{t.selectChairmanDesc}</p>
                </div>

                <div
                  className="option-list"
                  role="radiogroup"
                  aria-label="Chairman options"
                  aria-describedby={errors.selectedChairman ? "selectedChairman-error" : undefined}
                >
                  {activeChairmanOptions.map((chairman, index) => {
                    const isSelected = selectedChairman === chairman.name;
                    const desc = lang === "hi" ? chairman.descHi : chairman.descEn;
                    const displayName = chairman.party === "BJP" && wardBjpCandidate
                      ? (lang === "hi" ? wardBjpCandidate.nameHi : wardBjpCandidate.nameEn)
                      : chairman.party === "Congress" && wardCongressCandidate
                      ? (lang === "hi" ? wardCongressCandidate.nameHi : wardCongressCandidate.nameEn)
                      : (lang === "hi" ? transliterateNameToHindi(chairman.name) : chairman.name);

                    return (
                      <button
                        key={chairman.name}
                        type="button"
                        className={`option-card ${isSelected ? "is-selected" : ""}`}
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => {
                          setSelectedChairman(chairman.name);
                          setErrors((current) => ({ ...current, selectedChairman: undefined, form: undefined }));
                        }}
                      >
                        <span className="option-index">0{index + 1}</span>
                        <span className="option-copy">
                          <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <PartyLogo option={chairman.party} size={32} />
                            <strong>{displayName}</strong>
                          </span>
                          <small>{desc}</small>
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

                <button className="primary-button" type="submit" disabled={!selectedChairman || isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="spinner" size={19} aria-hidden="true" />
                      <span>{t.submittingBtn}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.submitBtn}</span>
                      <CircleCheck size={19} aria-hidden="true" />
                    </>
                  )}
                </button>

                <p className="consent-copy">
                  {t.consentText}
                </p>
              </form>
            );
          })()}

          {stage === "success" && (
            <div className="stage success-stage" role="status" aria-live="polite">
              <div className="success-mark" aria-hidden="true">
                <span className="success-ring" />
                <Check size={38} strokeWidth={2.6} />
              </div>
              <span className="success-kicker">{lang === "hi" ? "उत्तर दर्ज किया गया" : "Response recorded"}</span>
              <h2>{t.successMsg}</h2>
              <p>{t.recordedMsg}</p>
              {selectedOption && (
                <div className="selected-choice-badge" style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
                  {t.selectedChoice}: <PartyLogo option={selectedOption} size={24} /> <strong>{selectedOption}</strong>
                </div>
              )}
              {selectedChairman && (
                <div className="selected-choice-badge" style={{ marginTop: "8px" }}>
                  {t.selectedChairmanChoice}: <strong>{selectedChairman}</strong>
                </div>
              )}
              <div className="success-privacy">
                <LockKeyhole size={17} aria-hidden="true" />
                {t.privacyText}
              </div>
              <button className="secondary-button" type="button" onClick={resetSurvey}>
                {t.anotherResponseBtn}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

function FieldError({ id, message, centered = false }: { id: string; message: string; centered?: boolean }) {
  return (
    <p id={id} className={`field-error ${centered ? "is-centered" : ""}`} role="alert">
      <span aria-hidden="true">!</span>
      {message}
    </p>
  );
}
