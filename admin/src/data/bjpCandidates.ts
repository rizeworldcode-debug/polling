export type BjpCandidate = {
  wardNumber: number;
  nameEn: string;
  nameHi: string;
  categoryEn: string;
  categoryHi: string;
  isVacant?: boolean;
};

export const bjpCandidates: BjpCandidate[] = [
  { wardNumber: 1, nameEn: "Smt. Mahroona", nameHi: "श्रीमती महरूना", categoryEn: "OBC Female", categoryHi: "ओबीसी महिला" },
  { wardNumber: 2, nameEn: "Vacant (Rikt)", nameHi: "रिक्त", categoryEn: "OBC Female", categoryHi: "ओबीसी महिला", isVacant: true },
  { wardNumber: 3, nameEn: "Shri Manohar Lal", nameHi: "श्री मनोहर लाल", categoryEn: "General", categoryHi: "सामान्य" },
  { wardNumber: 4, nameEn: "Smt. Alka Kumari", nameHi: "श्रीमती अलका कुमारी", categoryEn: "SC Female", categoryHi: "एससी महिला" },
  { wardNumber: 5, nameEn: "Shri Rakesh Gurjar", nameHi: "श्री राकेश गुर्जर", categoryEn: "OBC", categoryHi: "ओबीसी" },
  { wardNumber: 6, nameEn: "Shri Shiv Lal", nameHi: "श्री शिव लाल", categoryEn: "General", categoryHi: "सामान्य" },
  { wardNumber: 7, nameEn: "Smt. Ruby", nameHi: "श्रीमती रुबी", categoryEn: "SC Female", categoryHi: "एससी महिला" },
  { wardNumber: 8, nameEn: "Shri Shri Ram", nameHi: "श्री श्री राम", categoryEn: "SC", categoryHi: "एससी" },
  { wardNumber: 9, nameEn: "Shri Azruddin", nameHi: "श्री अजरुद्दीन", categoryEn: "General", categoryHi: "सामान्य" },
  { wardNumber: 10, nameEn: "Shri Bane Singh Gurjar", nameHi: "श्री बने सिंह गुर्जर", categoryEn: "General", categoryHi: "सामान्य" },
  { wardNumber: 11, nameEn: "Smt. Ajjo Bai", nameHi: "श्रीमती अज्जो बाई", categoryEn: "OBC Female", categoryHi: "ओबीसी महिला" },
  { wardNumber: 12, nameEn: "Shri Ratiram", nameHi: "श्री रतिराम", categoryEn: "SC", categoryHi: "एससी" },
  { wardNumber: 13, nameEn: "Smt. Ekta Kumari", nameHi: "श्रीमती एकता कुमारी", categoryEn: "General Female", categoryHi: "सामान्य महिला" },
  { wardNumber: 14, nameEn: "Shri Mukesh Kumar", nameHi: "श्री मुकेश कुमार", categoryEn: "General", categoryHi: "सामान्य" },
  { wardNumber: 15, nameEn: "Vacant (Rikt)", nameHi: "रिक्त", categoryEn: "General", categoryHi: "सामान्य", isVacant: true },
  { wardNumber: 16, nameEn: "Shri Balwant Singh Yadav", nameHi: "श्री बलवंत सिंह यादव", categoryEn: "General", categoryHi: "सामान्य" },
  { wardNumber: 17, nameEn: "Shri Ajay Kumar Koli", nameHi: "श्री अजय कुमार कोली", categoryEn: "SC", categoryHi: "एससी" },
  { wardNumber: 18, nameEn: "Shri Tara Chand Khati", nameHi: "श्री तारा चंद खाती", categoryEn: "OBC", categoryHi: "ओबीसी" },
  { wardNumber: 19, nameEn: "Shri Umesh Kumar", nameHi: "श्री उमेश कुमार", categoryEn: "OBC", categoryHi: "ओबीसी" },
  { wardNumber: 20, nameEn: "Smt. Pooja Sharma", nameHi: "श्रीमती पूजा शर्मा", categoryEn: "General Female", categoryHi: "सामान्य महिला" },
  { wardNumber: 21, nameEn: "Smt. Jyoti Rajput", nameHi: "श्रीमती ज्योति राजपूत", categoryEn: "General Female", categoryHi: "सामान्य महिला" },
  { wardNumber: 22, nameEn: "Shri Vikas Sahu", nameHi: "श्री विकास साहू", categoryEn: "General", categoryHi: "सामान्य" },
  { wardNumber: 23, nameEn: "Smt. Meena", nameHi: "श्रीमती मीना", categoryEn: "General Female", categoryHi: "सामान्य महिला" },
  { wardNumber: 24, nameEn: "Shri Ram Singh", nameHi: "श्री राम सिंह", categoryEn: "General", categoryHi: "सामान्य" },
  { wardNumber: 25, nameEn: "Shri Ramesh Chand", nameHi: "श्री रमेश चंद", categoryEn: "General", categoryHi: "सामान्य" },
];

export function getBjpCandidateForWard(wardNumber: number | string): BjpCandidate | undefined {
  const num = typeof wardNumber === "string" ? parseInt(wardNumber, 10) : wardNumber;
  return bjpCandidates.find((c) => c.wardNumber === num && !c.isVacant);
}

export function isBjpCandidate(name?: string): boolean {
  if (!name) return false;
  const norm = name.trim().toLowerCase();
  return bjpCandidates.some(
    (c) => c.nameEn.toLowerCase() === norm || c.nameHi.toLowerCase() === norm || norm.includes(c.nameEn.toLowerCase())
  );
}
