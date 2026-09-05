export type CongressCandidate = {
  wardNumber: number;
  nameEn: string;
  nameHi: string;
  categoryEn: string;
  categoryHi: string;
  isVacant?: boolean;
};

export const congressCandidates: CongressCandidate[] = [
  { wardNumber: 1, nameEn: "Benazir Khanam", nameHi: "बेनजीर खानम", categoryEn: "General Female", categoryHi: "सामान्य महिला" },
  { wardNumber: 2, nameEn: "Sahroona", nameHi: "सहरूना", categoryEn: "OBC Female", categoryHi: "ओबीसी महिला" },
  { wardNumber: 3, nameEn: "Govind", nameHi: "गोविन्द", categoryEn: "General", categoryHi: "सामान्य" },
  { wardNumber: 4, nameEn: "Manoj", nameHi: "मनोज", categoryEn: "SC Female", categoryHi: "एससी महिला" },
  { wardNumber: 5, nameEn: "Rajesh Kumar", nameHi: "राजेश कुमार", categoryEn: "OBC", categoryHi: "ओबीसी" },
  { wardNumber: 6, nameEn: "Mubeen Khan", nameHi: "मुबीन खाँ", categoryEn: "General", categoryHi: "सामान्य" },
  { wardNumber: 7, nameEn: "Aarti", nameHi: "आरती", categoryEn: "SC Female", categoryHi: "एससी महिला" },
  { wardNumber: 8, nameEn: "Vacant (Rikt)", nameHi: "रिक्त", categoryEn: "SC", categoryHi: "एससी", isVacant: true },
  { wardNumber: 9, nameEn: "Shakeel Khan", nameHi: "शकील खान", categoryEn: "General", categoryHi: "सामान्य" },
  { wardNumber: 10, nameEn: "Harhet Kumar", nameHi: "हरहेत कुमार", categoryEn: "General", categoryHi: "सामान्य" },
  { wardNumber: 11, nameEn: "Rajesh Kumari", nameHi: "राजेश कुमारी", categoryEn: "OBC Female", categoryHi: "ओबीसी महिला" },
  { wardNumber: 12, nameEn: "Dalchand", nameHi: "डालचन्द", categoryEn: "SC", categoryHi: "एससी" },
  { wardNumber: 13, nameEn: "Sarmina Khatoon", nameHi: "सरमीना खातून", categoryEn: "General Female", categoryHi: "सामान्य महिला" },
  { wardNumber: 14, nameEn: "Vacant (Rikt)", nameHi: "रिक्त", categoryEn: "General", categoryHi: "सामान्य", isVacant: true },
  { wardNumber: 15, nameEn: "Shahrukh Khan", nameHi: "शाहरूख खाँन", categoryEn: "General", categoryHi: "सामान्य" },
  { wardNumber: 16, nameEn: "Lokesh Sharma", nameHi: "लोकेश शर्मा", categoryEn: "General Male", categoryHi: "सामान्य" },
  { wardNumber: 17, nameEn: "Labh Chand Koli", nameHi: "लाभ चन्द कोली", categoryEn: "SC", categoryHi: "एससी" },
  { wardNumber: 18, nameEn: "Balbir Prasad", nameHi: "बलबीर प्रसाद", categoryEn: "OBC", categoryHi: "ओबीसी" },
  { wardNumber: 19, nameEn: "Kamal Saini", nameHi: "कमल सैनी", categoryEn: "OBC", categoryHi: "ओबीसी" },
  { wardNumber: 20, nameEn: "Bismilla", nameHi: "बिसमिल्ला", categoryEn: "General Female", categoryHi: "सामान्य महिला" },
  { wardNumber: 21, nameEn: "Beena", nameHi: "बीना", categoryEn: "General Female", categoryHi: "सामान्य महिला" },
  { wardNumber: 22, nameEn: "Satish Kumar", nameHi: "सतीश कुमार", categoryEn: "General", categoryHi: "सामान्य" },
  { wardNumber: 23, nameEn: "Waseema Bano", nameHi: "वसीमा बानो", categoryEn: "General Female", categoryHi: "सामान्य महिला" },
  { wardNumber: 24, nameEn: "Ajeet Singh", nameHi: "अजीत सिंह", categoryEn: "General Male", categoryHi: "सामान्य" },
  { wardNumber: 25, nameEn: "Naseem Khan", nameHi: "नसीम खान", categoryEn: "General Male", categoryHi: "सामान्य" },
];

export function getCongressCandidateForWard(wardNumber: number | string): CongressCandidate | undefined {
  const num = typeof wardNumber === "string" ? parseInt(wardNumber, 10) : wardNumber;
  return congressCandidates.find((c) => c.wardNumber === num && !c.isVacant);
}
