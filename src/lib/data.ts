export const profile = {
  name: "Cortney Bowman",
  firstName: "Cortney",
  lastName: "Bowman",
  title: "AI Engineer",
  subtitle: "Security & Awareness Analyst @ Centene",
  location: "Charlotte Metro, NC",
  email: "cbowman706@gmail.com",
  linkedin: "https://www.linkedin.com/in/cortneybowman",
  github: "https://github.com/CBowman706",
  tagline:
    "Building production-grade AI systems at the intersection of edge inference, LLMs, and security.",
  summary:
    "I design and ship AI systems that run in production. Edge inference on custom hardware, LLM-powered analytics, distributed architectures over local networks, and the observability layer that makes them trustworthy. I build with the OpenAI and Anthropic APIs, run Llama 3.2 locally, and care about the engineering judgment that separates a demo from a system: latency, false-positive tuning, safety, and architecture that holds up under real load. I work fluently with AI tooling — Cursor, Copilot, local LLMs — as a collaborator, not a crutch.",
  summarySecondary:
    "My foundation is unusual on purpose: U.S. Air Force Security Forces veteran, B.S. in Computer Science, M.S. in MIS with an Information Security specialization (4.0 GPA), Microsoft-certified Power BI Data Analyst (PL-300), Microsoft Power Platform Fundamentals (PL-900), AWS Cloud Practitioner, Google Cybersecurity certified, and 5+ years of hands-on threat analysis. That security-first instinct shapes every system I ship.",
  stats: [
    { label: "Years in security & systems", value: "10+" },
    { label: "Graduate GPA", value: "4.0" },
    { label: "Edge AI inference", value: "~100ms" },
    { label: "Production AI surfaces shipped", value: "3+" },
  ],
};

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  location?: string;
  highlights: string[];
  tag: string;
};

export const experience: ExperienceItem[] = [
  {
    company: "Centene Corporation",
    role: "Security & Awareness Analyst",
    period: "Jan 2025 - Present",
    location: "Remote · Charlotte Metro",
    tag: "Current",
    highlights: [
      "Sole data analyst spearheading analytics across the security awareness team. Translate raw security telemetry into Power BI and Power Automate dashboards that surface engagement, compliance, and behavioral-risk metrics for leadership across a workforce of 80,000+.",
      "Co-execute monthly phishing simulation campaigns targeting 80,000+ employees enterprise-wide (KnowBe4). Own campaign telemetry, click-rate analysis, repeat-offender identification, and post-campaign reporting that measurably reduces organizational risk.",
      "Integrate LLM tooling (Microsoft Copilot, Copilot Studio, OpenAI) into security workflows using prompt engineering and structured output extraction to drive compliance insights and analyst efficiency.",
      "Bridge cybersecurity principles with AI development practices. Apply zero-trust thinking and an adversarial mindset to model behavior, prompt injection risks, and responsible AI deployment patterns.",
    ],
  },
  {
    company: "Independent Projects",
    role: "AI Engineer",
    period: "Jan 2025 - Present",
    location: "Self-directed",
    tag: "Building",
    highlights: [
      "Architected and deployed FameAILab, a fully local edge AI security platform. Reolink PoE camera, Raspberry Pi 5, Hailo-8 NPU running YOLOv8s at 25fps with ~100ms inference. GStreamer pipeline, SQLite logging, Flask REST API (9 endpoints), Telegram alerts, systemd services.",
      "Built distributed two-Pi architecture over LAN. Inference node serves a detection API consumed by a separate Ollama (Llama 3.2) and SOC dashboard node. Zero cloud dependency, zero exfiltration.",
      "Engineered false-positive tuning v2: 3-of-5 frame persistence buffer, dynamic confidence thresholds, alert cooldown logic, and ROI masking infrastructure. Moved the system from prototype noise to production-grade signal.",
      "Developing RAG pipelines (Chroma, FAISS), agentic workflows (OpenAI Agents SDK, CrewAI, LangGraph), and AI-native React dashboards for security operations.",
    ],
  },
  {
    company: "Karats and Company LLC",
    role: "Corporate Tech Support Specialist",
    period: "Dec 2023 - Dec 2024",
    location: "Charlotte, NC",
    tag: "1 yr",
    highlights: [
      "Provided network security support including incident response and vulnerability analysis across cloud infrastructure and a distributed endpoint fleet.",
      "Built and automated troubleshooting tools that resolved 90%+ of support inquiries on first contact. Reduced ticket volume and demonstrated early instincts for automation.",
      "Collaborated cross-functionally to identify and mitigate threats. The kind of cross-disciplinary work that defines modern AI and security teams.",
    ],
  },
  {
    company: "Vector Fleet Management, LLC",
    role: "HR Generalist / Information Systems Specialist",
    period: "Jan 2020 - Aug 2023",
    location: "Charlotte, NC",
    tag: "3.5 yrs",
    highlights: [
      "Designed and maintained large-scale data storage systems for high-volume operational data. Built the data architecture instincts that translate directly to vector databases and AI retrieval pipelines.",
      "Led a company-wide data visualization overhaul in Tableau, creating interactive dashboards that cut analysis time by 20% and accelerated decision-making across departments.",
      "Operated independently on complex technical and organizational problems, demonstrating the self-direction essential for AI engineering work.",
    ],
  },
  {
    company: "United States Air Force",
    role: "Security Forces Specialist",
    period: "Nov 2005 - Aug 2010",
    location: "Active Duty · Veteran",
    tag: "5 yrs",
    highlights: [
      "Trained and operated under high-stakes, mission-critical conditions. The foundation for the discipline, threat-modeling instinct, and adversarial mindset I apply to AI system design today.",
    ],
  },
];

