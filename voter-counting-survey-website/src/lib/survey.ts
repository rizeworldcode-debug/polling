import { wards } from "@/data/wards";

export const surveyOptions = ["BJP", "Congress", "Others"] as const;
export type SurveyOption = (typeof surveyOptions)[number];

export type SurveyFormData = {
  wardNumber: string;
  voterName: string;
  fatherName: string;
  mobileNumber: string;
  address: string;
  candidateName: string;
};

export type SurveyPayload = {
  wardNumber: number;
  voterName: string;
  fatherName: string;
  mobileNumber: string;
  address: string;
  candidateName?: string;
  selectedOption: SurveyOption;
  selectedChairman: string;
};

export type SurveyField = keyof SurveyFormData;
export type SurveyErrors = Partial<Record<SurveyField | "selectedOption" | "selectedChairman" | "form", string>>;

const personNamePattern = /^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]*$/u;
const mobileNumberPattern = /^[6-9]\d{9}$/;

function normalizeText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";

  return value
    .normalize("NFKC")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function normalizeSurveyInput(input: Record<string, unknown>): SurveyPayload {
  const rawWardNumber =
    typeof input.wardNumber === "number" || typeof input.wardNumber === "string"
      ? Number(input.wardNumber)
      : Number.NaN;

  return {
    wardNumber: rawWardNumber,
    voterName: normalizeText(input.voterName, 80),
    fatherName: normalizeText(input.fatherName, 80),
    mobileNumber: normalizeText(input.mobileNumber, 15).replace(/\s/g, ""),
    address: normalizeText(input.address, 200),
    candidateName: normalizeText(input.candidateName, 80),
    selectedOption: normalizeText(input.selectedOption, 16) as SurveyOption,
    selectedChairman: normalizeText(input.selectedChairman, 80),
  };
}

export function validateSurveyDetails(data: SurveyFormData): SurveyErrors {
  const errors: SurveyErrors = {};
  const wardNumber = Number(data.wardNumber);
  const voterName = normalizeText(data.voterName, 80);
  const fatherName = normalizeText(data.fatherName, 80);
  const mobileNumber = normalizeText(data.mobileNumber, 15).replace(/\s/g, "");
  const address = normalizeText(data.address, 200);

  if (!wards.some((ward) => ward.wardNumber === wardNumber)) {
    errors.wardNumber = "Please select your ward and area.";
  }

  if (!voterName) {
    errors.voterName = "Please enter the voter name.";
  } else if (voterName.length < 2 || !personNamePattern.test(voterName)) {
    errors.voterName = "Enter a valid name using letters, spaces, dots or hyphens.";
  }

  if (!fatherName) {
    errors.fatherName = "Please enter the relative's name.";
  } else if (fatherName.length < 2 || !personNamePattern.test(fatherName)) {
    errors.fatherName = "Enter a valid name using letters, spaces, dots or hyphens.";
  }

  if (!mobileNumber) {
    errors.mobileNumber = "Please enter the mobile number.";
  } else if (!mobileNumberPattern.test(mobileNumber)) {
    errors.mobileNumber = "Enter a valid 10-digit mobile number.";
  }

  if (!address) {
    errors.address = "Please enter the address.";
  } else if (address.length < 3) {
    errors.address = "Please enter a valid address (at least 3 characters).";
  }

  return errors;
}

export function validateSurveyPayload(input: unknown):
  | { success: true; data: SurveyPayload }
  | { success: false; errors: SurveyErrors } {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { success: false, errors: { form: "Invalid submission data." } };
  }

  const data = normalizeSurveyInput(input as Record<string, unknown>);
  const detailErrors = validateSurveyDetails({
    wardNumber: String(data.wardNumber),
    voterName: data.voterName,
    fatherName: data.fatherName,
    mobileNumber: data.mobileNumber,
    address: data.address,
    candidateName: data.candidateName || "",
  });

  if (!surveyOptions.includes(data.selectedOption)) {
    detailErrors.selectedOption = "Please select one option.";
  }

  if (!data.selectedChairman) {
    detailErrors.selectedChairman = "Please select a chairman.";
  }

  if (Object.keys(detailErrors).length > 0) {
    return { success: false, errors: detailErrors };
  }

  return { success: true, data };
}
