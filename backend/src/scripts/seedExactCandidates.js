const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const connectDB = require("../config/db");
const Candidate = require("../models/Candidate");

const rawData = [
  // Ward 1
  { wardNumber: 1, serialNumber: 1, nameHi: "बेनजीर खानम", nameEn: "Benazir Khanam", addressHi: "कजाकपुर, त. ग्राम अलवर राजस्थान 301028", addressEn: "Kazakpur, Tehsil Alwar, Village Alwar, Rajasthan - 301028", partyHi: "इण्डियन नेशनल कांग्रेस", partyEn: "Indian National Congress", party: "Congress", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 1, serialNumber: 2, nameHi: "महरूना", nameEn: "Mahroona", addressHi: "कजाकपूर, बहादरपुर पट्टी जोडिया, बहादुरपुर, अलवर, राजस्थान", addressEn: "Kazakpur, Bahadurpur Patti Jodia, Bahadurpur, Alwar, Rajasthan", partyHi: "भारतीय जनता पार्टी", partyEn: "Bharatiya Janata Party", party: "BJP", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 1, serialNumber: 3, nameHi: "नफीसा", nameEn: "Nafisa", addressHi: "वार्ड नं. 1 कजाकपुर बहादुरपुर", addressEn: "Ward No. 1, Kazakpur, Bahadurpur", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 1, serialNumber: 4, nameHi: "मैमन", nameEn: "Maiman", addressHi: "वार्ड सं - 01, भूरे खाँ का बास जोडिया पट्टी, अलवर राजस्थान 301028", addressEn: "Ward No. 01, Bhure Khan Ka Bas, Jodia Patti, Alwar, Rajasthan - 301028", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },

  // Ward 2
  { wardNumber: 2, serialNumber: 1, nameHi: "सहरूना", nameEn: "Sahroona", addressHi: "पट्टी जोडिया वार्ड नं. 2 नगरपालिका बहादुरपुर, अलवर (राज.) 301028", addressEn: "Patti Jodia, Ward No. 2, Municipality Bahadurpur, Alwar (Raj.) - 301028", partyHi: "इण्डियन नेशनल कांग्रेस", partyEn: "Indian National Congress", party: "Congress", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 2, serialNumber: 2, nameHi: "अरस्तुन", nameEn: "Arastun", addressHi: "वार्ड नं. 2 जोडिया बास, बहादुरपुर अलवर", addressEn: "Ward No. 2, Jodia Bas, Bahadurpur, Alwar", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 2, serialNumber: 3, nameHi: "अरसीदा", nameEn: "Arseeda", addressHi: "पट्टी जोडिया वार्ड नं. 2 नगरपालिका बहादुरपुर अलवर (राज.) पिन नं. 301028", addressEn: "Patti Jodia, Ward No. 2, Municipality Bahadurpur, Alwar (Raj.) Pin - 301028", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },

  // Ward 3
  { wardNumber: 3, serialNumber: 1, nameHi: "गोविन्द", nameEn: "Govind", addressHi: "पहाड़ी बहादुरपुर अलवर", addressEn: "Pahadi, Bahadurpur, Alwar", partyHi: "इण्डियन नेशनल कांग्रेस", partyEn: "Indian National Congress", party: "Congress", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 3, serialNumber: 2, nameHi: "मनोहर लाल", nameEn: "Manohar Lal", addressHi: "पट्टी पहाड़ी वार्ड नं. 3 बहादुरपुर अलवर (राज.) पिन कोड़ 301028", addressEn: "Patti Pahadi, Ward No. 3, Bahadurpur, Alwar (Raj.) Pin - 301028", partyHi: "भारतीय जनता पार्टी", partyEn: "Bharatiya Janata Party", party: "BJP", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 3, serialNumber: 3, nameHi: "ललित किशोर", nameEn: "Lalit Kishor", addressHi: "पट्टी पहाड़ी वार्ड नं. 3 बहादुरपुर अलवर पिन कोड - 301028", addressEn: "Patti Pahadi, Ward No. 3, Bahadurpur, Alwar, Pin Code - 301028", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 3, serialNumber: 4, nameHi: "विजय", nameEn: "Vijay", addressHi: "बहादुरपुर पेंटी मीरान अलवर राजस्थान", addressEn: "Bahadurpur Patti Meeran, Alwar, Rajasthan", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },

  // Ward 4
  { wardNumber: 4, serialNumber: 1, nameHi: "अलका कुमारी", nameEn: "Alka Kumari", addressHi: "बहादुरपुर पट्टी जोडिया, बहादुरपुर अलवर (राज.)", addressEn: "Bahadurpur Patti Jodia, Bahadurpur, Alwar (Raj.)", partyHi: "भारतीय जनता पार्टी", partyEn: "Bharatiya Janata Party", party: "BJP", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },
  { wardNumber: 4, serialNumber: 2, nameHi: "मनोज", nameEn: "Manoj", addressHi: "बहादुरपुर पट्टी जोड़िया अलवर राज. पिन 301028", addressEn: "Bahadurpur Patti Jodia, Alwar, Raj. Pin - 301028", partyHi: "इण्डियन नेशनल कांग्रेस", partyEn: "Indian National Congress", party: "Congress", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },
  { wardNumber: 4, serialNumber: 3, nameHi: "प्रिया कुमारी", nameEn: "Priya Kumari", addressHi: "बहादुरपुर, अम्बेड़कर सर्किल के पास", addressEn: "Bahadurpur, Near Ambedkar Circle", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },
  { wardNumber: 4, serialNumber: 4, nameHi: "प्रीति कुमारी", nameEn: "Preeti Kumari", addressHi: "अम्बेडकर सर्किल के पास बहादुरपुर", addressEn: "Near Ambedkar Circle, Bahadurpur", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },
  { wardNumber: 4, serialNumber: 5, nameHi: "ललिता", nameEn: "Lalita", addressHi: "बहादुरपुर पट्टी पहाड़ी अलवर", addressEn: "Bahadurpur Patti Pahadi, Alwar", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },

  // Ward 5
  { wardNumber: 5, serialNumber: 1, nameHi: "राकेश गुर्जर", nameEn: "Rakesh Gurjar", addressHi: "पट्टी जोडिया बहादुरपुर जिला अलवर", addressEn: "Patti Jodia, Bahadurpur, District Alwar", partyHi: "भारतीय जनता पार्टी", partyEn: "Bharatiya Janata Party", party: "BJP", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 5, serialNumber: 2, nameHi: "राजेश कुमार", nameEn: "Rajesh Kumar", addressHi: "नगरपालिका बहादुरपुर वार्ड नम्बर -5 पिन कोड़ 301028", addressEn: "Municipality Bahadurpur, Ward No. 5, Pin Code - 301028", partyHi: "इण्डियन नेशनल कांग्रेस", partyEn: "Indian National Congress", party: "Congress", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 5, serialNumber: 3, nameHi: "आबिद खाँन", nameEn: "Aabid Khan", addressHi: "वार्ड 5 बन्द वाली कोठी के पास जाकिर ककरालिया का बास बहादुरपुर", addressEn: "Ward 5, Near Band Wali Kothi, Zakir Kakraliya Ka Bas, Bahadurpur", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 5, serialNumber: 4, nameHi: "उदय प्रकाश", nameEn: "Uday Prakash", addressHi: "बस स्टेण्ड के पास बहादुरपुर पट्टी मीरान, नगरपालिका बहादुरपुर (अलवर) राज.", addressEn: "Near Bus Stand, Bahadurpur Patti Meeran, Municipality Bahadurpur (Alwar) Raj.", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 5, serialNumber: 5, nameHi: "महावीर सैनी", nameEn: "Mahaveer Saini", addressHi: "कोडिला की पहाड़ी बहादुरपुर पट्टी जोड़िया बहादुरपुर जिला अलवर", addressEn: "Kodila Ki Pahadi, Bahadurpur Patti Jodia, Bahadurpur, Dist. Alwar", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 5, serialNumber: 6, nameHi: "मौसम खाँन", nameEn: "Mausam Khan", addressHi: "वार्ड नं. 05 बहादुरपुर पट्टी जोडिया नगरपालिका बहादुरपुर जिला अलवर (राज.) 301028", addressEn: "Ward No. 05, Bahadurpur Patti Jodia, Municipality Bahadurpur, Dist. Alwar (Raj.) - 301028", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 5, serialNumber: 7, nameHi: "रघुवीर सैनी", nameEn: "Raghuveer Saini", addressHi: "पट्टी पहाड़ी बहादुरपुर अलवर (राजस्थान)", addressEn: "Patti Pahadi, Bahadurpur, Alwar (Rajasthan)", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 5, serialNumber: 8, nameHi: "विनोद कुमार", nameEn: "Vinod Kumar", addressHi: "हनुमान मंदिर के पास बहादुरपुर पट्टी मीरान बहादुरपुर जिला अलवर राजस्थान", addressEn: "Near Hanuman Temple, Bahadurpur Patti Meeran, Bahadurpur, Dist. Alwar, Rajasthan", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },

  // Ward 6
  { wardNumber: 6, serialNumber: 1, nameHi: "मुबीन खाँ", nameEn: "Mubeen Khan", addressHi: "वार्ड नं. 6 मुण्डिया खेड़ा बहादुरपुर अलवर", addressEn: "Ward No. 6, Mundiya Kheda, Bahadurpur, Alwar", partyHi: "इण्डियन नेशनल कांग्रेस", partyEn: "Indian National Congress", party: "Congress", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 6, serialNumber: 2, nameHi: "शिव लाल", nameEn: "Shiv Lal", addressHi: "मुण्डियाखेड़ा नगरपालिका बहादुरपुर जिला अलवर (राज.) 301028", addressEn: "Mundiyakheda, Municipality Bahadurpur, Dist. Alwar (Raj.) - 301028", partyHi: "भारतीय जनता पार्टी", partyEn: "Bharatiya Janata Party", party: "BJP", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 6, serialNumber: 3, nameHi: "ईसराइल खाँन", nameEn: "Israil Khan", addressHi: "ग्राम - मुण्डिया खेड़ा त. अलवर जिला - अलवर (राजस्थान)", addressEn: "Village Mundiya Kheda, Tehsil Alwar, Dist. Alwar (Rajasthan)", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 6, serialNumber: 4, nameHi: "कमरूदीन", nameEn: "Kamruddin", addressHi: "मुण्डियाखेड़ा पो.आ. ग्राम चिकानी पिन कोड 301028", addressEn: "Mundiyakheda, Post Chikani, Pin Code - 301028", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 6, serialNumber: 5, nameHi: "जसवन्त सिंह", nameEn: "Jaswant Singh", addressHi: "वार्ड नं. 6 मुण्डिया खेड़ा बहादुरपुर अलवर", addressEn: "Ward No. 6, Mundiya Kheda, Bahadurpur, Alwar", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },
  { wardNumber: 6, serialNumber: 6, nameHi: "नीरज यादव", nameEn: "Neeraj Yadav", addressHi: "चिकानी", addressEn: "Chikani", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 6, serialNumber: 7, nameHi: "पुष्पेन्द्र कुमार", nameEn: "Pushpendra Kumar", addressHi: "वार्ड नं. 7 मुण्डियाखेड़ा", addressEn: "Ward No. 7, Mundiyakheda", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },

  // Ward 7
  { wardNumber: 7, serialNumber: 1, nameHi: "आरती", nameEn: "Aarti", addressHi: "वार्ड नं. 7 मुण्डियाखेड़ा बहादुरपुर", addressEn: "Ward No. 7, Mundiyakheda, Bahadurpur", partyHi: "इण्डियन नेशनल कांग्रेस", partyEn: "Indian National Congress", party: "Congress", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },
  { wardNumber: 7, serialNumber: 2, nameHi: "रूबी", nameEn: "Ruby", addressHi: "मुण्डियाखेड़ा नगरपालिका बहादुरपुर अलवर (राज.) 301028", addressEn: "Mundiyakheda, Municipality Bahadurpur, Alwar (Raj.) - 301028", partyHi: "भारतीय जनता पार्टी", partyEn: "Bharatiya Janata Party", party: "BJP", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },
  { wardNumber: 7, serialNumber: 3, nameHi: "अलका बोध", nameEn: "Alka Bodh", addressHi: "वार्ड 6 मुण्डियाखेडा बहादुरपुर", addressEn: "Ward 6, Mundiyakheda, Bahadurpur", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },
  { wardNumber: 7, serialNumber: 4, nameHi: "चन्द्र कान्ता", nameEn: "Chandra Kanta", addressHi: "वार्ड नं. 7 ग्राम मुण्डिया खेड़ा पोस्ट. चिकानी वाया बहादुरपुर तह. व जिला अलवर (राज.) पिन कोड 301028", addressEn: "Ward No. 7, Village Mundiya Kheda, Post Chikani via Bahadurpur, Tehsil & Dist. Alwar (Raj.) Pin - 301028", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },

  // Ward 8
  { wardNumber: 8, serialNumber: 1, nameHi: "श्रीराम", nameEn: "Shriram", addressHi: "पीलवा नगरपालिका बहादुरपुर पोस्ट - भजेड़ा जिला अलवर (राज.) 301028", addressEn: "Pilwa, Municipality Bahadurpur, Post Bhajeda, Dist. Alwar (Raj.) - 301028", partyHi: "भारतीय जनता पार्टी", partyEn: "Bharatiya Janata Party", party: "BJP", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },
  { wardNumber: 8, serialNumber: 2, nameHi: "प्रहलाद जाटव", nameEn: "Prahlad Jatav", addressHi: "पीलवा नगरपालिका बहादुरपुर पो. - भजेड़ा जिला अलवर (राज.)", addressEn: "Pilwa, Municipality Bahadurpur, Post Bhajeda, Dist. Alwar (Raj.)", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },
  { wardNumber: 8, serialNumber: 3, nameHi: "पूरण मल जाटव", nameEn: "Puran Mal Jatav", addressHi: "ग्राम पीलवा, पो. भजेड़ा, जिला व तह. अलवर (राज.) पिन कोड 301028", addressEn: "Village Pilwa, Post Bhajeda, Dist. & Tehsil Alwar (Raj.) Pin - 301028", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },
  { wardNumber: 8, serialNumber: 4, nameHi: "हिमांशु", nameEn: "Himanshu", addressHi: "ग्राम पीलवा, पो. भजेड़ा, जिला व तह. अलवर (राज.) पिन कोड 301028", addressEn: "Village Pilwa, Post Bhajeda, Dist. & Tehsil Alwar (Raj.) Pin - 301028", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },

  // Ward 9
  { wardNumber: 9, serialNumber: 1, nameHi: "अजरूदीन", nameEn: "Azruddin", addressHi: "ग्राम पीलवा, पो. भजेड़ा, जिला व तह. अलवर (राज.) पिन कोड 301028", addressEn: "Village Pilwa, Post Bhajeda, Dist. & Tehsil Alwar (Raj.) Pin - 301028", partyHi: "भारतीय जनता पार्टी", partyEn: "Bharatiya Janata Party", party: "BJP", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 9, serialNumber: 2, nameHi: "शकील खान", nameEn: "Shakeel Khan", addressHi: "पीलवा वार्ड न. 9 नगरपालिका बहादुरपुर अलवर (राज.)", addressEn: "Pilwa Ward No. 9, Municipality Bahadurpur, Alwar (Raj.)", partyHi: "इण्डियन नेशनल कांग्रेस", partyEn: "Indian National Congress", party: "Congress", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },

  // Ward 10
  { wardNumber: 10, serialNumber: 1, nameHi: "बने सिंह गुर्जर", nameEn: "Bane Singh Gurjar", addressHi: "ग्राम पोस्ट भजेड़ा जिला अलवर", addressEn: "Village & Post Bhajeda, Dist. Alwar", partyHi: "भारतीय जनता पार्टी", partyEn: "Bharatiya Janata Party", party: "BJP", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 10, serialNumber: 2, nameHi: "हरहेत कुमार", nameEn: "Harhet Kumar", addressHi: "ग्राम भजेड़ा तह + जिला अलवर (राज.)", addressEn: "Village Bhajeda, Tehsil + Dist. Alwar (Raj.)", partyHi: "इण्डियन नेशनल कांग्रेस", partyEn: "Indian National Congress", party: "Congress", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 10, serialNumber: 3, nameHi: "कपिल कुमार", nameEn: "Kapil Kumar", addressHi: "ग्राम भजेड़ा, तहसील व जिला अलवर (राज.)", addressEn: "Village Bhajeda, Tehsil & Dist. Alwar (Raj.)", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },
  { wardNumber: 10, serialNumber: 4, nameHi: "धारा सिंह गुर्जर", nameEn: "Dhara Singh Gurjar", addressHi: "ग्राम व पोस्ट- भजेड़ा वाया- बहादुरपुर तहसील व जिला अलवर पिन कोड़ 301028", addressEn: "Village & Post Bhajeda via Bahadurpur, Tehsil & Dist. Alwar, Pin - 301028", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 10, serialNumber: 5, nameHi: "राजेन्द्र प्रसाद", nameEn: "Rajendra Prasad", addressHi: "भजेड़ा जिला अलवर (राज.)", addressEn: "Bhajeda, Dist. Alwar (Raj.)", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "सामान्य", categoryEn: "General" },
  { wardNumber: 10, serialNumber: 6, nameHi: "सिकन्दर अली", nameEn: "Sikandar Ali", addressHi: "ग्राम - भजेड़ा तह + जिला अलवर 301028", addressEn: "Village Bhajeda, Tehsil + Dist. Alwar - 301028", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },

  // Ward 11
  { wardNumber: 11, serialNumber: 1, nameHi: "अज्जो बाई", nameEn: "Ajjo Bai", addressHi: "ग्राम भजेड़ा तह. अलवर जिला अलवर (राजस्थान)", addressEn: "Village Bhajeda, Tehsil Alwar, Dist. Alwar (Rajasthan)", partyHi: "भारतीय जनता पार्टी", partyEn: "Bharatiya Janata Party", party: "BJP", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 11, serialNumber: 2, nameHi: "राजेश कुमारी", nameEn: "Rajesh Kumari", addressHi: "ग्राम भजेड़ा तह. + जिला अलवर", addressEn: "Village Bhajeda, Tehsil + Dist. Alwar", partyHi: "इण्डियन नेशनल कांग्रेस", partyEn: "Indian National Congress", party: "Congress", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 11, serialNumber: 3, nameHi: "कमलेश", nameEn: "Kamlesh", addressHi: "भजेडा वार्ड सं. 11 नगरपालिका बहादुरपुर", addressEn: "Bhajeda Ward No. 11, Municipality Bahadurpur", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 11, serialNumber: 4, nameHi: "कमुषा बाई", nameEn: "Kumusha Bai", addressHi: "वार्ड नं. 11 राजपूत बास भजेडा नगरपालिका बहादुरपुर अलवर (राज.) 301028", addressEn: "Ward No. 11, Rajput Bas, Bhajeda, Municipality Bahadurpur, Alwar (Raj.) - 301028", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 11, serialNumber: 5, nameHi: "रेशम देवी", nameEn: "Resham Devi", addressHi: "ग्राम व पोस्ट भजेड़ा वाया बहादुरपुर तहसील व जिला - अलवर पिन कोड़ 301028", addressEn: "Village & Post Bhajeda via Bahadurpur, Tehsil & Dist. Alwar, Pin - 301028", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },

  // Ward 12
  { wardNumber: 12, serialNumber: 1, nameHi: "डालचन्द", nameEn: "Dalchand", addressHi: "भजेड़ा वार्ड नं. 10 नगरपालिका बहादुरपुर", addressEn: "Bhajeda Ward No. 10, Municipality Bahadurpur", partyHi: "इण्डियन नेशनल कांग्रेस", partyEn: "Indian National Congress", party: "Congress", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },
  { wardNumber: 12, serialNumber: 2, nameHi: "रत्तीराम", nameEn: "Rattiram", addressHi: "भजेड़ा का बास भजेड़ा अलवर (राज.) पिन न. 301028", addressEn: "Bhajeda Ka Bas, Bhajeda, Alwar (Raj.) Pin No. 301028", partyHi: "भारतीय जनता पार्टी", partyEn: "Bharatiya Janata Party", party: "BJP", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },
  { wardNumber: 12, serialNumber: 3, nameHi: "कालू राम", nameEn: "Kalu Ram", addressHi: "भजेडा तह अलवर जिला अलवर", addressEn: "Bhajeda, Tehsil Alwar, Dist. Alwar", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },
  { wardNumber: 12, serialNumber: 4, nameHi: "नन्दराम", nameEn: "Nandram", addressHi: "गाँव पोस्ट – भजेड़ा, बहादुरपुर, अलवर", addressEn: "Village Post Bhajeda, Bahadurpur, Alwar", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },
  { wardNumber: 12, serialNumber: 5, nameHi: "रामौतार उर्फ राम अवतार", nameEn: "Ramawtar alias Ram Avtar", addressHi: "वार्ड 12 भजेडा बहादुरपुर", addressEn: "Ward 12, Bhajeda, Bahadurpur", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },

  // Ward 13
  { wardNumber: 13, serialNumber: 1, nameHi: "एकता कुमारी", nameEn: "Ekta Kumari", addressHi: "ग्राम - रानीखेड़ा, पो. भजेड़ा तहसील - अलवर व जिला अलवर पिन कोड 301028", addressEn: "Village Ranikheda, Post Bhajeda, Tehsil Alwar & Dist. Alwar, Pin - 301028", partyHi: "भारतीय जनता पार्टी", partyEn: "Bharatiya Janata Party", party: "BJP", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 13, serialNumber: 2, nameHi: "सरमीना खातून", nameEn: "Sarmeena Khatoon", addressHi: "ग्राम पो. भजेड़ा जिला व तहसील अलवर राज. पिन कोड 301028", addressEn: "Village Post Bhajeda, Dist. & Tehsil Alwar, Raj. Pin - 301028", partyHi: "इण्डियन नेशनल कांग्रेस", partyEn: "Indian National Congress", party: "Congress", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 13, serialNumber: 3, nameHi: "अपसाना", nameEn: "Apsana", addressHi: "वार्ड नं. 13 रानीखेड़ा अलवर", addressEn: "Ward No. 13, Ranikheda, Alwar", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 13, serialNumber: 4, nameHi: "जिलसाना", nameEn: "Jilsana", addressHi: "वार्ड नं. 13 रानीखेड़ा बहादुरपुर", addressEn: "Ward No. 13, Ranikheda, Bahadurpur", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },

  // Ward 14
  { wardNumber: 14, serialNumber: 1, nameHi: "मुकेश कुमार", nameEn: "Mukesh Kumar", addressHi: "गाँव - सोतका पोस्ट - भजेड़ा जिला अलवर तह. अलवर (राज.)", addressEn: "Village Sotka, Post Bhajeda, Dist. Alwar, Tehsil Alwar (Raj.)", partyHi: "भारतीय जनता पार्टी", partyEn: "Bharatiya Janata Party", party: "BJP", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 14, serialNumber: 2, nameHi: "इन्द्रराज गुर्जर", nameEn: "Indraraj Gurjar", addressHi: "ग्राम सोतका तहसील जिला, अलवर", addressEn: "Village Sotka, Tehsil & Dist. Alwar", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },

  // Ward 15
  { wardNumber: 15, serialNumber: 1, nameHi: "शाहरूख खाँन", nameEn: "Shahrukh Khan", addressHi: "वार्ड नम्बर 19 बहादुरपुर पट्री मीरान, अलवर राजस्थान 301028", addressEn: "Ward No. 19, Bahadurpur Patti Meeran, Alwar, Rajasthan - 301028", partyHi: "इण्डियन नेशनल कांग्रेस", partyEn: "Indian National Congress", party: "Congress", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 15, serialNumber: 2, nameHi: "अमर मौहम्मद", nameEn: "Amar Mohammad", addressHi: "हसमत का बास पट्टी मीरान बहादुरपुर", addressEn: "Hasmat Ka Bas, Patti Meeran, Bahadurpur", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 15, serialNumber: 3, nameHi: "शब्बीर अहमद", nameEn: "Shabbir Ahmed", addressHi: "वार्ड 15 बहादुरपुर पट्टी मीरान", addressEn: "Ward 15, Bahadurpur Patti Meeran", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 15, serialNumber: 4, nameHi: "हरचंद गुर्जर", nameEn: "Harchand Gurjar", addressHi: "ग्यासी का बास पट्टी मीरान बहादुरपुर अलवर राज.", addressEn: "Gyasi Ka Bas, Patti Meeran, Bahadurpur, Alwar, Raj.", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },

  // Ward 16
  { wardNumber: 16, serialNumber: 1, nameHi: "बलवंत सिहँ यादव", nameEn: "Balwant Singh Yadav", addressHi: "पट्टी पहाड़ी बहादुरपुर", addressEn: "Patti Pahadi, Bahadurpur", partyHi: "भारतीय जनता पार्टी", partyEn: "Bharatiya Janata Party", party: "BJP", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 16, serialNumber: 2, nameHi: "लोकेश शर्मा", nameEn: "Lokesh Sharma", addressHi: "वार्ड नं. 16 बहादुरपुर पट्टी मीरान, अलवर राज. 301028", addressEn: "Ward No. 16, Bahadurpur Patti Meeran, Alwar Raj. - 301028", partyHi: "इण्डियन नेशनल कांग्रेस", partyEn: "Indian National Congress", party: "Congress", categoryHi: "सामान्य", categoryEn: "General" },
  { wardNumber: 16, serialNumber: 3, nameHi: "इन्दर कुमार", nameEn: "Inder Kumar", addressHi: "V.P.O बहादुरपुर (जिला अलवर) 301028", addressEn: "V.P.O. Bahadurpur (Dist. Alwar) - 301028", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 16, serialNumber: 4, nameHi: "गणेश चन्द", nameEn: "Ganesh Chand", addressHi: "ठाकुरजी के मन्दिर के पास बहादुरपुर पट्टी मीरान बहादुरपुर (अलवर)", addressEn: "Near Thakurji Temple, Bahadurpur Patti Meeran, Bahadurpur (Alwar)", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },

  // Ward 17
  { wardNumber: 17, serialNumber: 1, nameHi: "अजय कुमार कोली", nameEn: "Ajay Kumar Koli", addressHi: "बहादुरपुर पट्टी मीरान अलवर राजस्थान", addressEn: "Bahadurpur Patti Meeran, Alwar, Rajasthan", partyHi: "भारतीय जनता पार्टी", partyEn: "Bharatiya Janata Party", party: "BJP", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },
  { wardNumber: 17, serialNumber: 2, nameHi: "लाभ चन्द कोली", nameEn: "Labh Chand Koli", addressHi: "वार्ड नं. 17 कबीला मौहल्ला बहादुरपुर, अलवर", addressEn: "Ward No. 17, Kabeela Mohalla, Bahadurpur, Alwar", partyHi: "इण्डियन नेशनल कांग्रेस", partyEn: "Indian National Congress", party: "Congress", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },
  { wardNumber: 17, serialNumber: 3, nameHi: "भजन लाल", nameEn: "Bhajan Lal", addressHi: "कुम्हारो का मोहल्ला बहादुरपुर अलवर राजस्थान", addressEn: "Kumharon Ka Mohalla, Bahadurpur, Alwar, Rajasthan", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },
  { wardNumber: 17, serialNumber: 4, nameHi: "मनीष आलोक", nameEn: "Manish Alok", addressHi: "बस स्टैण्ड मेन मार्केट बहादुरपुर पट्टी मीरान, अलवर (राज.)", addressEn: "Bus Stand Main Market, Bahadurpur Patti Meeran, Alwar (Raj.)", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },
  { wardNumber: 17, serialNumber: 5, nameHi: "महेश कुमार", nameEn: "Mahesh Kumar", addressHi: "वार्ड 17 बहादुरपुर पट्टी मीरान", addressEn: "Ward 17, Bahadurpur Patti Meeran", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },
  { wardNumber: 17, serialNumber: 6, nameHi: "महेश चन्द", nameEn: "Mahesh Chand", addressHi: "बहादुरपुर पट्टी मीरान अलवर राज.", addressEn: "Bahadurpur Patti Meeran, Alwar Raj.", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },
  { wardNumber: 17, serialNumber: 7, nameHi: "ललित", nameEn: "Lalit", addressHi: "वार्ड 17 कबीला मौहल्ला बहादुरपुर", addressEn: "Ward 17, Kabeela Mohalla, Bahadurpur", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अनुसूचित जाति", categoryEn: "SC" },

  // Ward 18
  { wardNumber: 18, serialNumber: 1, nameHi: "तारा चन्द खाती", nameEn: "Tara Chand Khati", addressHi: "मण्डी दिवाड़ा मोहल्ला बहादुरपुर पट्टी मीरान जिला अलवर (राज.)", addressEn: "Mandi Diwada Mohalla, Bahadurpur Patti Meeran, Dist. Alwar (Raj.)", partyHi: "भारतीय जनता पार्टी", partyEn: "Bharatiya Janata Party", party: "BJP", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 18, serialNumber: 2, nameHi: "बलबीर प्रसाद", nameEn: "Balbir Prasad", addressHi: "वार्ड नं. 18 मौहल्ला मण्डी दिवाडा बहादुरपुर अलवर 301028", addressEn: "Ward No. 18, Mohalla Mandi Diwada, Bahadurpur, Alwar - 301028", partyHi: "इण्डियन नेशनल कांग्रेस", partyEn: "Indian National Congress", party: "Congress", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 18, serialNumber: 3, nameHi: "आसीन खान", nameEn: "Aaseen Khan", addressHi: "वार्ड नं. 18 मौहल्ला - मण्डी दिवाडा बहादुरपुर", addressEn: "Ward No. 18, Mohalla Mandi Diwada, Bahadurpur", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 18, serialNumber: 4, nameHi: "गिर्राज प्रसाद सैनी", nameEn: "Girraj Prasad Saini", addressHi: "शंभू की चक्की के पास, बहादुरपुर पट्टी मीरान (अलवर) राज.", addressEn: "Near Shambhu Ki Chakki, Bahadurpur Patti Meeran (Alwar) Raj.", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 18, serialNumber: 5, nameHi: "जितेन्द्र कुमार", nameEn: "Jitendra Kumar", addressHi: "बहादुरपुर पट्टी मीरान, अलवर", addressEn: "Bahadurpur Patti Meeran, Alwar", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 18, serialNumber: 6, nameHi: "भजन लाल", nameEn: "Bhajan Lal", addressHi: "वार्ड नं. 18 नगरपालिका बहादुरपुर मौहल्ला मण्डी दिवाडा शिव मन्दिर के पास बहादुरपुर जिला अलवर", addressEn: "Ward No. 18, Municipality Bahadurpur, Mohalla Mandi Diwada, Near Shiv Temple, Bahadurpur, Dist. Alwar", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 18, serialNumber: 7, nameHi: "महेश चन्द", nameEn: "Mahesh Chand", addressHi: "मण्डी दिवाडा मोहोल्ला बहादुरपुर पट्टी मीरान बहादुरपुर जिला अलवर", addressEn: "Mandi Diwada Mohalla, Bahadurpur Patti Meeran, Bahadurpur, Dist. Alwar", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 18, serialNumber: 8, nameHi: "हाकिम दीन", nameEn: "Hakim Deen", addressHi: "वार्ड नं. 18 मौहल्ला - मण्डी दिवाडा बहादुरपुर", addressEn: "Ward No. 18, Mohalla Mandi Diwada, Bahadurpur", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },

  // Ward 19
  { wardNumber: 19, serialNumber: 1, nameHi: "उमेश कुमार", nameEn: "Umesh Kumar", addressHi: "किले के पास, बहादुरपुर पट्टी मीरां अलवर (राज.) पिन कोड 301028", addressEn: "Near Fort (Kila), Bahadurpur Patti Meeran, Alwar (Raj.) Pin - 301028", partyHi: "भारतीय जनता पार्टी", partyEn: "Bharatiya Janata Party", party: "BJP", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 19, serialNumber: 2, nameHi: "कमल सैनी", nameEn: "Kamal Saini", addressHi: "वार्ड 19 बडे मन्दिर के पास बहादुरपुर", addressEn: "Ward 19, Near Bade Mandir, Bahadurpur", partyHi: "इण्डियन नेशनल कांग्रेस", partyEn: "Indian National Congress", party: "Congress", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 19, serialNumber: 3, nameHi: "विनोद", nameEn: "Vinod", addressHi: "वार्ड 19 खटीक वाडी मोहल्ला बहादुरपुर", addressEn: "Ward 19, Khatik Wadi Mohalla, Bahadurpur", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 19, serialNumber: 4, nameHi: "सचिन कुमार", nameEn: "Sachin Kumar", addressHi: "बहादुरपुर पट्टी मीरान", addressEn: "Bahadurpur Patti Meeran", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 19, serialNumber: 5, nameHi: "सुरेश चन्द", nameEn: "Suresh Chand", addressHi: "वार्ड नं. 19 सुनार बाडी मौहल्ला बहादुरपुर", addressEn: "Ward No. 19, Sunar Badi Mohalla, Bahadurpur", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },

  // Ward 20
  { wardNumber: 20, serialNumber: 1, nameHi: "पूजा शर्मा", nameEn: "Pooja Sharma", addressHi: "बहादुरपुर पट्टी मीरान बहादुरपुर जिला अलवर (राज.) 301028", addressEn: "Bahadurpur Patti Meeran, Bahadurpur, Dist. Alwar (Raj.) - 301028", partyHi: "भारतीय जनता पार्टी", partyEn: "Bharatiya Janata Party", party: "BJP", categoryHi: "सामान्य", categoryEn: "General" },
  { wardNumber: 20, serialNumber: 2, nameHi: "बिसमिल्ला", nameEn: "Bismillah", addressHi: "वार्ड नं. 20 खंजादवाडी बहादुरपुर, अलवर", addressEn: "Ward No. 20, Khanzadwadi, Bahadurpur, Alwar", partyHi: "इण्डियन नेशनल कांग्रेस", partyEn: "Indian National Congress", party: "Congress", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 20, serialNumber: 3, nameHi: "अंजुम", nameEn: "Anjum", addressHi: "खंजादवादी मौहल्ला, बाहादुरपुर पट्टी मीरान, अलवर", addressEn: "Khanzadwadi Mohalla, Bahadurpur Patti Meeran, Alwar", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 20, serialNumber: 4, nameHi: "डोली जाँगिड", nameEn: "Dolly Jangid", addressHi: "बहादुरपुर पट्टी मीरान बहादुरपुर अलवर (राज.)", addressEn: "Bahadurpur Patti Meeran, Bahadurpur, Alwar (Raj.)", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },

  // Ward 21
  { wardNumber: 21, serialNumber: 1, nameHi: "ज्योति राजपूत", nameEn: "Jyoti Rajput", addressHi: "ठाकुर वाडी मोहल्ला पट्टी मीरान बहादुरपुर अलवर (राज.)", addressEn: "Thakur Wadi Mohalla, Patti Meeran, Bahadurpur, Alwar (Raj.)", partyHi: "भारतीय जनता पार्टी", partyEn: "Bharatiya Janata Party", party: "BJP", categoryHi: "सामान्य", categoryEn: "General" },
  { wardNumber: 21, serialNumber: 2, nameHi: "बीना", nameEn: "Beena", addressHi: "वार्ड नं.17 बहादुरपुर पट्टी मीरान जिला अलवर (राज.) 301028", addressEn: "Ward No. 17, Bahadurpur Patti Meeran, Dist. Alwar (Raj.) - 301028", partyHi: "इण्डियन नेशनल कांग्रेस", partyEn: "Indian National Congress", party: "Congress", categoryHi: "सामान्य", categoryEn: "General" },
  { wardNumber: 21, serialNumber: 3, nameHi: "अंजु सचदेवा", nameEn: "Anju Sachdeva", addressHi: "कोलीवाडा मोहल्ला बहादुरपुर पट्टी मीरान जिला अलवर राजस्थान 301028", addressEn: "Koliwada Mohalla, Bahadurpur Patti Meeran, Dist. Alwar, Rajasthan - 301028", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "सामान्य", categoryEn: "General" },
  { wardNumber: 21, serialNumber: 4, nameHi: "कल्पना गोयल", nameEn: "Kalpana Goyal", addressHi: "नगरपालिका बहादुरपुर जिला अलवर (राज.)", addressEn: "Municipality Bahadurpur, Dist. Alwar (Raj.)", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "सामान्य", categoryEn: "General" },
  { wardNumber: 21, serialNumber: 5, nameHi: "दयावन्ती", nameEn: "Dayawanti", addressHi: "कोलियों का मोहल्ला बहादुरपुर पट्टी मीरां अलवर राजस्थान 301028", addressEn: "Koliyon Ka Mohalla, Bahadurpur Patti Meeran, Alwar, Rajasthan - 301028", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "सामान्य", categoryEn: "General" },
  { wardNumber: 21, serialNumber: 6, nameHi: "पिंकी", nameEn: "Pinki", addressHi: "वार्ड नं. 21 बहादुरपुर पट्टी मीरान अलवर (राज.)", addressEn: "Ward No. 21, Bahadurpur Patti Meeran, Alwar (Raj.)", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },

  // Ward 22
  { wardNumber: 22, serialNumber: 1, nameHi: "विकास साहू", nameEn: "Vikas Sahu", addressHi: "मण्ड़ी दिवाड़ा मोहल्ला बहादुरपुर पट्टी मीरान अलवर (राज.)", addressEn: "Mandi Diwada Mohalla, Bahadurpur Patti Meeran, Alwar (Raj.)", partyHi: "भारतीय जनता पार्टी", partyEn: "Bharatiya Janata Party", party: "BJP", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 22, serialNumber: 2, nameHi: "सतीश कुमार", nameEn: "Satish Kumar", addressHi: "वार्ड नं. 22 मौहल्ला मण्डी दीवाडा बहादुरपुर अलवर", addressEn: "Ward No. 22, Mohalla Mandi Diwada, Bahadurpur, Alwar", partyHi: "इण्डियन नेशनल कांग्रेस", partyEn: "Indian National Congress", party: "Congress", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 22, serialNumber: 3, nameHi: "अय्यूब खांन", nameEn: "Ayub Khan", addressHi: "वार्ड नं. 22 मण्डी दीवाडा बहादुरपुर", addressEn: "Ward No. 22, Mandi Diwada, Bahadurpur", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 22, serialNumber: 4, nameHi: "कविशा", nameEn: "Kavisha", addressHi: "वार्ड नं. 21 बहादुरपुर (अलवर)", addressEn: "Ward No. 21, Bahadurpur (Alwar)", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "सामान्य", categoryEn: "General" },
  { wardNumber: 22, serialNumber: 5, nameHi: "गौरव जैन", nameEn: "Gaurav Jain", addressHi: "मोहल्ला मण्डी दिवाड़ा बहादुरपुर पट्टी मीरान बहादुरपुर अलवर (राज.)", addressEn: "Mohalla Mandi Diwada, Bahadurpur Patti Meeran, Bahadurpur, Alwar (Raj.)", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "सामान्य", categoryEn: "General" },
  { wardNumber: 22, serialNumber: 6, nameHi: "प्रकाश चन्द साहू", nameEn: "Prakash Chand Sahu", addressHi: "उप-तहसील के सामने बहादुरपुर पट्टी मीरान, अलवर (राजस्थान) पिन-301028 वार्ड न. 16", addressEn: "In front of Sub-Tehsil, Bahadurpur Patti Meeran, Alwar (Rajasthan) Pin - 301028, Ward No. 16", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 22, serialNumber: 7, nameHi: "मनीष कुमार", nameEn: "Manish Kumar", addressHi: "मण्डी दिवाडा मोहल्ला बहादुरपुर पट्टी मीरान अलवर बहादुरपुर", addressEn: "Mandi Diwada Mohalla, Bahadurpur Patti Meeran, Alwar, Bahadurpur", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 22, serialNumber: 8, nameHi: "हिमांशु कुमार", nameEn: "Himanshu Kumar", addressHi: "पुलिस चौकी के पीछे बहादुरपुर पट्टी मीरान बहादुरपुर अलवर (राज.)", addressEn: "Behind Police Chowki, Bahadurpur Patti Meeran, Bahadurpur, Alwar (Raj.)", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "सामान्य", categoryEn: "General" },

  // Ward 23
  { wardNumber: 23, serialNumber: 1, nameHi: "मीना", nameEn: "Meena", addressHi: "बहादुरपुर जिला अलवर", addressEn: "Bahadurpur, Dist. Alwar", partyHi: "भारतीय जनता पार्टी", partyEn: "Bharatiya Janata Party", party: "BJP", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 23, serialNumber: 2, nameHi: "वसीमा बानो", nameEn: "Waseema Bano", addressHi: "टीला ऊपर पट्टी कटला बहादुरपुर त. अलवर (राज.)", addressEn: "Teela Oopar, Patti Katla, Bahadurpur, Tehsil Alwar (Raj.)", partyHi: "इण्डियन नेशनल कांग्रेस", partyEn: "Indian National Congress", party: "Congress", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 23, serialNumber: 3, nameHi: "अनीषा", nameEn: "Anisha", addressHi: "बहादुरपुर पट्टी मीरान अलवर, राजस्थान 301028 वार्ड नं. 23", addressEn: "Ward No. 23, Bahadurpur Patti Meeran, Alwar, Rajasthan - 301028", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 23, serialNumber: 4, nameHi: "कलसुम", nameEn: "Kalsum", addressHi: "वार्ड नं. 23 पट्टी कटला बहादुरपुर", addressEn: "Ward No. 23, Patti Katla, Bahadurpur", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 23, serialNumber: 5, nameHi: "हनसीरा", nameEn: "Hanseera", addressHi: "वार्ड 23 मन्डी दिवाडा बहादुरपुर अलवर", addressEn: "Ward 23, Mandi Diwada, Bahadurpur, Alwar", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },

  // Ward 24
  { wardNumber: 24, serialNumber: 1, nameHi: "अजीत सिंह", nameEn: "Ajeet Singh", addressHi: "वार्ड नं. 24 सोनिया का बास बहादुरपुर अलवर पिन कोड़ 301028", addressEn: "Ward No. 24, Soniya Ka Bas, Bahadurpur, Alwar, Pin Code - 301028", partyHi: "इण्डियन नेशनल कांग्रेस", partyEn: "Indian National Congress", party: "Congress", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 24, serialNumber: 2, nameHi: "रामसिंह", nameEn: "Ram Singh", addressHi: "टीला उपर पटटी कटला बहादुरपुर त.. व, जिला अलवर", addressEn: "Teela Oopar, Patti Katla, Bahadurpur, Tehsil & Dist. Alwar", partyHi: "भारतीय जनता पार्टी", partyEn: "Bharatiya Janata Party", party: "BJP", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 24, serialNumber: 3, nameHi: "धारा सिंह", nameEn: "Dhara Singh", addressHi: "हुरमत का बास बहादुरपुर पट्टी कटला अलवर (राज.)", addressEn: "Hurmat Ka Bas, Bahadurpur Patti Katla, Alwar (Raj.)", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 24, serialNumber: 4, nameHi: "परवेज", nameEn: "Parvez", addressHi: "बहादुरपुर पट्टी कटला अलवर राज.", addressEn: "Bahadurpur Patti Katla, Alwar, Raj.", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 24, serialNumber: 5, nameHi: "शिव कुमार सोनी", nameEn: "Shiv Kumar Soni", addressHi: "ठाकर वाडी पट्टी मीरान बहादुरपुर तहसील - अलवर, जिला- अलवर", addressEn: "Thakur Wadi Patti Meeran, Bahadurpur, Tehsil Alwar, Dist. Alwar", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },

  // Ward 25
  { wardNumber: 25, serialNumber: 1, nameHi: "नसीम खान", nameEn: "Naseem Khan", addressHi: "वार्ड 25 नाहरपुर कला बहादुरपुर", addressEn: "Ward 25, Naharpur Kala, Bahadurpur", partyHi: "इण्डियन नेशनल कांग्रेस", partyEn: "Indian National Congress", party: "Congress", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 25, serialNumber: 2, nameHi: "रमेश चंद", nameEn: "Ramesh Chand", addressHi: "नाहारपुर कला, बहादुरपुर पॅटी जोडिया, बहादुरपुर", addressEn: "Naharpur Kala, Bahadurpur Patti Jodia, Bahadurpur", partyHi: "भारतीय जनता पार्टी", partyEn: "Bharatiya Janata Party", party: "BJP", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 25, serialNumber: 3, nameHi: "तौफीक अहमद", nameEn: "Taufiq Ahmed", addressHi: "पट्टी जोडिया बहादुरपुर अलवर राज.", addressEn: "Patti Jodia, Bahadurpur, Alwar, Raj.", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 25, serialNumber: 4, nameHi: "मोहम्मद शाहिद", nameEn: "Mohammad Shahid", addressHi: "नाहरपुर कला पोस्ट-बहादुरपुर जिला अलवर पिन कोड 301028", addressEn: "Naharpur Kala, Post Bahadurpur, Dist. Alwar, Pin Code - 301028", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
  { wardNumber: 25, serialNumber: 5, nameHi: "सुनिल कुमार", nameEn: "Sunil Kumar", addressHi: "वार्ड नं. 25 नाहरपुर कला बहादुरपुर, अलवर", addressEn: "Ward No. 25, Naharpur Kala, Bahadurpur, Alwar", partyHi: "निर्दलीय", partyEn: "Independent", party: "Others", categoryHi: "अन्य पिछड़ा वर्ग", categoryEn: "OBC" },
];

async function seedExactCandidates() {
  try {
    await connectDB();
    console.log("Connected to MongoDB.");

    await Candidate.deleteMany({});
    console.log("Cleared existing candidates.");

    const formattedForDb = rawData.map((c) => ({
      wardNumber: c.wardNumber,
      serialNumber: c.serialNumber,
      nameEn: c.nameEn,
      nameHi: c.nameHi,
      address: c.addressEn,
      party: c.party,
      partyAffiliation: c.partyEn,
      category: c.categoryEn,
    }));

    const seeded = await Candidate.insertMany(formattedForDb);
    console.log(`Successfully seeded ${seeded.length} exact candidates in MongoDB!`);

    // Write to parsadCandidates.ts
    const formattedForFrontend = rawData.map((c) => ({
      id: `ward-${c.wardNumber}-${c.serialNumber}`,
      wardNumber: c.wardNumber,
      serialNumber: c.serialNumber,
      nameEn: c.nameEn,
      nameHi: c.nameHi,
      addressEn: c.addressEn,
      addressHi: c.addressHi,
      party: c.party,
      partyAffiliationEn: c.partyEn,
      partyAffiliationHi: c.partyHi,
      partyNameEn: c.party === "BJP" ? "Bharatiya Janata Party (BJP)" : c.party === "Congress" ? "Indian National Congress (INC)" : "Independent / Other",
      partyNameHi: c.party === "BJP" ? "भारतीय जनता पार्टी (BJP)" : c.party === "Congress" ? "इण्डियन नेशनल कांग्रेस (Congress)" : "निर्दलीय (Independent)",
      categoryEn: c.categoryEn,
      categoryHi: c.categoryHi,
    }));

    const fileContent = `export type ParsadCandidate = {
  id: string;
  wardNumber: number;
  serialNumber?: number;
  nameEn: string;
  nameHi: string;
  addressEn?: string;
  addressHi?: string;
  party: "BJP" | "Congress" | "Others";
  partyAffiliationEn?: string;
  partyAffiliationHi?: string;
  partyNameEn?: string;
  partyNameHi?: string;
  categoryEn?: string;
  categoryHi?: string;
};

export const parsadCandidates: ParsadCandidate[] = ${JSON.stringify(formattedForFrontend, null, 2)};

export function getParsadCandidatesForWard(ward: number | string): ParsadCandidate[] {
  const wardNum = typeof ward === "string" ? parseInt(ward, 10) : ward;
  const matches = parsadCandidates.filter((c) => c.wardNumber === wardNum);

  if (matches.length > 0) {
    return matches;
  }

  const wardFormatted = String(wardNum).padStart(2, "0");
  return [
    {
      id: \`ward-\${wardNum}-bjp\`,
      wardNumber: wardNum,
      nameEn: \`BJP Candidate (Ward \${wardFormatted})\`,
      nameHi: \`BJP पार्षद प्रत्याशी (वार्ड \${wardFormatted})\`,
      party: "BJP",
      partyNameEn: "BJP",
      partyNameHi: "भारतीय जनता पार्टी (BJP)",
    },
    {
      id: \`ward-\${wardNum}-congress\`,
      wardNumber: wardNum,
      nameEn: \`Congress Candidate (Ward \${wardFormatted})\`,
      nameHi: \`Congress पार्षद प्रत्याशी (वार्ड \${wardFormatted})\`,
      party: "Congress",
      partyNameEn: "Congress",
      partyNameHi: "इण्डियन नेशनल कांग्रेस (INC)",
    },
    {
      id: \`ward-\${wardNum}-others\`,
      wardNumber: wardNum,
      nameEn: \`Independent / Other Candidate\`,
      nameHi: \`निर्दलीय / अन्य प्रत्याशी\`,
      party: "Others",
      partyNameEn: "Others / Independent",
      partyNameHi: "अन्य / निर्दलीय",
    },
  ];
}
`;

    const targetPath = path.join(__dirname, "../../../voter-counting-survey-website/src/data/parsadCandidates.ts");
    fs.writeFileSync(targetPath, fileContent, "utf8");
    console.log("Successfully generated parsadCandidates.ts with exact Hindi & English names!");

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Error in seedExactCandidates:", err);
    process.exit(1);
  }
}

seedExactCandidates();
