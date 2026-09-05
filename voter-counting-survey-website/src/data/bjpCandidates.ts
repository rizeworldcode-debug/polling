export type BjpCandidate = {
  wardNumber: number;
  nameEn: string;
  nameHi: string;
  categoryEn: string;
  categoryHi: string;
  isVacant?: boolean;
};

export const bjpCandidates: BjpCandidate[] = [
  { wardNumber: 1, nameEn: "Mahroona", nameHi: "महरूना", categoryEn: "OBC Female", categoryHi: "ओबीसी महिला" },
  { wardNumber: 2, nameEn: "Vacant (Rikt)", nameHi: "रिक्त", categoryEn: "OBC Female", categoryHi: "ओबीसी महिला", isVacant: true },
  { wardNumber: 3, nameEn: "Manohar Lal", nameHi: "मनोहर लाल", categoryEn: "General", categoryHi: "सामान्य" },
  { wardNumber: 4, nameEn: "Alka Kumari", nameHi: "अलका कुमारी", categoryEn: "SC Female", categoryHi: "एससी महिला" },
  { wardNumber: 5, nameEn: "Rakesh Gurjar", nameHi: "राकेश गुर्जर", categoryEn: "OBC", categoryHi: "ओबीसी" },
  { wardNumber: 6, nameEn: "Shiv Lal", nameHi: "शिव लाल", categoryEn: "General", categoryHi: "सामान्य" },
  { wardNumber: 7, nameEn: "Ruby", nameHi: "रूबी", categoryEn: "SC Female", categoryHi: "एससी महिला" },
  { wardNumber: 8, nameEn: "Shri Ram", nameHi: "श्रीराम", categoryEn: "SC", categoryHi: "एससी" },
  { wardNumber: 9, nameEn: "Ajruddin", nameHi: "अजरूदीन", categoryEn: "General", categoryHi: "सामान्य" },
  { wardNumber: 10, nameEn: "Bane Singh Gurjar", nameHi: "बने सिंह गुर्जर", categoryEn: "General", categoryHi: "सामान्य" },
  { wardNumber: 11, nameEn: "Ajjo Bai", nameHi: "अज्जो बाई", categoryEn: "OBC Female", categoryHi: "ओबीसी महिला" },
  { wardNumber: 12, nameEn: "Rattiram", nameHi: "रत्तीराम", categoryEn: "SC", categoryHi: "एससी" },
  { wardNumber: 13, nameEn: "Ekta Kumari", nameHi: "एकता कुमारी", categoryEn: "General Female", categoryHi: "सामान्य महिला" },
  { wardNumber: 14, nameEn: "Mukesh Kumar", nameHi: "मुकेश कुमार", categoryEn: "General", categoryHi: "सामान्य" },
  { wardNumber: 15, nameEn: "Vacant (Rikt)", nameHi: "रिक्त", categoryEn: "General", categoryHi: "सामान्य", isVacant: true },
  { wardNumber: 16, nameEn: "Balwant Singh Yadav", nameHi: "बलवंत सिहँ यादव", categoryEn: "General", categoryHi: "सामान्य" },
  { wardNumber: 17, nameEn: "Ajay Kumar Koli", nameHi: "अजय कुमार कोली", categoryEn: "SC", categoryHi: "एससी" },
  { wardNumber: 18, nameEn: "Tara Chand Khati", nameHi: "तारा चन्द खाती", categoryEn: "OBC", categoryHi: "ओबीसी" },
  { wardNumber: 19, nameEn: "Umesh Kumar", nameHi: "उमेश कुमार", categoryEn: "OBC", categoryHi: "ओबीसी" },
  { wardNumber: 20, nameEn: "Pooja Sharma", nameHi: "पूजा शर्मा", categoryEn: "General Female", categoryHi: "सामान्य महिला" },
  { wardNumber: 21, nameEn: "Jyoti Rajput", nameHi: "ज्योति राजपूत", categoryEn: "General Female", categoryHi: "सामान्य महिला" },
  { wardNumber: 22, nameEn: "Vikas Sahu", nameHi: "विकास साहू", categoryEn: "General", categoryHi: "सामान्य" },
  { wardNumber: 23, nameEn: "Meena", nameHi: "मीना", categoryEn: "General Female", categoryHi: "सामान्य महिला" },
  { wardNumber: 24, nameEn: "Ram Singh", nameHi: "रामसिंह", categoryEn: "General", categoryHi: "सामान्य" },
  { wardNumber: 25, nameEn: "Ramesh Chand", nameHi: "रमेश चंद", categoryEn: "General", categoryHi: "सामान्य" },
];

export function getBjpCandidateForWard(wardNumber: number | string): BjpCandidate | undefined {
  const num = typeof wardNumber === "string" ? parseInt(wardNumber, 10) : wardNumber;
  return bjpCandidates.find((c) => c.wardNumber === num && !c.isVacant);
}
