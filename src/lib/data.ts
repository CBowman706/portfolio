export const profile = {
  name: "Cortney Bowman",
  firstName: "Cortney",
  lastName: "Bowman",
  title: "AI Engineer (Emerging)",
  subtitle: "Security & Awareness Analyst @ Centene",
  location: "Charlotte Metro, NC",
  email: "cbowman706@gmail.com",
  linkedin: "https://www.linkedin.com/in/cortneybowman",
  github: "https://github.com/",
  tagline:
    "Building toward production-grade AI systems at the intersection of LLMs, retrieval, and security.",
  summary:
    "I'm building toward a career at the frontier of AI engineering — focused on LLM application development, retrieval-augmented generation (RAG), and the MLOps infrastructure that takes a system from demo to production. I build with the OpenAI and Anthropic APIs and care about what it takes to actually ship: latency, observability, safety, and architecture that holds up under real load.",
  summarySecondary:
    "My foundation is unusual on purpose: U.S. Air Force Security Forces veteran, B.S. in Computer Science, M.S. in MIS with an Information Security specialization (4.0 GPA), AWS Cloud Practitioner, Google Cybersecurity certified, and hands-on experience in Python, SIEM, and threat detection. That security-first instinct shapes every system I ship.",
  stats: [
    { label: "Years in security & systems", value: "10+" },
    { label: "Graduate GPA", value: "4.0" },
    { label: "Edge AI inference", value: "~100ms" },
    { label: "First-contact resolution", value: "90%+" },
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
    period: "Jan 2025 — Present",
    location: "Remote · Charlotte Metro",
    tag: "Current",
    highlights: [
      "Sole data analyst on the security awareness team — translate raw security telemetry into Power BI and Power Automate dashboards that surface engagement, compliance, and behavioral-risk metrics for leadership across a workforce of 80,000+.",
      "Co-execute monthly phishing simulation campaigns targeting 80,000+ employees enterprise-wide (KnowBe4) — own campaign telemetry, click-rate analysis, repeat-offender identification, and post-campaign reporting that measurably reduces organizational risk.",
      "Integrate LLM tooling — Microsoft Copilot, Copilot Studio, OpenAI — into security workflows using prompt engineering and structured output extraction to drive compliance insights and analyst efficiency.",
    ],
  },
  {
    company: "Independent Projects",
    role: "AI Engineer",
    period: "Jan 2025 — Present",
    location: "Self-directed",
    tag: "Building",
    highlights: [
      "Shipping production-grade edge AI: Reolink PoE camera → Raspberry Pi 5 + Hailo-8 NPU running YOLOv8s at 25fps, ~100ms inference, GStreamer pipeline, SQLite logging, Flask REST API, Telegram alerts, systemd services.",
      "Built a distributed two-Pi architecture over LAN — inference node serves a detection API consumed by an Ollama (Llama 3.2) + SOC dashboard node. Zero cloud dependency.",
      "Developing RAG pipelines (Chroma, FAISS), agentic workflows (OpenAI Agents SDK, CrewAI, LangGraph), and AI-native React dashboards for security operations.",
    ],
  },
  {
    company: "Karats and Company LLC",
    role: "Corporate Tech Support Specialist",
    period: "Dec 2023 — Dec 2024",
    location: "Charlotte, NC",
    tag: "1 yr",
    highlights: [
      "Provided network security support including incident response and vulnerability analysis across cloud infrastructure and a distributed endpoint fleet.",
      "Built and automated troubleshooting tools that resolved 90%+ of support inquiries on first contact — reducing ticket volume and demonstrating early instincts for automation.",
      "Collaborated cross-functionally to identify and mitigate threats — the kind of cross-disciplinary work that defines modern AI and security teams.",
    ],
  },
  {
    company: "Vector Fleet Management, LLC",
    role: "HR Generalist / Information Systems Specialist",
    period: "Jan 2020 — Aug 2023",
    location: "Charlotte, NC",
    tag: "3.5 yrs",
    highlights: [
      "Designed and maintained large-scale data storage systems for high-volume operational data — building the data architecture instincts that translate directly to vector databases and AI retrieval pipelines.",
      "Led a company-wide data visualization overhaul in Tableau, creating interactive dashboards that cut analysis time by 20% and accelerated decision-making across departments.",
      "Operated independently on complex technical and organizational problems, demonstrating the self-direction essential for AI engineering work.",
    ],
  },
  {
    company: "United States Air Force",
    role: "Security Forces Specialist",
    period: "Nov 2005 — Aug 2010",
    location: "Active Duty · Veteran",
    tag: "5 yrs",
    highlights: [
      "Trained and operated under high-stakes, mission-critical conditions — the foundation for the discipline, threat-modeling instinct, and adversarial mindset I apply to AI system design today.",
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
    title: "Edge AI Home Security Platform",
    description:
      "Production-grade surveillance running entirely on local hardware. Reolink PoE camera streams into a Raspberry Pi 5 + Hailo-8 NPU executing YOLOv8s at 25fps with ~100ms inference. GStreamer pipeline, SQLite event logging, Flask REST API (9 endpoints), Telegram alerts, and systemd services.",
    tags: ["YOLOv8", "Hailo-8 NPU", "GStreamer", "Flask", "systemd"],
    status: "Live",
    metric: "25 fps · 100ms",
  },
  {
    title: "Distributed Two-Pi AI Architecture",
    description:
      "Edge system over LAN. Pi #1 handles inference and serves a detection API. Pi #2 runs Ollama (Llama 3.2) and a SOC-themed dashboard consuming that API. Fully on-device — zero cloud dependency, zero exfiltration.",
    tags: ["Edge AI", "Ollama", "Llama 3.2", "REST", "LAN"],
    status: "Live",
    metric: "0 cloud calls",
  },
  {
    title: "SOC Security Dashboard",
    description:
      "Security Operations Center-style monitoring console with a dark theme, real-time KPI tiles, Plotly visualizations, modal AI assistant, and forensic history view. Streamlit MVP shipped; React/JSX migration in flight for production polish.",
    tags: ["Streamlit", "React", "Plotly", "SOC"],
    status: "Live",
    metric: "Real-time",
  },
  {
    title: "Conversational AI Security Analyst",
    description:
      "Local Llama 3.2 wired to a context-injection pipeline that feeds live detection stats — enabling natural-language queries like \"How active has the dog been?\" entirely on-device.",
    tags: ["Llama 3.2", "Context Injection", "On-device"],
    status: "Live",
    metric: "Zero exfil",
  },
  {
    title: "LLM API Engineering",
    description:
      "Active development against the OpenAI and Anthropic APIs — structured outputs, prompt engineering, agentic workflows, and the production patterns that take a prototype to a system you can trust.",
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
      "Vector database integration (Chroma, FAISS) for context-aware AI applications — chunking, embedding strategy, retrieval evaluation, and the observability layer to keep it honest.",
    tags: ["Chroma", "FAISS", "Embeddings"],
    status: "In Progress",
  },
  {
    title: "Front-End Engineering for AI",
    description:
      "React/JSX work from GRIND (a WHOOP OAuth2 wellness PWA) and The Grail CLT (AI sneaker valuation) — applied to AI-native dashboards. Real product surfaces, real auth flows, real data — not toy demos.",
    tags: ["React", "JSX", "OAuth2", "PWA"],
    status: "Live",
  },
  {
    title: "Security × AI Research",
    description:
      "Cybersecurity lens applied to AI: prompt injection, adversarial vision attacks, secure LLM deployment patterns. Backed by 5+ years of threat analysis experience.",
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
      "RAG (Chroma, FAISS)",
      "Agentic Workflows",
      "Prompt Engineering",
    ],
  },
  {
    category: "Engineering",
    items: [
      "Python",
      "TypeScript / React",
      "Flask REST APIs",
      "GStreamer",
      "SQLite",
      "systemd",
      "Linux",
      "Git / GitHub",
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
      "Adversarial ML",
    ],
  },
  {
    category: "Cloud & Data",
    items: [
      "AWS Cloud Practitioner",
      "Tableau",
      "Plotly",
      "Streamlit",
      "Vector DBs",
    ],
  },
];

export const education = [
  {
    school: "Keller Graduate School of Management — DeVry University",
    degree: "M.S. Management Information Systems",
    focus: "Information Security Specialization · 4.0 GPA",
    period: "Sept 2024",
  },
  {
    school: "DeVry University",
    degree: "B.S. Computer & Information Sciences",
    focus: "Software, systems, and applied development",
    period: "Jan 2020 — Aug 2023",
  },
  {
    school: "CodePath",
    degree: "Certificate in Cybersecurity",
    focus: "Hands-on offensive & defensive fundamentals",
    period: "Feb — May 2024",
  },
];

export const certifications = [
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
