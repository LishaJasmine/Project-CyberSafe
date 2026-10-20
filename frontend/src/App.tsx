import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import { api, Incident, IncidentStatus, IncidentType } from "./api";

const topics = [
  { title: "Phishing", icon: "🎣", summary: "Fake messages and websites try to trick you into sharing information.", risks: "Account takeover, stolen payment details, identity misuse.", tips: ["Check the sender and full URL carefully.", "Do not open unexpected attachments or sign-in links.", "Visit services through their official app or typed address."] },
  { title: "Password Security", icon: "🔑", summary: "Weak or reused passwords make accounts easier to compromise.", risks: "One leaked password may expose several accounts.", tips: ["Use a unique password for every important account.", "Use a reputable password manager.", "Enable multi-factor authentication where available."] },
  { title: "Online & UPI Scams", icon: "💸", summary: "Scammers may impersonate support staff, buyers, sellers or payment services.", risks: "Unauthorized transfers and financial loss.", tips: ["Never share your UPI PIN or OTP.", "You generally enter a UPI PIN to send money, not receive it.", "Verify payment status in your own banking app."] },
  { title: "Identity Theft", icon: "🪪", summary: "Someone uses personal details without permission.", risks: "Fraudulent accounts, impersonation and privacy harm.", tips: ["Share personal data only when necessary.", "Review account alerts and statements.", "Secure lost devices and report suspicious activity."] },
  { title: "Social Engineering", icon: "🧠", summary: "A person uses trust, urgency or fear to influence you into unsafe actions.", risks: "Disclosure of confidential information or payments.", tips: ["Pause when a request feels urgent or secretive.", "Verify unusual requests using another trusted channel.", "Do not install remote-access apps at a stranger's request."] },
  { title: "Malware", icon: "🦠", summary: "Malicious software can spy, disrupt devices or steal data.", risks: "Data loss, privacy compromise and account theft.", tips: ["Install apps from trusted sources.", "Keep your OS and apps updated.", "Avoid unexpected downloads and pirated software."] },
  { title: "Public Wi-Fi", icon: "📶", summary: "Open networks may expose traffic or lead users to fake hotspots.", risks: "Privacy risks and unsafe login pages.", tips: ["Prefer mobile data for sensitive transactions.", "Use HTTPS and turn off auto-join.", "Avoid ignoring certificate or browser warnings."] },
  { title: "Online Shopping Scams", icon: "🛍️", summary: "Fake stores and deals can collect money or personal details.", risks: "Non-delivery, counterfeit goods and payment fraud.", tips: ["Check seller reputation and return policies.", "Be cautious of prices that seem unrealistically low.", "Use safer payment methods and keep receipts."] }
];

const quiz = [
  { q: "A message says your bank account will close in 10 minutes unless you click a link. What should you do?", options: ["Click immediately", "Use the official bank app or contact channel to verify", "Reply with your OTP"], answer: 1, why: "Urgency is a common social-engineering tactic. Verify independently." },
  { q: "Which password practice is safer?", options: ["Reuse one password everywhere", "Use a unique password for each account", "Use your birth date"], answer: 1, why: "Unique passwords reduce the impact of a single account breach." },
  { q: "Someone asks for your UPI PIN to send you money. What is safest?", options: ["Share it", "Enter it into their link", "Never share it; verify payment in your app"], answer: 2, why: "Your UPI PIN is confidential and should never be shared." },
  { q: "What does HTTPS alone prove about a website?", options: ["It is definitely legitimate", "The connection is encrypted, not that the site is trustworthy", "It contains no malware"], answer: 1, why: "Scam websites can also use HTTPS." },
  { q: "What should you do with an unexpected attachment?", options: ["Open it to check", "Forward it to friends", "Verify the sender and context first"], answer: 2, why: "Unexpected attachments may contain malicious content." },
  { q: "What adds an extra layer beyond a password?", options: ["Multi-factor authentication", "A public profile", "Reusing a password"], answer: 0, why: "MFA requires another proof of identity." }
];

