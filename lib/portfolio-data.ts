export const socials = {
  github: "https://github.com/MukundGarg",
  linkedin: "https://www.linkedin.com/in/mukund-garg-8018a7377/",
  email: "mailto:gargmukund774@gmail.com",
  resume: "/Mukund_Garg_Resume.pdf",
};

export const projects = [
  {
    title: "MailPilot",
    kicker: "Workflow automation",
    description:
      "A Gmail outreach engine I built after hitting reliability limits with Mailmeteor during my Iqlipse internship. It handles personalized campaigns, scheduling, threaded follow-ups, reply detection, and Sheets sync.",
    metrics: ["3 ingestion modes", "4 follow-ups", "2 duplicate modes"],
    stack: ["Python", "FastAPI", "Pydantic", "Gmail API", "Google OAuth", "Google Sheets API"],
    github: "https://github.com/MukundGarg/Mail_meteor_clone",
    live: null,
    featured: true,
  },
  {
    title: "StockSense AI",
    kicker: "Applied AI + computer vision",
    description:
      "A deployed financial-analysis platform with two inference paths: LLM-powered report analysis and OpenCV-based stock-chart pattern recognition.",
    metrics: ["2 AI workflows", "2 LLM providers", "9 chart patterns"],
    stack: ["Python", "FastAPI", "OpenCV", "Gemini", "Groq", "Vercel"],
    github: "https://github.com/MukundGarg/StockSense-Ai",
    live: "https://ai-stock-analysis-orpin.vercel.app/",
    featured: true,
  },
  {
    title: "Offline ISL Translator",
    kicker: "On-device computer vision",
    description:
      "A real-time Android Indian Sign Language translator that runs fully offline from live camera input with stabilization logic and CPU/GPU delegate support.",
    metrics: ["32 gesture outputs", "26 alphabet signs", "6 fixed words"],
    stack: ["Android", "Computer Vision", "On-device AI", "Camera Inference"],
    github: "https://github.com/MukundGarg/ISL-Sign-Language-Translator",
    live: null,
    featured: false,
  },
] as const;

export const skillGroups = [
  {
    label: "Machine Learning",
    items: ["NumPy", "Pandas", "Scikit-learn", "XGBoost", "PCA", "Clustering", "Model Evaluation"],
  },
  {
    label: "Deep Learning",
    items: ["PyTorch", "CNN", "RNN", "LSTM", "GRU", "Transfer Learning", "Autograd"],
  },
  {
    label: "NLP / Transformers",
    items: ["TF-IDF", "Word2Vec", "Seq2Seq", "Attention", "Self-Attention", "Transformers"],
  },
  {
    label: "Backend / Systems",
    items: ["FastAPI", "Pydantic", "REST APIs", "Docker", "Git", "Google OAuth", "Gmail API"],
  },
  {
    label: "Computer Vision",
    items: ["OpenCV", "Image Processing", "ROI", "Video Frames", "CNN Vision", "On-device AI"],
  },
  {
    label: "Web",
    items: ["JavaScript", "HTML", "CSS", "Vercel", "API Integration"],
  },
] as const;

export const experience = {
  company: "Iqlipse",
  role: "Operations & Workflow Automation Intern",
  period: "Jul 2026 — Aug 2026",
  location: "Remote",
  bullets: [
    "Managed employer outreach, application tracking, database updates, interview scheduling, and client communication across active job-search pipelines.",
    "Built MailPilot locally to automate repetitive personalized outreach after identifying reliability limits in the existing Mailmeteor workflow.",
    "Converted an operations pain point into a working software system using FastAPI, Gmail APIs, OAuth, scheduling, and background processing.",
  ],
};

export const education = [
  {
    school: "Maharaja Surajmal Institute of Technology",
    degree: "B.Tech — Electronics & Communication Engineering",
    period: "2025 — 2029",
    meta: "First-year CGPA 8.82 / 10",
  },
  {
    school: "Bal Bharati Public School, Old Rajinder Nagar",
    degree: "Senior Secondary Education",
    period: "New Delhi",
    meta: "Class XII 91% • Class X 94.2%",
  },
] as const;

export const leadership = [
  {
    role: "Deputy Head — AI/ML Department",
    org: "Microsoft Student Chapter, MSIT",
    period: "Aug 2026 — Present",
    previous: "AI/ML Department Member • Sep 2025 — Aug 2026",
  },
  {
    role: "PR & Sponsorship Head",
    org: "e-Yantra Robotics Club",
    period: "Aug 2026 — Present",
    previous: "PR & Sponsorship Member • Sep 2025 — Aug 2026",
  },
] as const;
