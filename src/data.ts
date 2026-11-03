export const PROFILE = {
  name: 'Hari Haran V', first: 'HARIHARAN', location: 'Chengalpattu, Tamil Nadu, India',
  email: 'vengla2006@gmail.com',
  linkedin: 'https://linkedin.com/in/hari-haran-687956331',
  github: '' as string, // add the verified GitHub profile URL here; links are hidden while empty
  resume: './resume.pdf',
  role: 'AI & Data Science Undergraduate | AI Engineer | Machine Learning & Full-Stack Developer',
  leadership: 'Founder & CEO, YKNOT',
  education: 'B.Tech in Artificial Intelligence and Data Science, SRM Valliammai Engineering College, Class of 2028',
  cgpa: '8.7/10',
  positioning: 'AI & Data Science undergraduate who builds AI systems people can trust: explainable, secure, and useful beyond the notebook.',
  tagline: ['Building AI systems that think, explain, and protect.', 'Turning complex problems into intelligent products.', 'From machine learning to real-world impact.'],
  manifesto: "I don't build AI just to make it work. I build systems people can trust. From autonomous energy grids to intelligent security and healthcare, my focus is on turning complex problems into explainable, secure, and meaningful technology. Every idea deserves to become something real.",
  manifestoKeys: ['trust.', 'explainable,', 'secure,', 'meaningful', 'real.'],
}
export const STATS = [
  { label: 'CGPA', value: '8.7', suffix: '/10' },
  { label: 'AI/ML projects', value: '7', suffix: '+' },
  { label: 'National hackathon first prizes', value: '2', suffix: '×' },
]
export type Project = { n: string; name: string; sub: string; cat: string; desc: string; chips: string[]; kind: 'grid' | 'heat' | 'shield'; link?: string }
export const PROJECTS: Project[] = [
  { n: '01', name: 'GRIDPULSE AI', sub: 'Autonomous Multi-Agent Smart Grid Orchestrator', cat: 'Multi-Agent AI / Energy Intelligence', desc: 'An autonomous multi-agent platform that monitors, forecasts, and rebalances distributed energy grids in real time.', chips: ['Multi-Agent AI', 'Forecasting', 'Digital Twin', 'Explainable AI'], kind: 'grid' },
  { n: '02', name: 'SIFT', sub: 'Security Intelligence Filtering & Triage', cat: 'Cybersecurity / Vulnerability Intelligence', desc: 'Turns thousands of public CVEs into five personalised, ranked, explainable security actions for small organisations.', chips: ['Cybersecurity', 'CVE Data', 'Risk Scoring', 'Explainable AI'], kind: 'heat' },
  { n: '03', name: 'DOUBLE SIFT', sub: 'Structural Integrity & Flow Tracking', cat: 'AI Security / Prompt-Injection Defence', desc: 'A structural firewall that protects AI email agents from indirect prompt injection by tracking instruction provenance and plan drift.', chips: ['AI Security', 'Prompt Injection', 'Agent Firewall', 'Provenance Tracking'], kind: 'shield' },
]
export const MORE_PROJECTS = ['MediconSolv — Prescription Consolidation System', 'RAG Document & YouTube Assistant — Semantic Search Tool', 'Burnout Guardian — Employee Wellness Prediction', 'Smart Retail Analytics — Market Basket Analysis', 'RentFlow — Rental Management SaaS', 'Alumni Connect — Alumni-Student Networking Platform', 'Student Performance Prediction', 'Aura Jewellery — AI-enabled Jewellery E-commerce Platform']
export const JOURNEY = [
  { year: '2026', title: 'Student Intern, Skill Ladders', meta: 'Apr – Oct 2026 · AI & ML training, certified with Kshitij 2026, IIT Kharagpur' },
  { year: '2024–Present', title: 'NSS Volunteer and Student Leader', meta: '200+ service hours · 1 of 10 students representing Anna University at the State-Level NSS Special Camp' },
  { year: '2024–2028', title: 'B.Tech Artificial Intelligence and Data Science', meta: 'SRM Valliammai Engineering College · CGPA 8.7/10' },
]
export const YEAR_FROM = 2024, YEAR_TO = 2028
export const SKILLS = ['Python', 'C++', 'JavaScript', 'React.js', 'Machine Learning', 'Generative AI', 'LLMs', 'RAG', 'LangChain', 'Scikit-learn', 'FastAPI', 'Node.js', 'MongoDB', 'FAISS', 'ChromaDB', 'Explainable AI']
export const COUNTERS = [
  { to: 2, suffix: '×', label: 'National Hackathon First Prizes' },
  { to: 1, suffix: '×', label: 'National Hackathon Runner-up' },
  { to: 7, suffix: '+', label: 'AI/ML Projects' },
  { to: 8.7, suffix: '/10', label: 'CGPA', dec: 1 },
]
export const AWARDS = [
  'Neurobots National Level Hackathon 2026 — 1st Prize, ₹1,00,000 (IES College of Engineering, Thrissur)',
  'FORGEX AI National Level Hackathon 2026 — 1st Prize; internship offers from three companies',
  'NEXORA National Hackathon 2026 — 2nd Prize, Cyber Security Track (HackHere, SNS iHub Coimbatore)',
  "MyBharat National Budget Quest 2026 — Final Winner; direct interaction with the Hon'ble Prime Minister of India",
  'Anna University State-Level NSS Special Camp — Selected among 10 students',
]
export const CERTS = [
  { t: 'GenAI Powered Data Analytics Job Simulation', by: 'Tata · Oct 2026' },
  { t: 'Artificial Intelligence and Machine Learning', by: 'Skill Ladders × Kshitij 2026, IIT Kharagpur · Oct 2026' },
  { t: 'Generative AI Engineering: Foundations, RAG & Deployment', by: 'HCL GUVI · 2026' },
  { t: 'The AI Skills You Need to Stay Relevant in the Next 2 Years', by: 'WSCUBE TECH · 2026' },
  { t: 'Introduction to Cloud Computing', by: 'SkillUp · 2026' },
]
export const LEADERSHIP = ['Founder & CEO — YKNOT Technical Hackathon Club', 'College Host — SRM VEC College Day 2026 (1,000+ attendees, 50+ announcements, 20+ faculty & performers)', 'College Coordinator — SRM TamilPerayam', 'NSS Volunteer — 200+ service hours']
export const LINKS = () => [
  ...(PROFILE.github ? [{ label: 'GitHub', href: PROFILE.github, cur: 'Open' }] : []),
  { label: 'LinkedIn', href: PROFILE.linkedin, cur: 'Open' },
  { label: 'Résumé', href: PROFILE.resume, cur: 'PDF', dl: true },
]
