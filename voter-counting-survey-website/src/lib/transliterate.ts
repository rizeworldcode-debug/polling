const nameDictionary: Record<string, string> = {
  "khan": "खान",
  "ismaila": "इस्माइल",
  "ismail": "इस्माइल",
  "chndara": "चन्द्र",
  "chandra": "चन्द्र",
  "sadabani": "सदाबनी",
  "samira": "समीरा",
  "anusha": "अनुषा",
  "allah": "अल्लाह",
  "manisha": "मनीषा",
  "irafan": "इरफ़ान",
  "irfan": "इरफ़ान",
  "nizamu": "निज़ामु",
  "din": "दीन",
  "bhoori": "भूरी",
  "sardari": "सरदारी",
  "ahir": "अहीर",
  "devi": "देवी",
  "ram": "राम",
  "sharma": "शर्मा",
  "verma": "वर्मा",
  "singh": "सिंह",
  "kumar": "कुमार",
  "prasad": "प्रसाद",
  "lal": "लाल",
  "mohammad": "मोहम्मद",
  "mohd": "मोहम्मद",
  "mian": "मियां",
  "begum": "बेगम",
  "banu": "बानो",
  "bano": "बानो",
  "ali": "अली",
  "husain": "हुसैन",
  "hussain": "हुसैन",
  "ahmad": "अहमद",
  "ahmed": "अहमद",
  "shankar": "शंकर",
  "hari": "हरि",
  "gopal": "गोपाल",
  "krishna": "कृष्ण",
  "sanjay": "संजय",
  "ramesh": "रमेश",
  "sunita": "सुनीता",
  "pooja": "पूजा",
  "abdul": "अब्दुल",
  "rauf": "रऊफ़",
  "kamil": "कामिल",
  "ansari": "अंसारी",
  "zaheer": "ज़हीर",
  "vikas": "विकास",
  "devender": "देवेन्द्र",
  "mohit": "मोहित",
  "manoj": "मनोज",
  "benazir": "बेनज़ीर",
  "shehroona": "शह्रूना",
  "govind": "गोविंद",
  "saini": "सैनी",
  "kumari": "कुमारी",
  "rajesh": "राजेश",
  "mubeen": "मुबीन",
  "aarti": "आरती",
  "shakeel": "शकील",
  "harhet": "हरहेत",
  "dalchand": "दलचंद",
  "sarmeena": "सरमीना",
  "shahrukh": "शाहरुख",
  "lokesh": "लोकेश",
  "ramchand": "रामचंद",
  "balveer": "बलवीर",
  "kamal": "कमल",
  "bismilla": "बिस्मिल्ला",
  "bina": "बीना",
  "ashok": "अशोक",
  "satish": "सतीश",
  "waseema": "वसीमा",
  "ajeet": "अजीत",
  "naseem": "नसीम",
  "mahroona": "महरूना",
  "alka": "अलका",
  "rakesh": "राकेश",
  "gurjar": "गुर्जर",
  "shiv": "शिव",
  "ruby": "रुबी",
  "azruddin": "अजरुद्दीन",
  "bane": "बने",
  "ajjo": "अज्जो",
  "bai": "बाई",
  "ratiram": "रतिराम",
  "ekta": "एकता",
  "mukesh": "मुकेश",
  "balwant": "बलवंत",
  "koli": "कोली",
  "tara": "तारा",
  "chand": "चंद",
  "khati": "खाती",
  "umesh": "उमेश",
  "jyoti": "ज्योति",
  "rajput": "राजपूत",
  "sahu": "साहू",
  "meena": "मीना",
  "smt": "श्रीमती",
  "shri": "श्री",
  "nabbi": "नब्बी",
  "bhoora": "भूरा",
  "bas": "बास",
  "dhani": "ढाणी",
  "kajakpur": "कजकपुर",
  "nizamu din": "निज़ामुद्दीन",
  "nizamuddin": "निज़ामुद्दीन",
};

const digraphs: Record<string, string> = {
  "sh": "श", "ch": "च", "bh": "भ", "gh": "घ", "dh": "ध",
  "kh": "ख", "th": "थ", "ph": "फ", "jh": "झ", "aa": "ा",
  "ee": "ी", "oo": "ू", "ai": "ै", "au": "ौ"
};

const units: Record<string, string> = {
  "a": "ा", "b": "ब", "c": "क", "d": "द", "e": "े", "f": "फ",
  "g": "ग", "h": "ह", "i": "ि", "j": "ज", "k": "क", "l": "ल",
  "m": "म", "n": "न", "o": "ो", "p": "प", "q": "क", "r": "र",
  "s": "स", "t": "त", "u": "ु", "v": "व", "w": "व", "x": "क्स",
  "y": "य", "z": "ज़"
};

export function transliterateWord(word: string): string {
  const clean = word.toLowerCase().trim();
  if (!clean) return "";

  // 1. Check direct dictionary
  if (nameDictionary[clean]) {
    return nameDictionary[clean];
  }

  // 2. Handle suffix splits like "khan"
  if (clean.endsWith("khan") && clean.length > 4) {
    const base = clean.slice(0, -4);
    return `${transliterateWord(base)} खान`;
  }
  if (clean.endsWith("akhan") && clean.length > 5) {
    const base = clean.slice(0, -5);
    return `${transliterateWord(base)} खान`;
  }

  // 3. Fallback to character-by-character mapping
  let result = "";
  let i = 0;
  while (i < clean.length) {
    // Check digraph
    if (i < clean.length - 1) {
      const pair = clean.substr(i, 2);
      if (digraphs[pair]) {
        result += digraphs[pair];
        i += 2;
        continue;
      }
    }
    const char = clean[i];
    result += units[char] || char;
    i++;
  }

  // Post-processing to make it look natural
  if (result.startsWith("ा")) result = "आ" + result.slice(1);
  if (result.startsWith("ि")) result = "इ" + result.slice(1);
  if (result.startsWith("ी")) result = "ई" + result.slice(1);
  if (result.startsWith("ु")) result = "उ" + result.slice(1);
  if (result.startsWith("ू")) result = "ऊ" + result.slice(1);
  if (result.startsWith("े")) result = "ए" + result.slice(1);
  if (result.startsWith("ो")) result = "ओ" + result.slice(1);

  return result;
}

export function transliterateNameToHindi(name: string): string {
  if (!name) return "";
  const hasDevanagari = /[\u0900-\u097F]/.test(name);
  if (hasDevanagari) return name;

  return name
    .split(/\s+/)
    .map(transliterateWord)
    .join(" ");
}