export type ProjectItem = {
  title: string;
  description: string;
  tags: string[];
  status: "Live" | "In Progress" | "Coming Soon";
  href?: string;
  metric?: string;
};

export const projects: ProjectItem[] = [
  {
    title: "Agentic Phishing Triage System",
    description:
      "LangGraph-orchestrated multi-agent pipeline that ingests a raw email and returns a 0–100 risk score with a plain-language verdict. Specialized agents handle header forensics (SPF/DKIM/DMARC), social-engineering analysis, and verdict synthesis. Cleanly separated phishing from legitimate mail (99/97 malicious vs. 5/4 benign) and caught a BEC gift-card scam that passed email authentication — proving content analysis matters alongside headers. Built with explicit data/instruction separation as an adversarial-security design.",
    tags: ["LangGraph", "Multi-Agent", "Claude", "OpenRouter", "Python"],
    status: "Live",
    href: "https://github.com/CBowman706/agentic-phishing-triage",
    metric: "99 vs 5",
  },
  {
    title: "Edge AI Home Security Platform",
    description:
      "Production-grade surveillance running entirely on local hardware. Reolink PoE camera streams into a Raspberry Pi 5 and Hailo-8 NPU executing YOLOv8s at 25fps with ~100ms inference. GStreamer pipeline, SQLite event logging, Flask REST API (9 endpoints), Telegram alerts, and systemd services. Tuned with persistence buffers and ROI masking to suppress false positives.",
    tags: ["YOLOv8", "Hailo-8 NPU", "GStreamer", "Flask", "systemd"],
    status: "Live",
    metric: "25 fps · 100ms",
  },
  {
    title: "Distributed Two-Pi AI Architecture",
    description:
      "Edge system over LAN. Pi #1 handles inference and serves a detection API. Pi #2 runs Ollama (Llama 3.2) and a SOC-themed dashboard consuming that API. Fully on-device with zero cloud dependency and zero exfiltration.",
    tags: ["Edge AI", "Ollama", "Llama 3.2", "REST", "LAN"],
    status: "Live",
    metric: "0 cloud calls",
  },
  {
    title: "SOC Security Dashboard",
    description:
      "Security Operations Center-style monitoring console with a dark theme, real-time KPI tiles, Plotly visualizations, modal AI assistant, and forensic history view. Streamlit MVP shipped on Pironman Pi; React/JSX migration in flight for production polish via Netlify.",
    tags: ["Streamlit", "React", "Plotly", "SOC"],
    status: "Live",
    metric: "Real-time",
  },
  {
    title: "Conversational AI Security Analyst",
    description:
      "Local Llama 3.2 wired to a context-injection pipeline that feeds live detection stats. Enables natural-language queries about security data entirely on-device.",
    tags: ["Llama 3.2", "Context Injection", "On-device"],
    status: "Live",
    metric: "Zero exfil",
  },
  {
    title: "LLM API Engineering",
    description:
      "Active development against the OpenAI and Anthropic APIs. Structured outputs, prompt engineering, agentic workflows, and the production patterns that take a prototype to a system you can trust.",
    tags: ["OpenAI", "Anthropic", "Structured Outputs"],
    status: "Live",
  },
  {
    title: "Agentic AI Engineering",
    description:
      "Multi-agent systems built with the OpenAI Agents SDK, CrewAI, LangGraph, and AutoGen. Includes a Deep Research agent and a 4-agent engineering team coordinating real work.",
    tags: ["Agents SDK", "CrewAI", "LangGraph", "AutoGen"],
    status: "In Progress",
  },
  {
    title: "RAG Pipelines",
    description:
      "Vector database integration (Chroma, FAISS) for context-aware AI applications. Chunking, embedding strategy, retrieval evaluation, and the observability layer to keep it honest.",
    tags: ["Chroma", "FAISS", "Embeddings"],
    status: "In Progress",
  },
  {
    title: "GRIND - AI-Powered Wellness PWA",
    description:
      "React/JSX progressive web app integrating WHOOP biometric data via OAuth2. Real-time sync of Recovery, HRV, RHR, Strain, Sleep, and Calories with a conversational wellness assistant. Deployed to Netlify.",
    tags: ["React", "WHOOP API", "OAuth2", "PWA"],
    status: "Live",
    href: "https://getgrind.netlify.app",
  },
  {
    title: "The Grail CLT - AI Sneaker Valuation",
    description:
      "React-based pricing platform for the sneaker collecting community. AI valuation engine and market trend analysis with an editorial dark aesthetic.",
    tags: ["React", "AI Pricing", "Netlify"],
    status: "In Progress",
  },
  {
    title: "cortneybowman.dev — AI-Assisted Portfolio",
    description:
      "This site. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS — engineered through human-AI collaboration in Cursor. Demonstrates the working pattern I apply across every project: clear architectural intent, AI as implementation partner, human judgment on the bar for production quality. Deployed via continuous integration.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind", "Cursor"],
    status: "Live",
    href: "https://cortneybowman.dev",
  },
  {
    title: "Security x AI Research",
    description:
      "Cybersecurity lens applied to AI: prompt injection, adversarial vision attacks against the YOLOv8 pipeline I run in production, and secure LLM deployment patterns. Backed by 5+ years of threat analysis experience.",
    tags: ["Prompt Injection", "Adversarial ML", "AppSec"],
    status: "Live",
  },
];

