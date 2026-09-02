const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const Candidate = require("../models/Candidate");

const candidatesData = [
  // Ward 1
  { wardNumber: 1, serialNumber: 1, nameEn: "Benazir Khanam", nameHi: "बेनज़ीर खानम", address: "Kazakpur, Tehsil Alwar, Village Alwar, Rajasthan - 301028", party: "Congress", partyAffiliation: "Indian National Congress", category: "OBC" },
  { wardNumber: 1, serialNumber: 2, nameEn: "Mahroona", nameHi: "महरूना", address: "Kazakpur, Bahadurpur Patti Jodia, Bahadurpur, Alwar, Rajasthan", party: "BJP", partyAffiliation: "Bharatiya Janata Party", category: "OBC" },
  { wardNumber: 1, serialNumber: 3, nameEn: "Nafisa", nameHi: "नफीसा", address: "Ward No. 1, Kazakpur, Bahadurpur", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 1, serialNumber: 4, nameEn: "Maiman", nameHi: "मैमन", address: "Ward No. 01, Bhure Khan Ka Bas, Jodia Patti, Alwar, Rajasthan - 301028", party: "Others", partyAffiliation: "Independent", category: "OBC" },

  // Ward 2
  { wardNumber: 2, serialNumber: 1, nameEn: "Sahroona", nameHi: "शह्रूना", address: "Patti Jodia, Ward No. 2, Municipality Bahadurpur, Alwar (Raj.) - 301028", party: "Congress", partyAffiliation: "Indian National Congress", category: "OBC" },
  { wardNumber: 2, serialNumber: 2, nameEn: "Arastun", nameHi: "अरस्तुन", address: "Ward No. 2, Jodia Bas, Bahadurpur, Alwar", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 2, serialNumber: 3, nameEn: "Arseeda", nameHi: "असीदा", address: "Patti Jodia, Ward No. 2, Municipality Bahadurpur, Alwar (Raj.) Pin - 301028", party: "Others", partyAffiliation: "Independent", category: "OBC" },

  // Ward 3
  { wardNumber: 3, serialNumber: 1, nameEn: "Govind", nameHi: "गोविंद", address: "Pahadi, Bahadurpur, Alwar", party: "Congress", partyAffiliation: "Indian National Congress", category: "OBC" },
  { wardNumber: 3, serialNumber: 2, nameEn: "Manohar Lal", nameHi: "मनोहर लाल", address: "Patti Pahadi, Ward No. 3, Bahadurpur, Alwar (Raj.) Pin - 301028", party: "BJP", partyAffiliation: "Bharatiya Janata Party", category: "OBC" },
  { wardNumber: 3, serialNumber: 3, nameEn: "Lalit Kishor", nameHi: "ललित किशोर", address: "Patti Pahadi, Ward No. 3, Bahadurpur, Alwar, Pin Code - 301028", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 3, serialNumber: 4, nameEn: "Vijay", nameHi: "विजय", address: "Bahadurpur Patti Meeran, Alwar, Rajasthan", party: "Others", partyAffiliation: "Independent", category: "OBC" },

  // Ward 4
  { wardNumber: 4, serialNumber: 1, nameEn: "Alka Kumari", nameHi: "अलका कुमारी", address: "Bahadurpur Patti Jodia, Bahadurpur, Alwar (Raj.)", party: "BJP", partyAffiliation: "Bharatiya Janata Party", category: "SC" },
  { wardNumber: 4, serialNumber: 2, nameEn: "Manoj", nameHi: "मनोज", address: "Bahadurpur Patti Jodia, Alwar, Raj. Pin - 301028", party: "Congress", partyAffiliation: "Indian National Congress", category: "SC" },
  { wardNumber: 4, serialNumber: 3, nameEn: "Priya Kumari", nameHi: "प्रिया कुमारी", address: "Bahadurpur, Near Ambedkar Circle", party: "Others", partyAffiliation: "Independent", category: "SC" },
  { wardNumber: 4, serialNumber: 4, nameEn: "Preeti Kumari", nameHi: "प्रीति कुमारी", address: "Near Ambedkar Circle, Bahadurpur", party: "Others", partyAffiliation: "Independent", category: "SC" },
  { wardNumber: 4, serialNumber: 5, nameEn: "Lalita", nameHi: "ललिता", address: "Bahadurpur Patti Pahadi, Alwar", party: "Others", partyAffiliation: "Independent", category: "SC" },

  // Ward 5
  { wardNumber: 5, serialNumber: 1, nameEn: "Rakesh Gurjar", nameHi: "राकेश गुर्जर", address: "Patti Jodia, Bahadurpur, District Alwar", party: "BJP", partyAffiliation: "Bharatiya Janata Party", category: "OBC" },
  { wardNumber: 5, serialNumber: 2, nameEn: "Rajesh Kumar", nameHi: "राजेश कुमार", address: "Municipality Bahadurpur, Ward No. 5, Pin Code - 301028", party: "Congress", partyAffiliation: "Indian National Congress", category: "OBC" },
  { wardNumber: 5, serialNumber: 3, nameEn: "Aabid Khan", nameHi: "आबिद खान", address: "Ward 5, Near Band Wali Kothi, Zakir Kakraliya Ka Bas, Bahadurpur", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 5, serialNumber: 4, nameEn: "Uday Prakash", nameHi: "उदय प्रकाश", address: "Near Bus Stand, Bahadurpur Patti Meeran, Municipality Bahadurpur (Alwar) Raj.", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 5, serialNumber: 5, nameEn: "Mahaveer Saini", nameHi: "महावीर सैनी", address: "Kodila Ki Pahadi, Bahadurpur Patti Jodia, Bahadurpur, Dist. Alwar", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 5, serialNumber: 6, nameEn: "Mausam Khan", nameHi: "मौसम खान", address: "Ward No. 05, Bahadurpur Patti Jodia, Municipality Bahadurpur, Dist. Alwar (Raj.) - 301028", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 5, serialNumber: 7, nameEn: "Raghuveer Saini", nameHi: "रघुवीर सैनी", address: "Patti Pahadi, Bahadurpur, Alwar (Rajasthan)", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 5, serialNumber: 8, nameEn: "Vinod Kumar", nameHi: "विनोद कुमार", address: "Near Hanuman Temple, Bahadurpur Patti Meeran, Bahadurpur, Dist. Alwar, Rajasthan", party: "Others", partyAffiliation: "Independent", category: "OBC" },

  // Ward 6
  { wardNumber: 6, serialNumber: 1, nameEn: "Mubeen Khan", nameHi: "मुबीन खान", address: "Ward No. 6, Mundiya Kheda, Bahadurpur, Alwar", party: "Congress", partyAffiliation: "Indian National Congress", category: "OBC" },
  { wardNumber: 6, serialNumber: 2, nameEn: "Shiv Lal", nameHi: "शिव लाल", address: "Mundiyakheda, Municipality Bahadurpur, Dist. Alwar (Raj.) - 301028", party: "BJP", partyAffiliation: "Bharatiya Janata Party", category: "OBC" },
  { wardNumber: 6, serialNumber: 3, nameEn: "Israil Khan", nameHi: "इसराइल खान", address: "Village Mundiya Kheda, Tehsil Alwar, Dist. Alwar (Rajasthan)", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 6, serialNumber: 4, nameEn: "Kamruddin", nameHi: "कमरुद्दीन", address: "Mundiyakheda, Post Chikani, Pin Code - 301028", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 6, serialNumber: 5, nameEn: "Jaswant Singh", nameHi: "जसवंत सिंह", address: "Ward No. 6, Mundiya Kheda, Bahadurpur, Alwar", party: "Others", partyAffiliation: "Independent", category: "SC" },
  { wardNumber: 6, serialNumber: 6, nameEn: "Neeraj Yadav", nameHi: "नीरज यादव", address: "Chikani", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 6, serialNumber: 7, nameEn: "Pushpendra Kumar", nameHi: "पुष्पेंद्र कुमार", address: "Ward No. 7, Mundiyakheda", party: "Others", partyAffiliation: "Independent", category: "OBC" },

  // Ward 7
  { wardNumber: 7, serialNumber: 1, nameEn: "Aarti", nameHi: "आरती", address: "Ward No. 7, Mundiyakheda, Bahadurpur", party: "Congress", partyAffiliation: "Indian National Congress", category: "SC" },
  { wardNumber: 7, serialNumber: 2, nameEn: "Ruby", nameHi: "रुबी", address: "Mundiyakheda, Municipality Bahadurpur, Alwar (Raj.) - 301028", party: "BJP", partyAffiliation: "Bharatiya Janata Party", category: "SC" },
  { wardNumber: 7, serialNumber: 3, nameEn: "Alka Bodh", nameHi: "अलका बौद्ध", address: "Ward 6, Mundiyakheda, Bahadurpur", party: "Others", partyAffiliation: "Independent", category: "SC" },
  { wardNumber: 7, serialNumber: 4, nameEn: "Chandra Kanta", nameHi: "चन्द्र कांता", address: "Ward No. 7, Village Mundiya Kheda, Post Chikani via Bahadurpur, Tehsil & Dist. Alwar (Raj.) Pin - 301028", party: "Others", partyAffiliation: "Independent", category: "SC" },

  // Ward 8
  { wardNumber: 8, serialNumber: 1, nameEn: "Shriram", nameHi: "श्रीराम", address: "Pilwa, Municipality Bahadurpur, Post Bhajeda, Dist. Alwar (Raj.) - 301028", party: "BJP", partyAffiliation: "Bharatiya Janata Party", category: "SC" },
  { wardNumber: 8, serialNumber: 2, nameEn: "Prahlad Jatav", nameHi: "प्रहलाद जाटव", address: "Pilwa, Municipality Bahadurpur, Post Bhajeda, Dist. Alwar (Raj.)", party: "Others", partyAffiliation: "Independent", category: "SC" },
  { wardNumber: 8, serialNumber: 3, nameEn: "Puran Mal Jatav", nameHi: "पूरन मल जाटव", address: "Village Pilwa, Post Bhajeda, Dist. & Tehsil Alwar (Raj.) Pin - 301028", party: "Others", partyAffiliation: "Independent", category: "SC" },
  { wardNumber: 8, serialNumber: 4, nameEn: "Himanshu", nameHi: "हिमांशु", address: "Village Pilwa, Post Bhajeda, Dist. & Tehsil Alwar (Raj.) Pin - 301028", party: "Others", partyAffiliation: "Independent", category: "SC" },

  // Ward 9
  { wardNumber: 9, serialNumber: 1, nameEn: "Azruddin", nameHi: "अजरुद्दीन", address: "Village Pilwa, Post Bhajeda, Dist. & Tehsil Alwar (Raj.) Pin - 301028", party: "BJP", partyAffiliation: "Bharatiya Janata Party", category: "OBC" },
  { wardNumber: 9, serialNumber: 2, nameEn: "Shakeel Khan", nameHi: "शकील खान", address: "Pilwa Ward No. 9, Municipality Bahadurpur, Alwar (Raj.)", party: "Congress", partyAffiliation: "Indian National Congress", category: "OBC" },

  // Ward 10
  { wardNumber: 10, serialNumber: 1, nameEn: "Bane Singh Gurjar", nameHi: "बने सिंह गुर्जर", address: "Village & Post Bhajeda, Dist. Alwar", party: "BJP", partyAffiliation: "Bharatiya Janata Party", category: "OBC" },
  { wardNumber: 10, serialNumber: 2, nameEn: "Harhet Kumar", nameHi: "हरहेत कुमार", address: "Village Bhajeda, Tehsil + Dist. Alwar (Raj.)", party: "Congress", partyAffiliation: "Indian National Congress", category: "OBC" },
  { wardNumber: 10, serialNumber: 3, nameEn: "Kapil Kumar", nameHi: "कपिल कुमार", address: "Village Bhajeda, Tehsil & Dist. Alwar (Raj.)", party: "Others", partyAffiliation: "Independent", category: "SC" },
  { wardNumber: 10, serialNumber: 4, nameEn: "Dhara Singh Gurjar", nameHi: "धारा सिंह गुर्जर", address: "Village & Post Bhajeda via Bahadurpur, Tehsil & Dist. Alwar, Pin - 301028", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 10, serialNumber: 5, nameEn: "Rajendra Prasad", nameHi: "राजेन्द्र प्रसाद", address: "Bhajeda, Dist. Alwar (Raj.)", party: "Others", partyAffiliation: "Independent", category: "General" },
  { wardNumber: 10, serialNumber: 6, nameEn: "Sikandar Ali", nameHi: "सिकंदर अली", address: "Village Bhajeda, Tehsil + Dist. Alwar - 301028", party: "Others", partyAffiliation: "Independent", category: "OBC" },

  // Ward 11
  { wardNumber: 11, serialNumber: 1, nameEn: "Ajjo Bai", nameHi: "अज्जो बाई", address: "Village Bhajeda, Tehsil Alwar, Dist. Alwar (Rajasthan)", party: "BJP", partyAffiliation: "Bharatiya Janata Party", category: "OBC" },
  { wardNumber: 11, serialNumber: 2, nameEn: "Rajesh Kumari", nameHi: "राजेश कुमारी", address: "Village Bhajeda, Tehsil + Dist. Alwar", party: "Congress", partyAffiliation: "Indian National Congress", category: "OBC" },
  { wardNumber: 11, serialNumber: 3, nameEn: "Kamlesh", nameHi: "कमलेश", address: "Bhajeda Ward No. 11, Municipality Bahadurpur", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 11, serialNumber: 4, nameEn: "Kumusha Bai", nameHi: "कमुषा बाई", address: "Ward No. 11, Rajput Bas, Bhajeda, Municipality Bahadurpur, Alwar (Raj.) - 301028", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 11, serialNumber: 5, nameEn: "Resham Devi", nameHi: "रेशम देवी", address: "Village & Post Bhajeda via Bahadurpur, Tehsil & Dist. Alwar, Pin - 301028", party: "Others", partyAffiliation: "Independent", category: "OBC" },

  // Ward 12
  { wardNumber: 12, serialNumber: 1, nameEn: "Dalchand", nameHi: "दलचंद", address: "Bhajeda Ward No. 10, Municipality Bahadurpur", party: "Congress", partyAffiliation: "Indian National Congress", category: "SC" },
  { wardNumber: 12, serialNumber: 2, nameEn: "Rattiram", nameHi: "रतिराम", address: "Bhajeda Ka Bas, Bhajeda, Alwar (Raj.) Pin No. 301028", party: "BJP", partyAffiliation: "Bharatiya Janata Party", category: "SC" },
  { wardNumber: 12, serialNumber: 3, nameEn: "Kalu Ram", nameHi: "कालू राम", address: "Bhajeda, Tehsil Alwar, Dist. Alwar", party: "Others", partyAffiliation: "Independent", category: "SC" },
  { wardNumber: 12, serialNumber: 4, nameEn: "Nandram", nameHi: "नंदराम", address: "Village Post Bhajeda, Bahadurpur, Alwar", party: "Others", partyAffiliation: "Independent", category: "SC" },
  { wardNumber: 12, serialNumber: 5, nameEn: "Ramawtar alias Ram Avtar", nameHi: "रामावतार उर्फ राम अवतार", address: "Ward 12, Bhajeda, Bahadurpur", party: "Others", partyAffiliation: "Independent", category: "SC" },

  // Ward 13
  { wardNumber: 13, serialNumber: 1, nameEn: "Ekta Kumari", nameHi: "एकता कुमारी", address: "Village Ranikheda, Post Bhajeda, Tehsil Alwar & Dist. Alwar, Pin - 301028", party: "BJP", partyAffiliation: "Bharatiya Janata Party", category: "OBC" },
  { wardNumber: 13, serialNumber: 2, nameEn: "Sarmeena Khatoon", nameHi: "सरमीना खातून", address: "Village Post Bhajeda, Dist. & Tehsil Alwar, Raj. Pin - 301028", party: "Congress", partyAffiliation: "Indian National Congress", category: "OBC" },
  { wardNumber: 13, serialNumber: 3, nameEn: "Apsana", nameHi: "अपसाना", address: "Ward No. 13, Ranikheda, Alwar", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 13, serialNumber: 4, nameEn: "Jilsana", nameHi: "जिलसाना", address: "Ward No. 13, Ranikheda, Bahadurpur", party: "Others", partyAffiliation: "Independent", category: "OBC" },

  // Ward 14
  { wardNumber: 14, serialNumber: 1, nameEn: "Mukesh Kumar", nameHi: "मुकेश कुमार", address: "Village Sotka, Post Bhajeda, Dist. Alwar, Tehsil Alwar (Raj.)", party: "BJP", partyAffiliation: "Bharatiya Janata Party", category: "OBC" },
  { wardNumber: 14, serialNumber: 2, nameEn: "Indraraj Gurjar", nameHi: "इंद्रराज गुर्जर", address: "Village Sotka, Tehsil & Dist. Alwar", party: "Others", partyAffiliation: "Independent", category: "OBC" },

  // Ward 15
  { wardNumber: 15, serialNumber: 1, nameEn: "Shahrukh Khan", nameHi: "शाहरुख खान", address: "Ward No. 19, Bahadurpur Patti Meeran, Alwar, Rajasthan - 301028", party: "Congress", partyAffiliation: "Indian National Congress", category: "OBC" },
  { wardNumber: 15, serialNumber: 2, nameEn: "Amar Mohammad", nameHi: "अमर मोहम्मद", address: "Hasmat Ka Bas, Patti Meeran, Bahadurpur", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 15, serialNumber: 3, nameEn: "Shabbir Ahmed", nameHi: "शब्बीर अहमद", address: "Ward 15, Bahadurpur Patti Meeran", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 15, serialNumber: 4, nameEn: "Harchand Gurjar", nameHi: "हरचंद गुर्जर", address: "Gyasi Ka Bas, Patti Meeran, Bahadurpur, Alwar, Raj.", party: "Others", partyAffiliation: "Independent", category: "OBC" },

  // Ward 16
  { wardNumber: 16, serialNumber: 1, nameEn: "Balwant Singh Yadav", nameHi: "बलवंत सिंह यादव", address: "Patti Pahadi, Bahadurpur", party: "BJP", partyAffiliation: "Bharatiya Janata Party", category: "OBC" },
  { wardNumber: 16, serialNumber: 2, nameEn: "Lokesh Sharma", nameHi: "लोकेश शर्मा", address: "Ward No. 16, Bahadurpur Patti Meeran, Alwar Raj. - 301028", party: "Congress", partyAffiliation: "Indian National Congress", category: "General" },
  { wardNumber: 16, serialNumber: 3, nameEn: "Inder Kumar", nameHi: "इंदर कुमार", address: "V.P.O. Bahadurpur (Dist. Alwar) - 301028", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 16, serialNumber: 4, nameEn: "Ganesh Chand", nameHi: "गणेश चंद", address: "Near Thakurji Temple, Bahadurpur Patti Meeran, Bahadurpur (Alwar)", party: "Others", partyAffiliation: "Independent", category: "OBC" },

  // Ward 17
  { wardNumber: 17, serialNumber: 1, nameEn: "Ajay Kumar Koli", nameHi: "अजय कुमार कोली", address: "Bahadurpur Patti Meeran, Alwar, Rajasthan", party: "BJP", partyAffiliation: "Bharatiya Janata Party", category: "SC" },
  { wardNumber: 17, serialNumber: 2, nameEn: "Labh Chand Koli", nameHi: "लाभ चंद कोली", address: "Ward No. 17, Kabeela Mohalla, Bahadurpur, Alwar", party: "Congress", partyAffiliation: "Indian National Congress", category: "SC" },
  { wardNumber: 17, serialNumber: 3, nameEn: "Bhajan Lal", nameHi: "भजन लाल", address: "Kumharon Ka Mohalla, Bahadurpur, Alwar, Rajasthan", party: "Others", partyAffiliation: "Independent", category: "SC" },
  { wardNumber: 17, serialNumber: 4, nameEn: "Manish Alok", nameHi: "मनीष आलोक", address: "Bus Stand Main Market, Bahadurpur Patti Meeran, Alwar (Raj.)", party: "Others", partyAffiliation: "Independent", category: "SC" },
  { wardNumber: 17, serialNumber: 5, nameEn: "Mahesh Kumar", nameHi: "महेश कुमार", address: "Ward 17, Bahadurpur Patti Meeran", party: "Others", partyAffiliation: "Independent", category: "SC" },
  { wardNumber: 17, serialNumber: 6, nameEn: "Mahesh Chand", nameHi: "महेश चंद", address: "Bahadurpur Patti Meeran, Alwar Raj.", party: "Others", partyAffiliation: "Independent", category: "SC" },
  { wardNumber: 17, serialNumber: 7, nameEn: "Lalit", nameHi: "ललित", address: "Ward 17, Kabeela Mohalla, Bahadurpur", party: "Others", partyAffiliation: "Independent", category: "SC" },

  // Ward 18
  { wardNumber: 18, serialNumber: 1, nameEn: "Tara Chand Khati", nameHi: "तारा चंद खाती", address: "Mandi Diwada Mohalla, Bahadurpur Patti Meeran, Dist. Alwar (Raj.)", party: "BJP", partyAffiliation: "Bharatiya Janata Party", category: "OBC" },
  { wardNumber: 18, serialNumber: 2, nameEn: "Balbir Prasad", nameHi: "बलवीर प्रसाद", address: "Ward No. 18, Mohalla Mandi Diwada, Bahadurpur, Alwar - 301028", party: "Congress", partyAffiliation: "Indian National Congress", category: "OBC" },
  { wardNumber: 18, serialNumber: 3, nameEn: "Aaseen Khan", nameHi: "आसीन खान", address: "Ward No. 18, Mohalla Mandi Diwada, Bahadurpur", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 18, serialNumber: 4, nameEn: "Girraj Prasad Saini", nameHi: "गिरराज प्रसाद सैनी", address: "Near Shambhu Ki Chakki, Bahadurpur Patti Meeran (Alwar) Raj.", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 18, serialNumber: 5, nameEn: "Jitendra Kumar", nameHi: "जितेंद्र कुमार", address: "Bahadurpur Patti Meeran, Alwar", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 18, serialNumber: 6, nameEn: "Bhajan Lal", nameHi: "भजन लाल", address: "Ward No. 18, Municipality Bahadurpur, Mohalla Mandi Diwada, Near Shiv Temple, Bahadurpur, Dist. Alwar", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 18, serialNumber: 7, nameEn: "Mahesh Chand", nameHi: "महेश चंद", address: "Mandi Diwada Mohalla, Bahadurpur Patti Meeran, Bahadurpur, Dist. Alwar", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 18, serialNumber: 8, nameEn: "Hakim Deen", nameHi: "हाकिम दीन", address: "Ward No. 18, Mohalla Mandi Diwada, Bahadurpur", party: "Others", partyAffiliation: "Independent", category: "OBC" },

  // Ward 19
  { wardNumber: 19, serialNumber: 1, nameEn: "Umesh Kumar", nameHi: "उमेश कुमार", address: "Near Fort (Kila), Bahadurpur Patti Meeran, Alwar (Raj.) Pin - 301028", party: "BJP", partyAffiliation: "Bharatiya Janata Party", category: "OBC" },
  { wardNumber: 19, serialNumber: 2, nameEn: "Kamal Saini", nameHi: "कमल सैनी", address: "Ward 19, Near Bade Mandir, Bahadurpur", party: "Congress", partyAffiliation: "Indian National Congress", category: "OBC" },
  { wardNumber: 19, serialNumber: 3, nameEn: "Vinod", nameHi: "विनोद", address: "Ward 19, Khatik Wadi Mohalla, Bahadurpur", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 19, serialNumber: 4, nameEn: "Sachin Kumar", nameHi: "सचिन कुमार", address: "Bahadurpur Patti Meeran", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 19, serialNumber: 5, nameEn: "Suresh Chand", nameHi: "सुरेश चंद", address: "Ward No. 19, Sunar Badi Mohalla, Bahadurpur", party: "Others", partyAffiliation: "Independent", category: "OBC" },

  // Ward 20
  { wardNumber: 20, serialNumber: 1, nameEn: "Pooja Sharma", nameHi: "पूजा शर्मा", address: "Bahadurpur Patti Meeran, Bahadurpur, Dist. Alwar (Raj.) - 301028", party: "BJP", partyAffiliation: "Bharatiya Janata Party", category: "General" },
  { wardNumber: 20, serialNumber: 2, nameEn: "Bismillah", nameHi: "बिस्मिल्ला", address: "Ward No. 20, Khanzadwadi, Bahadurpur, Alwar", party: "Congress", partyAffiliation: "Indian National Congress", category: "OBC" },
  { wardNumber: 20, serialNumber: 3, nameEn: "Anjum", nameHi: "अंजुम", address: "Khanzadwadi Mohalla, Bahadurpur Patti Meeran, Alwar", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 20, serialNumber: 4, nameEn: "Dolly Jangid", nameHi: "डॉली जांगिड़", address: "Bahadurpur Patti Meeran, Bahadurpur, Alwar (Raj.)", party: "Others", partyAffiliation: "Independent", category: "OBC" },

  // Ward 21
  { wardNumber: 21, serialNumber: 1, nameEn: "Jyoti Rajput", nameHi: "ज्योति राजपूत", address: "Thakur Wadi Mohalla, Patti Meeran, Bahadurpur, Alwar (Raj.)", party: "BJP", partyAffiliation: "Bharatiya Janata Party", category: "General" },
  { wardNumber: 21, serialNumber: 2, nameEn: "Beena", nameHi: "बीना", address: "Ward No. 17, Bahadurpur Patti Meeran, Dist. Alwar (Raj.) - 301028", party: "Congress", partyAffiliation: "Indian National Congress", category: "General" },
  { wardNumber: 21, serialNumber: 3, nameEn: "Anju Sachdeva", nameHi: "अंजू सचदेवा", address: "Koliwada Mohalla, Bahadurpur Patti Meeran, Dist. Alwar, Rajasthan - 301028", party: "Others", partyAffiliation: "Independent", category: "General" },
  { wardNumber: 21, serialNumber: 4, nameEn: "Kalpana Goyal", nameHi: "कल्पना गोयल", address: "Municipality Bahadurpur, Dist. Alwar (Raj.)", party: "Others", partyAffiliation: "Independent", category: "General" },
  { wardNumber: 21, serialNumber: 5, nameEn: "Dayawanti", nameHi: "दयावंती", address: "Koliyon Ka Mohalla, Bahadurpur Patti Meeran, Alwar, Rajasthan - 301028", party: "Others", partyAffiliation: "Independent", category: "General" },
  { wardNumber: 21, serialNumber: 6, nameEn: "Pinki", nameHi: "पिंकी", address: "Ward No. 21, Bahadurpur Patti Meeran, Alwar (Raj.)", party: "Others", partyAffiliation: "Independent", category: "OBC" },

  // Ward 22
  { wardNumber: 22, serialNumber: 1, nameEn: "Vikas Sahu", nameHi: "विकास साहू", address: "Mandi Diwada Mohalla, Bahadurpur Patti Meeran, Alwar (Raj.)", party: "BJP", partyAffiliation: "Bharatiya Janata Party", category: "OBC" },
  { wardNumber: 22, serialNumber: 2, nameEn: "Satish Kumar", nameHi: "सतीश कुमार", address: "Ward No. 22, Mohalla Mandi Diwada, Bahadurpur, Alwar", party: "Congress", partyAffiliation: "Indian National Congress", category: "OBC" },
  { wardNumber: 22, serialNumber: 3, nameEn: "Ayub Khan", nameHi: "अय्यूब खान", address: "Ward No. 22, Mandi Diwada, Bahadurpur", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 22, serialNumber: 4, nameEn: "Kavisha", nameHi: "कविशा", address: "Ward No. 21, Bahadurpur (Alwar)", party: "Others", partyAffiliation: "Independent", category: "General" },
  { wardNumber: 22, serialNumber: 5, nameEn: "Gaurav Jain", nameHi: "गौरव जैन", address: "Mohalla Mandi Diwada, Bahadurpur Patti Meeran, Bahadurpur, Alwar (Raj.)", party: "Others", partyAffiliation: "Independent", category: "General" },
  { wardNumber: 22, serialNumber: 6, nameEn: "Prakash Chand Sahu", nameHi: "प्रकाश चंद साहू", address: "In front of Sub-Tehsil, Bahadurpur Patti Meeran, Alwar (Rajasthan) Pin - 301028, Ward No. 16", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 22, serialNumber: 7, nameEn: "Manish Kumar", nameHi: "मनीष कुमार", address: "Mandi Diwada Mohalla, Bahadurpur Patti Meeran, Alwar, Bahadurpur", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 22, serialNumber: 8, nameEn: "Himanshu Kumar", nameHi: "हिमांशु कुमार", address: "Behind Police Chowki, Bahadurpur Patti Meeran, Bahadurpur, Alwar (Raj.)", party: "Others", partyAffiliation: "Independent", category: "General" },

  // Ward 23
  { wardNumber: 23, serialNumber: 1, nameEn: "Meena", nameHi: "मीना", address: "Bahadurpur, Dist. Alwar", party: "BJP", partyAffiliation: "Bharatiya Janata Party", category: "OBC" },
  { wardNumber: 23, serialNumber: 2, nameEn: "Waseema Bano", nameHi: "वसीमा बानो", address: "Teela Oopar, Patti Katla, Bahadurpur, Tehsil Alwar (Raj.)", party: "Congress", partyAffiliation: "Indian National Congress", category: "OBC" },
  { wardNumber: 23, serialNumber: 3, nameEn: "Anisha", nameHi: "अनीषा", address: "Ward No. 23, Bahadurpur Patti Meeran, Alwar, Rajasthan - 301028", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 23, serialNumber: 4, nameEn: "Kalsum", nameHi: "कलसूम", address: "Ward No. 23, Patti Katla, Bahadurpur", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 23, serialNumber: 5, nameEn: "Hanseera", nameHi: "हंसीरा", address: "Ward 23, Mandi Diwada, Bahadurpur, Alwar", party: "Others", partyAffiliation: "Independent", category: "OBC" },

  // Ward 24
  { wardNumber: 24, serialNumber: 1, nameEn: "Ajeet Singh", nameHi: "अजीत सिंह", address: "Ward No. 24, Soniya Ka Bas, Bahadurpur, Alwar, Pin Code - 301028", party: "Congress", partyAffiliation: "Indian National Congress", category: "OBC" },
  { wardNumber: 24, serialNumber: 2, nameEn: "Ram Singh", nameHi: "राम सिंह", address: "Teela Oopar, Patti Katla, Bahadurpur, Tehsil & Dist. Alwar", party: "BJP", partyAffiliation: "Bharatiya Janata Party", category: "OBC" },
  { wardNumber: 24, serialNumber: 3, nameEn: "Dhara Singh", nameHi: "धारा सिंह", address: "Hurmat Ka Bas, Bahadurpur Patti Katla, Alwar (Raj.)", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 24, serialNumber: 4, nameEn: "Parvez", nameHi: "परवेज़", address: "Bahadurpur Patti Katla, Alwar, Raj.", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 24, serialNumber: 5, nameEn: "Shiv Kumar Soni", nameHi: "शिव कुमार सोनी", address: "Thakur Wadi Patti Meeran, Bahadurpur, Tehsil Alwar, Dist. Alwar", party: "Others", partyAffiliation: "Independent", category: "OBC" },

  // Ward 25
  { wardNumber: 25, serialNumber: 1, nameEn: "Naseem Khan", nameHi: "नसीम खान", address: "Ward 25, Naharpur Kala, Bahadurpur", party: "Congress", partyAffiliation: "Indian National Congress", category: "OBC" },
  { wardNumber: 25, serialNumber: 2, nameEn: "Ramesh Chand", nameHi: "रमेश चंद", address: "Naharpur Kala, Bahadurpur Patti Jodia, Bahadurpur", party: "BJP", partyAffiliation: "Bharatiya Janata Party", category: "OBC" },
  { wardNumber: 25, serialNumber: 3, nameEn: "Taufiq Ahmed", nameHi: "तौफीक अहमद", address: "Patti Jodia, Bahadurpur, Alwar, Raj.", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 25, serialNumber: 4, nameEn: "Mohammad Shahid", nameHi: "मोहम्मद शाहिद", address: "Naharpur Kala, Post Bahadurpur, Dist. Alwar, Pin Code - 301028", party: "Others", partyAffiliation: "Independent", category: "OBC" },
  { wardNumber: 25, serialNumber: 5, nameEn: "Sunil Kumar", nameHi: "सुनील कुमार", address: "Ward No. 25, Naharpur Kala, Bahadurpur, Alwar", party: "Others", partyAffiliation: "Independent", category: "OBC" },
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
