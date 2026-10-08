import { FAQ } from "@/types/models";

export const INITIAL_FAQS: FAQ[] = [
  // 1. Admission
  {
    id: "faq-adm-eligibility",
    category: "Admission",
    question_en: "What are the eligibility criteria for undergraduate admission at City University?",
    question_bn: "সিটি ইউনিভার্সিটিতে আন্ডারগ্র্যাজুয়েট ভর্তির যোগ্যতা কী কী?",
    answer_en:
      "A minimum GPA of 2.50 each in SSC/equivalent and HSC/equivalent with a combined total GPA of 6.00 is required for standard engineering, business, and humanities programmes. For Music, Fashion Design, Fine Arts, and Graphic Design, a minimum GPA of 2.00 in SSC and HSC is accepted.",
    answer_bn:
      "এসএসসি ও এইচএসসি বা সমমান পরীক্ষায় উভয়টিতে পৃথকভাবে নূন্যতম জিপিএ ২.৫০ এবং সম্মিলিতভাবে নূন্যতম জিপিএ ৬.০০ থাকতে হবে। মিউজিক, ফ্যাশন ডিজাইন ও ফাইন আর্টস বিষয়ে উভয়টিতে নূন্যতম জিপিএ ২.০০ গ্রহণযোগ্য।",
    sourceUrl: "https://cityuniversity.ac.bd/admission-eligibility",
    source: "official",
  },
  {
    id: "faq-adm-steps",
    category: "Admission",
    question_en: "What is the step-by-step procedure to complete admission?",
    question_bn: "ভর্তি সম্পন্ন করার ধাপগুলো কী কী?",
    answer_en:
      "1. Collect and complete the admission form (online or offline at Khagan campus). 2. Submit with 4 attested passport-size colour photos and pay the application fee. 3. Sit for the admission test/interview. 4. Submit attested certificates and mark sheets of all board exams. 5. Pay admission and semester fees. 6. Collect the student ID card from the Admission Office.",
    answer_bn:
      "১. ভর্তি ফরম সংগ্রহ ও পূরণ করুন। ২. ৪ কপি সত্যায়িত পাসপোর্ট সাইজ ছবি ও ফরম ফি জমা দিন। ৩. ভর্তি পরীক্ষায় অংশগ্রহণ করুন। ৪. সকল শিক্ষাগত সনদের সত্যায়িত কপি জমা দিন। ৫. ভর্তি ও ট্রাইমিস্টার ফি পরিশোধ করুন। ৬. ভর্তি অফিস থেকে স্টুডেন্ট আইডি কার্ড গ্রহণ করুন।",
    sourceUrl: "https://cityuniversity.ac.bd/application-process",
    source: "official",
  },
  {
    id: "faq-adm-documents",
    category: "Admission",
    question_en: "Which documents are required at the time of admission?",
    question_bn: "ভর্তির সময় কী কী কাগজপত্র জমা দিতে হবে?",
    answer_en:
      "Two attested photocopies of all academic mark sheets and certificates (originals must be produced for physical verification), four attested passport-size colour photographs, an attested photocopy of National ID (or Birth Certificate), and an attested Chairman/Ward Commissioner nationality certificate.",
    answer_bn:
      "সকল বোর্ড পরীক্ষার মূল সনদের দুটি সত্যায়িত কপি (মূল সনদ প্রদর্শনের জন্য), ৪ কপি সত্যায়িত পাসপোর্ট ছবি, এনআইডি বা জন্ম সনদের কপি এবং নাগরিকত্ব সনদ জমা দিতে হবে।",
    sourceUrl: "https://cityuniversity.ac.bd/application-process",
    source: "official",
  },

  // 2. Fees and Waivers
  {
    id: "faq-fee-waivers",
    category: "Fees and Waivers",
    question_en: "What is the official undergraduate tuition fee waiver policy?",
    question_bn: "অফিসিয়াল আন্ডারগ্র্যাজুয়েট টিউশন ফি ওয়েভার বা স্কলারশিপ নীতিমালা কী?",
    answer_en:
      "Based on SSC and HSC results: Golden GPA 5.00 in both provides 100% tuition waiver (requires 3.60 CGPA to retain); GPA 5.00 in both provides 75% waiver (retain 3.50 CGPA); Combined GPA 9.00–9.99 gets 30% (retain 3.20); Combined 8.00–8.99 gets 25% (retain 3.00); Combined 7.00–7.99 gets 20%; 6.00–6.99 gets 15%; 5.00–5.99 gets 10%. Special quotas (siblings, freedom fighter descendants, Quran Hafiz, physical disability, sports) receive up to 50% waiver. Only the single highest waiver applies.",
    answer_bn:
      "উভয়টিতে গোল্ডেন জিপিএ ৫.০০ পেলে ১০০% ওয়েভার (পরবর্তী সেমিস্টারে ধরে রাখতে সিজিপিএ ৩.৬০ প্রয়োজন); উভয়টিতে জিপিএ ৫.০০ পেলে ৭৫% (সিজিপিএ ৩.৫০ প্রয়োজন); মোট জিপিএ ৯.০০–৯.৯৯ পেলে ৩০% (সিজিপিএ ৩.২০); মোট ৮.০০–৮.৯৯ পেলে ২৫% (সিজিপিএ ৩.০০)। এছাড়া সহোদর ভাইবোন, মুক্তিযোদ্ধা কোটা ও হাফেজে কুরআনদের জন্য সর্বোচ্চ ৫০% ওয়েভার প্রযোজ্য।",
    sourceUrl: "https://cityuniversity.ac.bd/waiverpolicy",
    source: "official",
  },
  {
    id: "faq-fee-structure-demo",
    category: "Fees and Waivers",
    question_en: "What is the estimated credit tuition cost for standard programmes?",
    question_bn: "বিভিন্ন বিভাগের আনুমানিক প্রতি ক্রেডিট টিউশন ফি কত?",
    answer_en:
      "Tuition fees are charged on a per-credit and trimester basis: CSE/EEE ~3,500–4,500 BDT per credit; BBA/English ~2,500–3,200 BDT; Pharmacy ~4,000–5,000 BDT; Law ~2,800 BDT. One-time admission fee is ~15,000–20,000 BDT, and recurring trimester activities/lab/ICT fee is 8,000–12,000 BDT. Total CSE four-year cost averages 5.2–6.0 Lakh BDT before merit waiver deductions. (Sample hackathon illustrative data).",
    answer_bn:
      "ক্রেডিট প্রতি আনুমানিক ফি: সিএসই/ইইই ৩৫০০-৪৫০০ টাকা; বিবিএ/ইংরেজি ২৫০০-৩২০০ টাকা; ফার্মেসি ৪০০০-৫০০০ টাকা। এককালীন ভর্তি ফি ১৫,০০০-২০,০০০ টাকা এবং ট্রাইমিস্টার ফি ৮,০০০-১২,০০০ টাকা (নমুনা ডেমো ডেটা)।",
    sourceUrl: "https://cityuniversity.ac.bd/tution-fees",
    source: "demo",
  },

  // 3. Exams
  {
    id: "faq-exam-attendance",
    category: "Exams",
    question_en: "What is the mandatory attendance requirement to sit for final semester examinations?",
    question_bn: "ফাইনাল সেমিস্টার পরীক্ষায় বসার জন্য কত শতাংশ উপস্থিতি বাধ্যতামূলক?",
    answer_en:
      "Students must maintain at least 75% class attendance in each registered course to be eligible for midterm and final trimester examinations. Students falling below 75% without authorized medical leave require special departmental head dispensation.",
    answer_bn:
      "মিডটার্ম এবং ফাইনাল পরীক্ষায় অংশ নিতে শিক্ষার্থীদের প্রতিটি কোর্সে নূন্যতম ৭৫% ক্লাসে উপস্থিতি নিশ্চিত করতে হবে।",
    sourceUrl: "https://cityuniversity.ac.bd/faq",
    source: "official",
  },
  {
    id: "faq-exam-id-card",
    category: "Exams",
    question_en: "What items must students bring to the examination hall?",
    question_bn: "পরীক্ষার হলে শিক্ষার্থীদের কী কী সঙ্গে আনা বাধ্যতামূলক?",
    answer_en:
      "Every candidate must carry their valid City University Student ID Card and Admit Card issued by the Controller of Examinations. Electronic smart watches and unauthorized mobile phones are strictly prohibited in the exam hall.",
    answer_bn:
      "পরীক্ষার্থীদের অবশ্যই বৈধ সিটি ইউনিভার্সিটি আইডি কার্ড ও পরীক্ষার প্রবেশপত্র (Admit Card) সাথে রাখতে হবে। স্মার্টওয়াচ ও মোবাইল ফোন সম্পূর্ণ নিষিদ্ধ।",
    sourceUrl: "https://cityuniversity.ac.bd/faq",
    source: "official",
  },

  // 4. Registration and Courses
  {
    id: "faq-reg-iems",
    category: "Registration and Courses",
    question_en: "How do students complete trimester course registration online?",
    question_bn: "শিক্ষার্থীরা কীভাবে অনলাইনে ট্রাইমিস্টার কোর্স রেজিস্ট্রেশন সম্পন্ন করবেন?",
    answer_en:
      "Trimester course registration is completed through the City University Integrated Education Management System (iEMS at https://iems.cityuniversity.ac.bd/) or the Student Portal. Students select their batch sections after clearing previous semester tuition dues.",
    answer_bn:
      "সিটি বিশ্ববিদ্যালয়ের সমন্বিত শিক্ষা ব্যবস্থাপনা পোর্টাল (iEMS: https://iems.cityuniversity.ac.bd/) এর মাধ্যমে কোর্স রেজিস্ট্রেশন সম্পন্ন করতে হয়।",
    sourceUrl: "https://iems.cityuniversity.ac.bd/",
    source: "official",
  },
  {
    id: "faq-reg-trimester",
    category: "Registration and Courses",
    question_en: "What is the academic calendar structure at City University?",
    question_bn: "সিটি ইউনিভার্সিটির একাডেমিক ক্যালেন্ডার কাঠামো কেমন?",
    answer_en:
      "City University operates on a trimester system comprising three terms per academic year: Spring (January–April), Summer (May–August), and Fall (September–December). Regular classes start in the first week of each trimester.",
    answer_bn:
      "সিটি বিশ্ববিদ্যালয়ে ট্রাইমিস্টার পদ্ধতিতে তিনটি সেশন পরিচালিত হয়: স্প্রিং (জানুয়ারি-এপ্রিল), সামার (মে-আগস্ট) এবং ফল (সেপ্টেম্বর-ডিসেম্বর)।",
    sourceUrl: "https://cityuniversity.ac.bd/faq",
    source: "official",
  },

  // 5. Transport
  {
    id: "faq-transport-routes",
    category: "Transport",
    question_en: "Does City University provide shuttle buses for students and staff?",
    question_bn: "সিটি ইউনিভার্সিটি কি ছাত্র-ছাত্রী ও শিক্ষকদের জন্য পরিবহন সুবিধা প্রদান করে?",
    answer_en:
      "Yes. The university operates dedicated transport shuttles covering major corridors across Dhaka, including Gabtoli, Mirpur-10, Uttara, Dhanmondi, and Savar/Nabinagar, with special arrangements for late evening exam periods and weekend programmes.",
    answer_bn:
      "হ্যাঁ, গাবতলী, মিরপুর, উত্তরা, ধানমন্ডি এবং সাভারসহ প্রধান রুটে বিশ্ববিদ্যালয়ের নিজস্ব পরিবহন সার্ভিস নিয়মিত চলাচল করে।",
    sourceUrl: "https://cityuniversity.ac.bd/transportfacilities",
    source: "official",
  },

  // 6. Campus Facilities
  {
    id: "faq-fac-hostel",
    category: "Campus Facilities",
    question_en: "Are residential hostel accommodations available near the campus?",
    question_bn: "স্থায়ী ক্যাম্পাসের কাছে কি ছাত্র ও ছাত্রীদের জন্য আবাসিক হলের সুবিধা আছে?",
    answer_en:
      "Yes, separate well-secured residential hostel facilities for male and female students are located in close vicinity to the Khagan permanent campus, equipped with meal plans, study halls, and high-speed Wi-Fi.",
    answer_bn:
      "হ্যাঁ, খাগান স্থায়ী ক্যাম্পাসের সন্নিকটে ছাত্র এবং ছাত্রীদের জন্য পৃথক ও নিরাপদ হোস্টেল সুবিধা রয়েছে।",
    sourceUrl: "https://cityuniversity.ac.bd/faq",
    source: "official",
  },
  {
    id: "faq-fac-library",
    category: "Campus Facilities",
    question_en: "What are the Central Library hours and digital resources?",
    question_bn: "সেন্ট্রাল লাইব্রেরির সময়সূচী ও ডিজিটাল সুবিধা কী কী?",
    answer_en:
      "The Central Library is open Saturday through Thursday from 8:30 AM to 5:00 PM. It provides access to thousands of textbook references, quiet study bays, and digital journal databases via https://library.cityuniversity.ac.bd/.",
    answer_bn:
      "সেন্ট্রাল লাইব্রেরি শনিবার থেকে বৃহস্পতিবার সকাল ৮:৩০ থেকে বিকাল ৫:০০ টা পর্যন্ত খোলা থাকে এবং অনলাইন ই-লাইব্রেরি সুবিধা প্রদান করে।",
    sourceUrl: "https://library.cityuniversity.ac.bd/",
    source: "official",
  },

  // 7. Contacts
  {
    id: "faq-contact-official",
    category: "Contacts",
    question_en: "What are the official address and verified hotline telephone numbers?",
    question_bn: "বিশ্ববিদ্যালয়ের অফিসিয়াল ঠিকানা ও হেল্পলাইন নাম্বার কী?",
    answer_en:
      "Permanent Campus: Khagan, Birulia, Savar, Dhaka-1340, Bangladesh. Central IP Telephone: 09643-234234. Mobile Query Lines: +8801322917670, +8801322917671, +8801322917672, +8801322917673. Web: https://cityuniversity.ac.bd/.",
    answer_bn:
      "স্থায়ী ক্যাম্পাস: খাগান, বিরুলিয়া, সাভার, ঢাকা-১৩৪০। সেন্ট্রাল ফোন: ০৯৬৪৩-২৩৪২৩৪। মোবাইল হেল্পলাইন: +৮৮০১৩২২৯১৭৬৭০, +৮৮০১৩২২৯১৭৬৭১।",
    sourceUrl: "https://cityuniversity.ac.bd/",
    source: "official",
  },

  // 8. Rules and Discipline
  {
    id: "faq-rules-committees",
    category: "Rules and Discipline",
    question_en: "What are the university policies regarding harassment and disciplinary matters?",
    question_bn: "যৌন হয়রানি প্রতিরোধ ও ক্যাম্পাস শৃঙ্খলা বিষয়ে বিশ্ববিদ্যালয়ের নীতিমালা কী?",
    answer_en:
      "City University maintains zero tolerance for harassment, bullying, and illicit substances. The university constituted a standing Sexual Harassment Prevention Committee (formed 22 Sep 2026) and an Anti-Drug Vigilance Committee (formed 14 Sep 2026). In addition to filing online complaints through Campus-OS, sensitive matters should also be reported directly to the Proctorial Office or relevant committees.",
    answer_bn:
      "ক্যাম্পাসে যেকোনো ধরনের হয়রানি ও মাদক সম্পূর্ণ নিষিদ্ধ। এ বিষয়ে স্থায়ী যৌন হয়রানি প্রতিরোধ কমিটি এবং মাদক বিরোধী কমিটি কার্যকর রয়েছে। শিক্ষার্থীরা প্রক্টর অফিসে বা ক্যাম্পাসের অনলাইন কমপ্লেইন বক্সে অভিযোগ জানাতে পারেন।",
    sourceUrl: "https://cityuniversity.ac.bd/faq",
    source: "official",
  },
];