export const skills = [
  {
    category: "AI / ML",
    items: [
      "OpenAI API",
      "Anthropic API",
      "Llama 3.2 (Ollama)",
      "YOLOv8",
      "Hailo-8 NPU",
      "GStreamer",
      "RAG (Chroma, FAISS)",
      "Agentic Workflows",
      "Prompt Engineering",
      "Adversarial ML",
    ],
  },
  {
    category: "Engineering",
    items: [
      "Python",
      "TypeScript / React",
      "Next.js",
      "Flask REST APIs",
      "SQLite",
      "systemd",
      "Linux",
      "Git / GitHub",
      "Netlify",
    ],
  },
  {
    category: "Data & Analytics",
    items: [
      "Microsoft Power BI",
      "Power Automate",
      "Microsoft Copilot",
      "Copilot Studio",
      "Tableau",
      "Plotly",
      "Streamlit",
      "Vector DBs",
    ],
  },
  {
    category: "Security",
    items: [
      "Threat Detection",
      "SIEM",
      "MITRE ATT&CK",
      "Zero Trust",
      "Incident Response",
      "Vulnerability Analysis",
      "Phishing Simulation",
    ],
  },
];

export const education = [
  {
    school: "Keller Graduate School of Management - DeVry University",
    degree: "M.S. Management Information Systems",
    focus: "Information Security Specialization · 4.0 GPA",
    period: "Sept 2024",
  },
  {
    school: "DeVry University",
    degree: "B.S. Computer & Information Sciences",
    focus: "Software, systems, and applied development",
    period: "Jan 2020 - Aug 2023",
  },
  {
    school: "CodePath",
    degree: "Certificate in Cybersecurity",
    focus: "Hands-on offensive & defensive fundamentals",
    period: "Feb - May 2024",
  },
];

export const certifications = [
  "Microsoft Certified - Power BI Data Analyst Associate (PL-300)",
  "Microsoft Certified - Power Platform Fundamentals (PL-900)",
  "AWS Cloud Practitioner",
  "Google Cybersecurity Certificate",
  "MITRE ATT&CK",
  "Foundations of Cybersecurity",
  "Introduction to Software, Programming & Databases",
  "Tools of the Trade: Linux & SQL",
  "Information Technology Fundamentals",
];

export const honors = [
  "Alpha Chi National Honor Society",
  "Delta Mu Delta International Honor Society",
  "PMI Member",
  "DeVry Cultural Inclusion Badge",
];
