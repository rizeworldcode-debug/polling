const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const Candidate = require("../models/Candidate");

const candidatesData = [
  // Ward 1
  { wardNumber: 1, serialNumber: 1, nameEn: "Benazir Khanam", nameHi: "बेनजीर खानम", party: "Congress", partyAffiliation: "Indian National Congress", symbol: "हाथ (Hand)" },
  { wardNumber: 1, serialNumber: 2, nameEn: "Mahroona", nameHi: "महरूना", party: "BJP", partyAffiliation: "Bharatiya Janata Party", symbol: "कमल (Lotus)" },
  { wardNumber: 1, serialNumber: 3, nameEn: "Nafeesa", nameHi: "नफीसा", party: "Others", partyAffiliation: "Independent", symbol: "अलमारी (Almirah)" },
  { wardNumber: 1, serialNumber: 4, nameEn: "Maiman", nameHi: "मैमन", party: "Others", partyAffiliation: "Independent", symbol: "बक्सा (Box)" },

  // Ward 2
  { wardNumber: 2, serialNumber: 1, nameEn: "Sahroona", nameHi: "सहरूना", party: "Congress", partyAffiliation: "Indian National Congress", symbol: "हाथ (Hand)" },
  { wardNumber: 2, serialNumber: 2, nameEn: "Arastun", nameHi: "अरस्तुन", party: "Others", partyAffiliation: "Independent", symbol: "अलमारी (Almirah)" },

  // Ward 3
  { wardNumber: 3, serialNumber: 1, nameEn: "Govind", nameHi: "गोविन्द", party: "Congress", partyAffiliation: "Indian National Congress", symbol: "हाथ (Hand)" },
  { wardNumber: 3, serialNumber: 2, nameEn: "Manohar Lal", nameHi: "मनोहर लाल", party: "BJP", partyAffiliation: "Bharatiya Janata Party", symbol: "कमल (Lotus)" },
  { wardNumber: 3, serialNumber: 3, nameEn: "Vijay", nameHi: "विजय", party: "Others", partyAffiliation: "Independent", symbol: "कैंची (Scissors)" },

  // Ward 4
  { wardNumber: 4, serialNumber: 1, nameEn: "Alka Kumari", nameHi: "अलका कुमारी", party: "BJP", partyAffiliation: "Bharatiya Janata Party", symbol: "कमल (Lotus)" },
  { wardNumber: 4, serialNumber: 2, nameEn: "Manoj", nameHi: "मनोज", party: "Congress", partyAffiliation: "Indian National Congress", symbol: "हाथ (Hand)" },
  { wardNumber: 4, serialNumber: 3, nameEn: "Preeti Kumari", nameHi: "प्रीति कुमारी", party: "Others", partyAffiliation: "Independent", symbol: "कोट (Coat)" },
  { wardNumber: 4, serialNumber: 4, nameEn: "Lalita", nameHi: "ललिता", party: "Others", partyAffiliation: "Independent", symbol: "अलमारी (Almirah)" },

  // Ward 5
  { wardNumber: 5, serialNumber: 1, nameEn: "Rakesh Gurjar", nameHi: "राकेश गुर्जर", party: "BJP", partyAffiliation: "Bharatiya Janata Party", symbol: "कमल (Lotus)" },
  { wardNumber: 5, serialNumber: 2, nameEn: "Rajesh Kumar", nameHi: "राजेश कुमार", party: "Congress", partyAffiliation: "Indian National Congress", symbol: "हाथ (Hand)" },
  { wardNumber: 5, serialNumber: 3, nameEn: "Aabid Khan", nameHi: "आबिद खाँन", party: "Others", partyAffiliation: "Independent", symbol: "कैंची (Scissors)" },
  { wardNumber: 5, serialNumber: 4, nameEn: "Uday Prakash", nameHi: "उदय प्रकाश", party: "Others", partyAffiliation: "Independent", symbol: "अलमारी (Almirah)" },
  { wardNumber: 5, serialNumber: 5, nameEn: "Raghuveer Saini", nameHi: "रघुवीर सैनी", party: "Others", partyAffiliation: "Independent", symbol: "चप्पलें (Slippers)" },
  { wardNumber: 5, serialNumber: 6, nameEn: "Vinod Kumar", nameHi: "विनोद कुमार", party: "Others", partyAffiliation: "Independent", symbol: "गुब्बारा (Balloon)" },

  // Ward 6
  { wardNumber: 6, serialNumber: 1, nameEn: "Mubeen Khan", nameHi: "मुबीन खाँ", party: "Congress", partyAffiliation: "Indian National Congress", symbol: "हाथ (Hand)" },
  { wardNumber: 6, serialNumber: 2, nameEn: "Shiv Lal", nameHi: "शिव लाल", party: "BJP", partyAffiliation: "Bharatiya Janata Party", symbol: "कमल (Lotus)" },
  { wardNumber: 6, serialNumber: 3, nameEn: "Israil Khan", nameHi: "ईसराइल खाँन", party: "Others", partyAffiliation: "Independent", symbol: "अलमारी (Almirah)" },
  { wardNumber: 6, serialNumber: 4, nameEn: "Kamruddin", nameHi: "कमरूदीन", party: "Others", partyAffiliation: "Independent", symbol: "चारपाई (Cot)" },
  { wardNumber: 6, serialNumber: 5, nameEn: "Jaswant Singh", nameHi: "जसवन्त सिंह", party: "Others", partyAffiliation: "Independent", symbol: "गैस का चूल्हा (Gas Stove)" },
  { wardNumber: 6, serialNumber: 6, nameEn: "Neeraj Yadav", nameHi: "नीरज यादव", party: "Others", partyAffiliation: "Independent", symbol: "चप्पलें (Slippers)" },

  // Ward 7
  { wardNumber: 7, serialNumber: 1, nameEn: "Aarti", nameHi: "आरती", party: "Congress", partyAffiliation: "Indian National Congress", symbol: "हाथ (Hand)" },
  { wardNumber: 7, serialNumber: 2, nameEn: "Ruby", nameHi: "रूबी", party: "BJP", partyAffiliation: "Bharatiya Janata Party", symbol: "कमल (Lotus)" },
  { wardNumber: 7, serialNumber: 3, nameEn: "Alka Bodh", nameHi: "अलका बोध", party: "Others", partyAffiliation: "Independent", symbol: "बाँसुरी (Flute)" },
  { wardNumber: 7, serialNumber: 4, nameEn: "Chandra Kanta", nameHi: "चन्द्र कान्ता", party: "Others", partyAffiliation: "Independent", symbol: "अलमारी (Almirah)" },

  // Ward 8
  { wardNumber: 8, serialNumber: 1, nameEn: "Shri Ram", nameHi: "श्रीराम", party: "BJP", partyAffiliation: "Bharatiya Janata Party", symbol: "कमल (Lotus)" },
  { wardNumber: 8, serialNumber: 2, nameEn: "Pooran Mal Jatav", nameHi: "पूरण मल जाटव", party: "Others", partyAffiliation: "Independent", symbol: "अलमारी (Almirah)" },

  // Ward 9
  { wardNumber: 9, serialNumber: 1, nameEn: "Ajruddin", nameHi: "अजरूदीन", party: "BJP", partyAffiliation: "Bharatiya Janata Party", symbol: "कमल (Lotus)" },
  { wardNumber: 9, serialNumber: 2, nameEn: "Shakeel Khan", nameHi: "शकील खान", party: "Congress", partyAffiliation: "Indian National Congress", symbol: "हाथ (Hand)" },

  // Ward 10
  { wardNumber: 10, serialNumber: 1, nameEn: "Bane Singh Gurjar", nameHi: "बने सिंह गुर्जर", party: "BJP", partyAffiliation: "Bharatiya Janata Party", symbol: "कमल (Lotus)" },
  { wardNumber: 10, serialNumber: 2, nameEn: "Harhet Kumar", nameHi: "हरहेत कुमार", party: "Congress", partyAffiliation: "Indian National Congress", symbol: "हाथ (Hand)" },
  { wardNumber: 10, serialNumber: 3, nameEn: "Kapil Kumar", nameHi: "कपिल कुमार", party: "Others", partyAffiliation: "Independent", symbol: "लिफाफा (Envelope)" },
  { wardNumber: 10, serialNumber: 4, nameEn: "Rajendra Prasad", nameHi: "राजेन्द्र प्रसाद", party: "Others", partyAffiliation: "Independent", symbol: "अलमारी (Almirah)" },

  // Ward 11
  { wardNumber: 11, serialNumber: 1, nameEn: "Ajjo Bai", nameHi: "अज्जो बाई", party: "BJP", partyAffiliation: "Bharatiya Janata Party", symbol: "कमल (Lotus)" },
  { wardNumber: 11, serialNumber: 2, nameEn: "Rajesh Kumari", nameHi: "राजेश कुमारी", party: "Congress", partyAffiliation: "Indian National Congress", symbol: "हाथ (Hand)" },
  { wardNumber: 11, serialNumber: 3, nameEn: "Kamlesh", nameHi: "कमलेश", party: "Others", partyAffiliation: "Independent", symbol: "सिलाई की मशीन (Sewing Machine)" },
  { wardNumber: 11, serialNumber: 4, nameEn: "Kumusha Bai", nameHi: "कुमुषा बाई", party: "Others", partyAffiliation: "Independent", symbol: "ईंटें (Bricks)" },
  { wardNumber: 11, serialNumber: 5, nameEn: "Resham Devi", nameHi: "रेशम देवी", party: "Others", partyAffiliation: "Independent", symbol: "सेब (Apple)" },

  // Ward 12
  { wardNumber: 12, serialNumber: 1, nameEn: "Dalchand", nameHi: "डालचन्द", party: "Congress", partyAffiliation: "Indian National Congress", symbol: "हाथ (Hand)" },
  { wardNumber: 12, serialNumber: 2, nameEn: "Rattiram", nameHi: "रत्तीराम", party: "BJP", partyAffiliation: "Bharatiya Janata Party", symbol: "कमल (Lotus)" },
  { wardNumber: 12, serialNumber: 3, nameEn: "Kalu Ram", nameHi: "कालू राम", party: "Others", partyAffiliation: "Independent", symbol: "सिलाई की मशीन (Sewing Machine)" },
  { wardNumber: 12, serialNumber: 4, nameEn: "Ramavtar alias Ram Avtar", nameHi: "रामौतार उर्फ राम अवतार", party: "Others", partyAffiliation: "Independent", symbol: "अलमारी (Almirah)" },

  // Ward 13
  { wardNumber: 13, serialNumber: 1, nameEn: "Ekta Kumari", nameHi: "एकता कुमारी", party: "BJP", partyAffiliation: "Bharatiya Janata Party", symbol: "कमल (Lotus)" },
  { wardNumber: 13, serialNumber: 2, nameEn: "Sarmina Khatoon", nameHi: "सरमीना खातून", party: "Congress", partyAffiliation: "Indian National Congress", symbol: "हाथ (Hand)" },
  { wardNumber: 13, serialNumber: 3, nameEn: "Apsana", nameHi: "अपसाना", party: "Others", partyAffiliation: "Independent", symbol: "अलमारी (Almirah)" },

  // Ward 14
  { wardNumber: 14, serialNumber: 1, nameEn: "Mukesh Kumar", nameHi: "मुकेश कुमार", party: "BJP", partyAffiliation: "Bharatiya Janata Party", symbol: "कमल (Lotus)" },
  { wardNumber: 14, serialNumber: 2, nameEn: "Indraraj Gurjar", nameHi: "इन्द्रराज गुर्जर", party: "Others", partyAffiliation: "Independent", symbol: "गुब्बारा (Balloon)" },

  // Ward 15
  { wardNumber: 15, serialNumber: 1, nameEn: "Shahrukh Khan", nameHi: "शाहरूख खाँन", party: "Congress", partyAffiliation: "Indian National Congress", symbol: "हाथ (Hand)" },
  { wardNumber: 15, serialNumber: 2, nameEn: "Amar Mohammad", nameHi: "अमर मौहम्मद", party: "Others", partyAffiliation: "Independent", symbol: "अलमारी (Almirah)" },
  { wardNumber: 15, serialNumber: 3, nameEn: "Harchand Gurjar", nameHi: "हरचंद गुर्जर", party: "Others", partyAffiliation: "Independent", symbol: "कैंची (Scissors)" },

  // Ward 16
  { wardNumber: 16, serialNumber: 1, nameEn: "Balwant Singh Yadav", nameHi: "बलवंत सिहँ यादव", party: "BJP", partyAffiliation: "Bharatiya Janata Party", symbol: "कमल (Lotus)" },
  { wardNumber: 16, serialNumber: 2, nameEn: "Lokesh Sharma", nameHi: "लोकेश शर्मा", party: "Congress", partyAffiliation: "Indian National Congress", symbol: "हाथ (Hand)" },
  { wardNumber: 16, serialNumber: 3, nameEn: "Inder Kumar", nameHi: "इन्दर कुमार", party: "Others", partyAffiliation: "Independent", symbol: "सेब (Apple)" },
  { wardNumber: 16, serialNumber: 4, nameEn: "Ganesh Chand", nameHi: "गणेश चन्द", party: "Others", partyAffiliation: "Independent", symbol: "सिलाई की मशीन (Sewing Machine)" },

  // Ward 17
  { wardNumber: 17, serialNumber: 1, nameEn: "Ajay Kumar Koli", nameHi: "अजय कुमार कोली", party: "BJP", partyAffiliation: "Bharatiya Janata Party", symbol: "कमल (Lotus)" },
  { wardNumber: 17, serialNumber: 2, nameEn: "Labh Chand Koli", nameHi: "लाभ चन्द कोली", party: "Congress", partyAffiliation: "Indian National Congress", symbol: "हाथ (Hand)" },
  { wardNumber: 17, serialNumber: 3, nameEn: "Bhajan Lal", nameHi: "भजन लाल", party: "Others", partyAffiliation: "Independent", symbol: "गुब्बारा (Balloon)" },
  { wardNumber: 17, serialNumber: 4, nameEn: "Mahesh Kumar", nameHi: "महेश कुमार", party: "Others", partyAffiliation: "Independent", symbol: "बाँसुरी (Flute)" },
  { wardNumber: 17, serialNumber: 5, nameEn: "Lalit", nameHi: "ललित", party: "Others", partyAffiliation: "Independent", symbol: "सेब (Apple)" },

  // Ward 18
  { wardNumber: 18, serialNumber: 1, nameEn: "Tara Chand Khati", nameHi: "तारा चन्द खाती", party: "BJP", partyAffiliation: "Bharatiya Janata Party", symbol: "कमल (Lotus)" },
  { wardNumber: 18, serialNumber: 2, nameEn: "Balbir Prasad", nameHi: "बलबीर प्रसाद", party: "Congress", partyAffiliation: "Indian National Congress", symbol: "हाथ (Hand)" },
  { wardNumber: 18, serialNumber: 3, nameEn: "Aaseen Khan", nameHi: "आसीन खान", party: "Others", partyAffiliation: "Independent", symbol: "बाँसुरी (Flute)" },
  { wardNumber: 18, serialNumber: 4, nameEn: "Girraj Prasad Saini", nameHi: "गिर्राज प्रसाद सैनी", party: "Others", partyAffiliation: "Independent", symbol: "सेब (Apple)" },
  { wardNumber: 18, serialNumber: 5, nameEn: "Jitendra Kumar", nameHi: "जितेन्द्र कुमार", party: "Others", partyAffiliation: "Independent", symbol: "अलमारी (Almirah)" },
  { wardNumber: 18, serialNumber: 6, nameEn: "Hakim Deen", nameHi: "हाकिम दीन", party: "Others", partyAffiliation: "Independent", symbol: "गुब्बारा (Balloon)" },

  // Ward 19
  { wardNumber: 19, serialNumber: 1, nameEn: "Umesh Kumar", nameHi: "उमेश कुमार", party: "BJP", partyAffiliation: "Bharatiya Janata Party", symbol: "कमल (Lotus)" },
  { wardNumber: 19, serialNumber: 2, nameEn: "Kamal Saini", nameHi: "कमल सैनी", party: "Congress", partyAffiliation: "Indian National Congress", symbol: "हाथ (Hand)" },
  { wardNumber: 19, serialNumber: 3, nameEn: "Suresh Chand", nameHi: "सुरेश चन्द", party: "Others", partyAffiliation: "Independent", symbol: "अलमारी (Almirah)" },

  // Ward 20
  { wardNumber: 20, serialNumber: 1, nameEn: "Pooja Sharma", nameHi: "पूजा शर्मा", party: "BJP", partyAffiliation: "Bharatiya Janata Party", symbol: "कमल (Lotus)" },
  { wardNumber: 20, serialNumber: 2, nameEn: "Bismilla", nameHi: "बिसमिल्ला", party: "Congress", partyAffiliation: "Indian National Congress", symbol: "हाथ (Hand)" },
  { wardNumber: 20, serialNumber: 3, nameEn: "Anjum", nameHi: "अंजुम", party: "Others", partyAffiliation: "Independent", symbol: "अलमारी (Almirah)" },
  { wardNumber: 20, serialNumber: 4, nameEn: "Doli Jangid", nameHi: "डोली जाँगिड", party: "Others", partyAffiliation: "Independent", symbol: "कोट (Coat)" },

  // Ward 21
  { wardNumber: 21, serialNumber: 1, nameEn: "Jyoti Rajput", nameHi: "ज्योति राजपूत", party: "BJP", partyAffiliation: "Bharatiya Janata Party", symbol: "कमल (Lotus)" },
  { wardNumber: 21, serialNumber: 2, nameEn: "Beena", nameHi: "बीना", party: "Congress", partyAffiliation: "Indian National Congress", symbol: "हाथ (Hand)" },
  { wardNumber: 21, serialNumber: 3, nameEn: "Kalpana Goyal", nameHi: "कल्पना गोयल", party: "Others", partyAffiliation: "Independent", symbol: "अलमारी (Almirah)" },
  { wardNumber: 21, serialNumber: 4, nameEn: "Pinki", nameHi: "पिंकी", party: "Others", partyAffiliation: "Independent", symbol: "बाल्टी (Bucket)" },

  // Ward 22
  { wardNumber: 22, serialNumber: 1, nameEn: "Vikas Sahu", nameHi: "विकास साहू", party: "BJP", partyAffiliation: "Bharatiya Janata Party", symbol: "कमल (Lotus)" },
  { wardNumber: 22, serialNumber: 2, nameEn: "Satish Kumar", nameHi: "सतीश कुमार", party: "Congress", partyAffiliation: "Indian National Congress", symbol: "हाथ (Hand)" },
  { wardNumber: 22, serialNumber: 3, nameEn: "Ayub Khan", nameHi: "अयुब खांन", party: "Others", partyAffiliation: "Independent", symbol: "सेब (Apple)" },
  { wardNumber: 22, serialNumber: 4, nameEn: "Kavisha", nameHi: "कविशा", party: "Others", partyAffiliation: "Independent", symbol: "बाल्टी (Bucket)" },
  { wardNumber: 22, serialNumber: 5, nameEn: "Gourav Jain", nameHi: "गौरव जैन", party: "Others", partyAffiliation: "Independent", symbol: "बाँसुरी (Flute)" },
  { wardNumber: 22, serialNumber: 6, nameEn: "Manish Kumar", nameHi: "मनीष कुमार", party: "Others", partyAffiliation: "Independent", symbol: "कोट (Coat)" },
  { wardNumber: 22, serialNumber: 7, nameEn: "Himanshu Kumar", nameHi: "हिमांशु कुमार", party: "Others", partyAffiliation: "Independent", symbol: "अलमारी (Almirah)" },

  // Ward 23
  { wardNumber: 23, serialNumber: 1, nameEn: "Meena", nameHi: "मीना", party: "BJP", partyAffiliation: "Bharatiya Janata Party", symbol: "कमल (Lotus)" },
  { wardNumber: 23, serialNumber: 2, nameEn: "Waseema Bano", nameHi: "वसीमा बानो", party: "Congress", partyAffiliation: "Indian National Congress", symbol: "हाथ (Hand)" },
  { wardNumber: 23, serialNumber: 3, nameEn: "Anisha", nameHi: "अनिशा", party: "Others", partyAffiliation: "Independent", symbol: "गैस का चूल्हा (Gas Stove)" },
  { wardNumber: 23, serialNumber: 4, nameEn: "Kalsum", nameHi: "कलसुम", party: "Others", partyAffiliation: "Independent", symbol: "गुब्बारा (Balloon)" },
  { wardNumber: 23, serialNumber: 5, nameEn: "Hanseera", nameHi: "हनसीरा", party: "Others", partyAffiliation: "Independent", symbol: "अलमारी (Almirah)" },

  // Ward 24
  { wardNumber: 24, serialNumber: 1, nameEn: "Ajeet Singh", nameHi: "अजीत सिंह", party: "Congress", partyAffiliation: "Indian National Congress", symbol: "हाथ (Hand)" },
  { wardNumber: 24, serialNumber: 2, nameEn: "Ram Singh", nameHi: "रामसिंह", party: "BJP", partyAffiliation: "Bharatiya Janata Party", symbol: "कमल (Lotus)" },
  { wardNumber: 24, serialNumber: 3, nameEn: "Parvez", nameHi: "परवेज", party: "Others", partyAffiliation: "Independent", symbol: "कैंची (Scissors)" },

  // Ward 25
  { wardNumber: 25, serialNumber: 1, nameEn: "Naseem Khan", nameHi: "नसीम खान", party: "Congress", partyAffiliation: "Indian National Congress", symbol: "हाथ (Hand)" },
  { wardNumber: 25, serialNumber: 2, nameEn: "Ramesh Chand", nameHi: "रमेश चंद", party: "BJP", partyAffiliation: "Bharatiya Janata Party", symbol: "कमल (Lotus)" },
  { wardNumber: 25, serialNumber: 3, nameEn: "Taufiq Ahmad", nameHi: "तौफीक अहमद", party: "Others", partyAffiliation: "Independent", symbol: "अलमारी (Almirah)" },
  { wardNumber: 25, serialNumber: 4, nameEn: "Mohammad Shahid", nameHi: "मोहम्मद शाहिद", party: "Others", partyAffiliation: "Independent", symbol: "चारपाई (Cot)" },
  { wardNumber: 25, serialNumber: 5, nameEn: "Sunil Kumar", nameHi: "सुनील कुमार", party: "Others", partyAffiliation: "Independent", symbol: "बाल्टी (Bucket)" },
];

const connectDB = require("../config/db");

async function seedCandidates() {
  try {
    await connectDB();
    console.log("Connected to MongoDB.");

    await Candidate.deleteMany({});
    console.log("Cleared existing candidates.");

    const seeded = await Candidate.insertMany(candidatesData);
    console.log(`Successfully seeded ${seeded.length} candidates across 25 Wards!`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
}

seedCandidates();