function Header() {
  const links = [["/", "Home"], ["/awareness", "Awareness"], ["/link-checker", "Link Checker"], ["/report", "Report Incident"], ["/quiz", "Quiz"], ["/self-check", "Self-Check"], ["/admin", "Admin"]];
  return <header className="header"><Link to="/" className="brand"><span className="brand-icon">🛡️</span><span>Cyber<span className="accent">Safe</span><small>STAY AWARE. STAY SECURE.</small></span></Link><nav>{links.map(([to, label]) => <NavLink key={to} to={to} end={to === "/"}>{label}</NavLink>)}</nav></header>;
}
function Footer() { return <footer>🛡️ CyberSafe <span>Learn smart. Browse safe. Report responsibly.</span></footer>; }
function Shell({ children }: { children: React.ReactNode }) { return <><Header/><main>{children}</main><Footer/></>; }
function PageTitle({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) { return <div className="page-title"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{desc}</p></div>; }

function Home() {
  return <><section className="hero"><div className="hero-copy"><span className="eyebrow">YOUR DIGITAL SAFETY STARTS HERE</span><h1>Be cyber smart.<br/><span className="gradient-text">Stay one step ahead.</span></h1><p>Learn to recognize online threats, check suspicious links, and report cyber incidents with confidence.</p><div className="actions"><Link className="btn primary" to="/awareness">Explore awareness ↗</Link><Link className="btn secondary" to="/report">Report an incident</Link></div><div className="hero-note">🔒 Think before you click. Verify before you trust.</div></div><div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="shield">🛡️</div><div className="float-card card-top">✓ Safer browsing</div><div className="float-card card-bottom">⌁ Threat awareness</div></div></section>
  <section className="section"><div className="section-heading"><div><span className="eyebrow">EXPLORE CYBERSAFE</span><h2>Your digital safety toolkit</h2></div><p>Practical tools and guidance for everyday online life.</p></div><div className="feature-grid">
  {[
    ["📚","Cybersecurity Awareness","Learn how common threats work and how to avoid them.","/awareness"],
    ["🔗","Link Checker","Review URL signals with an educational risk heuristic.","/link-checker"],
    ["🚨","Report an Incident","Record a cyber incident for the demo admin dashboard.","/report"],
    ["🧠","Knowledge Quiz","Test your cyber-safety knowledge and learn from answers.","/quiz"],
    ["🛡️","Security Self-Check","Reflect on everyday account and device security habits.","/self-check"],
    ["📊","Admin Dashboard","Review demo incident reports and manage their status.","/admin"]
  ].map(([icon,title,desc,to])=><Link to={to} className="feature-card" key={title}><span className="feature-icon">{icon}</span><h3>{title}</h3><p>{desc}</p><span className="card-link">Explore feature ↗</span></Link>)}</div></section>
  <section className="callout"><div><span className="eyebrow">PAUSE. CHECK. PROTECT.</span><h2>One careful click can make a difference.</h2><p>Build small security habits that protect your accounts, devices and personal information.</p></div><Link to="/self-check" className="btn primary">Check my habits ↗</Link></section>
  <section className="threat-strip"><h2>Know the warning signs</h2>{["Unexpected urgency","Requests for OTPs or PINs","Unusual sender addresses","Deals that seem too good","Links with misspellings"].map(x=><span key={x}>✦ {x}</span>)}</section></>;
}

function Awareness() {
  const [filter,setFilter] = useState("");
  const filtered = topics.filter(t => t.title.toLowerCase().includes(filter.toLowerCase()));
  return <><PageTitle eyebrow="LEARN & PREVENT" title="Cybersecurity awareness" desc="Understand common online threats and the practical steps that help you stay safer."/><div className="search-row"><input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search topics…"/></div><div className="topic-grid">{filtered.map(t=><article className="topic-card" key={t.title}><span className="feature-icon">{t.icon}</span><h2>{t.title}</h2><p>{t.summary}</p><div className="risk-note"><b>Common risks</b><p>{t.risks}</p></div><b>Safety tips</b><ul>{t.tips.map(tip=><li key={tip}>{tip}</li>)}</ul></article>)}</div></>;
}

function checkUrl(raw: string) {
  let url: URL;
  try { url = new URL(/^https?:\/\//i.test(raw.trim()) ? raw.trim() : `https://${raw.trim()}`); }
  catch { return { level: "Invalid URL", points: 100, reasons: ["Enter a valid website URL, such as example.com."] }; }
  const host = url.hostname.toLowerCase();
  const reasons: string[] = [];
  let points = 0;
  if (url.protocol !== "https:") { points += 2; reasons.push("The URL does not use HTTPS."); }
  else reasons.push("The URL uses HTTPS, but this alone does not prove legitimacy.");
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) { points += 3; reasons.push("The host is an IP address instead of a typical domain name."); }
  if (/(login|verify|account|secure|update|wallet|gift|free|urgent|password|banking|bonus|claim)/i.test(raw)) { points += 2; reasons.push("The URL contains words often used in deceptive links. Legitimate sites may use them too."); }
  if (raw.length > 100) { points += 1; reasons.push("The URL is unusually long."); }
  if (/[打а-я]|%40|@|%2f|%5c/i.test(raw) || raw.includes("@")) { points += 2; reasons.push("The URL contains characters or encoding that deserve extra inspection."); }
  const labels = host.split(".");
  if (labels.length >= 5) { points += 2; reasons.push("The hostname has many subdomain levels."); }
  if (!reasons.length) reasons.push("No obvious heuristic warning was detected.");
  return { level: points >= 5 ? "High Risk" : points >= 2 ? "Medium Risk" : "Low Risk", points, reasons };
}
function LinkChecker() {
  const [url,setUrl] = useState(""); const [result,setResult] = useState<ReturnType<typeof checkUrl>|null>(null);
  const submit=(e:FormEvent)=>{e.preventDefault();setResult(checkUrl(url));};
  return <><PageTitle eyebrow="CHECK BEFORE YOU CLICK" title="Link checker" desc="Review common URL warning signs before deciding whether to open a link."/><div className="narrow-panel"><form onSubmit={submit} className="stack"><label htmlFor="url">Website URL</label><div className="url-input"><span>🔗</span><input id="url" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://example.com" required/></div><button className="btn primary" type="submit">Analyze URL ↗</button></form>{result&&<div className={`result-card ${result.level==="High Risk"?"high":result.level==="Medium Risk"?"medium":result.level==="Low Risk"?"low":"high"}`}><h2>{result.level==="Low Risk"?"🟢":result.level==="Medium Risk"?"🟡":"🔴"} {result.level}</h2><p>Heuristic score: {result.points}</p><ul>{result.reasons.map((r,i)=><li key={i}>{r}</li>)}</ul></div>}<div className="notice"><b>Important limitation</b><p>This tool only checks the URL text using simple rules. It does not visit the site, check reputation databases, or detect malware. A low-risk result is not a guarantee of safety.</p></div></div></>;
}

const incidentTypes: IncidentType[] = ["Phishing","Online Scam","Account Hacking","Identity Theft","Cyberbullying","Malware","UPI / Payment Scam","Other"];
function Report() {
  const [form,setForm] = useState({name:"",email:"",type:"Phishing" as IncidentType,description:""});
  const [message,setMessage] = useState(""); const [busy,setBusy] = useState(false);
  const submit=async(e:FormEvent)=>{e.preventDefault();setBusy(true);setMessage("");try{await api.post("/incidents",form);setMessage("Report submitted successfully. The demo admin dashboard can now view it.");setForm({name:"",email:"",type:"Phishing",description:""});}catch(err:any){setMessage(err?.response?.data?.message || "Could not submit. Check that the backend and MongoDB are running.");}finally{setBusy(false);}};
  return <><PageTitle eyebrow="SPEAK UP SAFELY" title="Report a cyber incident" desc="Submit a demo incident report so it can be reviewed in the admin dashboard."/><div className="narrow-panel"><form onSubmit={submit} className="stack"><label>Full name<input value={form.name} maxLength={100} onChange={e=>setForm({...form,name:e.target.value})} required placeholder="Your name"/></label><label>Email address<input type="email" value={form.email} maxLength={254} onChange={e=>setForm({...form,email:e.target.value})} required placeholder="you@example.com"/></label><label>Incident type<select value={form.type} onChange={e=>setForm({...form,type:e.target.value as IncidentType})}>{incidentTypes.map(t=><option key={t}>{t}</option>)}</select></label><label>What happened?<textarea value={form.description} maxLength={5000} onChange={e=>setForm({...form,description:e.target.value})} rows={6} required placeholder="Describe the incident, when it happened, and any relevant context. Do not include passwords, OTPs, PINs, or full card details."/></label><button className="btn primary" disabled={busy}>{busy?"Submitting…":"Submit incident report ↗"}</button></form>{message&&<p className="form-message" role="status">{message}</p>}<div className="notice"><b>Privacy note</b><p>This is a student demo. Do not submit real sensitive data or use this site as an emergency reporting channel.</p></div></div></>;
}

function Quiz() {
  const [index,setIndex] = useState(0); const [answers,setAnswers] = useState<number[]>([]); const [selected,setSelected] = useState<number|null>(null); const [done,setDone] = useState(false);
  const current=quiz[index]; const score=answers.reduce((sum,a,i)=>sum+(a===quiz[i].answer?1:0),0);
  const choose=(n:number)=>{if(selected===null)setSelected(n);};
  const next=()=>{const nextAnswers=[...answers,selected!];setAnswers(nextAnswers);if(index===quiz.length-1)setDone(true);else{setIndex(index+1);setSelected(null);}};
  const restart=()=>{setIndex(0);setAnswers([]);setSelected(null);setDone(false);};
  return <><PageTitle eyebrow="TEST YOUR KNOWLEDGE" title="Cybersecurity quiz" desc="Choose the safest response and learn why it matters."/><div className="narrow-panel quiz-panel">{done?<div className="quiz-result"><span className="big-emoji">{score>=5?"🏆":score>=3?"🛡️":"📘"}</span><h2>You scored {score} / {quiz.length}</h2><div className="progress"><span style={{width:`${score/quiz.length*100}%`}}/></div><h3>{Math.round(score/quiz.length*100)}% correct</h3><p>{score>=5?"Excellent work. Keep practicing safe digital habits.":score>=3?"Good progress. Review the explanations and try again.":"A good start. Review the awareness topics and give it another try."}</p><button className="btn primary" onClick={restart}>↻ Restart quiz</button></div>:<><div className="quiz-meta"><span>QUESTION {index+1} OF {quiz.length}</span><span>{Math.round(index/quiz.length*100)}% complete</span></div><div className="progress"><span style={{width:`${index/quiz.length*100}%`}}/></div><h2 className="question">{current.q}</h2><div className="answer-list">{current.options.map((o,i)=><button key={o} className={`answer ${selected!==null&&i===current.answer?"correct":selected===i?"incorrect":""}`} onClick={()=>choose(i)} disabled={selected!==null}><span>{String.fromCharCode(65+i)}</span>{o}{selected!==null&&i===current.answer&&" ✓"}</button>)}</div>{selected!==null&&<div className="explanation"><b>{selected===current.answer?"Correct!":"Not quite."}</b><p>{current.why}</p><button className="btn primary" onClick={next}>{index===quiz.length-1?"See results":"Next question →"}</button></div>}</>}</div></>;
}

const checks = [
  "I use unique passwords for important accounts.",
  "I enable multi-factor authentication where possible.",
  "I verify suspicious messages before clicking links.",
  "I check website addresses before signing in.",
  "I install software and security updates regularly.",
  "I never share OTPs, UPI PINs or banking passwords.",
  "I avoid sensitive transactions on untrusted public Wi-Fi.",
  "I review account activity and security alerts."
];
function SelfCheck() {
  const [values,setValues]=useState<boolean[]>(Array(checks.length).fill(false)); const [show,setShow]=useState(false);
  const yes=values.filter(Boolean).length; const level=yes>=7?"Strong":yes>=4?"Moderate":"Needs Improvement";
  return <><PageTitle eyebrow="BUILD SAFER HABITS" title="Security self-check" desc="Answer honestly to get a quick snapshot of your everyday cybersecurity habits."/><div className="narrow-panel"><div className="check-list">{checks.map((q,i)=><label className="check-row" key={q}><span>{q}</span><select value={values[i]?"yes":"no"} onChange={e=>{setValues(old=>old.map((v,j)=>i===j?e.target.value==="yes":v));setShow(false);}}><option value="no">No</option><option value="yes">Yes</option></select></label>)}</div><button className="btn primary full" onClick={()=>setShow(true)}>View my results ↗</button>{show&&<div className="result-card low"><span className="eyebrow">YOUR SELF-CHECK RESULT</span><h2>{level}</h2><p>{yes} of {checks.length} habits marked Yes.</p><p>{level==="Strong"?"Great foundation. Keep reviewing your habits and adapting to new threats.":level==="Moderate"?"You have some good habits. Prioritize unique passwords, MFA and independent verification.":"Start with unique passwords, MFA, updates and never sharing OTPs or PINs."}</p><small>This is a reflection tool, not a professional security audit.</small></div>}</div></>;
}

function Admin() {
  const [incidents,setIncidents]=useState<Incident[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  const load=async()=>{setLoading(true);setError("");try{const r=await api.get<Incident[]>("/incidents");setIncidents(r.data);}catch{setError("Could not load reports. Ensure the backend and MongoDB are running.");}finally{setLoading(false);}};
  useEffect(()=>{void load();},[]);
  const update=async(id:string,status:IncidentStatus)=>{try{await api.patch(`/incidents/${id}/status`,{status});await load();}catch{setError("Could not update status.");}};
  const remove=async(id:string)=>{if(!window.confirm("Delete this incident report permanently?"))return;try{await api.delete(`/incidents/${id}`);await load();}catch{setError("Could not delete report.");}};
  const stats=useMemo(()=>({total:incidents.length,pending:incidents.filter(i=>i.status==="Pending").length,review:incidents.filter(i=>i.status==="Under Review").length,resolved:incidents.filter(i=>i.status==="Resolved").length}),[incidents]);
  return <><PageTitle eyebrow="MANAGE REPORTS" title="Admin dashboard" desc="Review reports submitted through the demo website and update their progress."/><div className="stats-grid">{[["Total Reports",stats.total,"📋"],["Pending",stats.pending,"🕒"],["Under Review",stats.review,"🔎"],["Resolved",stats.resolved,"✓"]].map(([label,n,icon])=><div className="stat-card" key={String(label)}><span>{icon}</span><p>{label}</p><strong>{n}</strong></div>)}</div><div className="dashboard-toolbar"><div><h2>Incident reports</h2><p>Newest reports appear first.</p></div><button className="btn secondary" onClick={()=>void load()}>↻ Refresh</button></div>{error&&<p className="error-message">{error}</p>}{loading?<p className="empty-state">Loading reports…</p>:incidents.length===0?<div className="empty-state"><span>📭</span><h3>No incident reports yet</h3><p>Submit a test report from the Report Incident page.</p></div>:<div className="table-wrap"><table><thead><tr><th>Reporter</th><th>Incident</th><th>Description</th><th>Submitted</th><th>Status</th><th>Action</th></tr></thead><tbody>{incidents.map(i=><tr key={i._id}><td><b>{i.name}</b><small>{i.email}</small></td><td>{i.type}</td><td className="description-cell">{i.description}</td><td>{new Date(i.createdAt).toLocaleString()}</td><td><select className={`status status-${i.status.replace(" ","-").toLowerCase()}`} value={i.status} onChange={e=>void update(i._id,e.target.value as IncidentStatus)}><option>Pending</option><option>Under Review</option><option>Resolved</option></select></td><td><button className="delete-btn" onClick={()=>void remove(i._id)}>Delete</button></td></tr>)}</tbody></table></div>}<p className="admin-warning">Demo note: this admin page has no login protection. Keep it local during development; add authentication and authorization before any public deployment.</p></>;
}

export default function App() {
  return <Shell><Routes><Route path="/" element={<Home/>}/><Route path="/awareness" element={<Awareness/>}/><Route path="/link-checker" element={<LinkChecker/>}/><Route path="/report" element={<Report/>}/><Route path="/quiz" element={<Quiz/>}/><Route path="/self-check" element={<SelfCheck/>}/><Route path="/admin" element={<Admin/>}/><Route path="*" element={<div className="empty-state"><h1>Page not found</h1><Link to="/">Return home</Link></div>}/></Routes></Shell>;
}
