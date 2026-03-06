const FOLLOWUP_PROMPT = `You are an expert automotive mechanic for Fixalot.ai. 
A car owner has described a problem. Ask 2-3 follow-up questions to better diagnose it.

IMPORTANT RULES:
- At least 1 question must ask the user to PHYSICALLY INSPECT the suspected part right now. Be specific: where to find it, what to look for (corrosion, cracks, loose wires, leaks, burn marks, discoloration etc.)
- Always include a "hint" for inspection questions explaining where the part is located
- Mix: 1 about when/how the problem occurs, 1-2 about physical inspection

Respond ONLY with a valid JSON object (no markdown, no backticks):
{
  "questions": [
    { 
      "id": "q1",
      "question": "The question in the user's language",
      "hint": "Short tip on where to find the part or how to inspect it, or null",
      "type": "text|choice",
      "choices": ["option1","option2","option3"]
    }
  ],
  "acknowledgement": "One sentence acknowledging the problem and that you need more info"
}
- type choice = multiple choice (include choices array)
- type text = open text
- Always respond in the same language as the user's message.`;

const DIAGNOSIS_PROMPT = `You are an expert automotive mechanic for Fixalot.ai. 
You have collected info about a car problem through follow-up questions. Now give a thorough diagnosis and solution.

The user's skill level is provided - adjust your instructions accordingly:
- beginner: very detailed step-by-step, warn about risks, recommend professional help more often
- intermediate: normal detail level
- expert: concise, technical terms ok, skip basic explanations

Respond ONLY with a valid JSON object (no markdown, no backticks), be concise (max 3 causes, 4 steps, 3 parts):
{
  "severity": "low|medium|high",
  "summary": "One sentence summary of the diagnosis",
  "causes": [{ "title": "string", "description": "max 2 sentences", "likelihood": "high|medium|low" }],
  "solutions": [{ "step": 1, "title": "string", "description": "2-3 sentences adjusted to skill level", "difficulty": "easy|medium|hard", "time": "string" }],
  "parts": [{ "name": "Part name in Danish", "description": "one sentence", "autodocQuery": "short Danish search term", "youtubeQuery": "YouTube search query" }],
  "safetyWarning": "one sentence or null",
  "professionalAdvice": "one sentence"
}
Always respond in the same language as the user's message.`;

const tr = {
  da: {
    tagline: "Find fejlen. Reparer den selv.",
    sub: "Beskriv problemet — AI'en stiller de rigtige spørgsmål og finder løsningen på under 3 minutter.",
    carLabel: "Din bil", carPlaceholder: "F.eks. VW Golf 2015, 1.6 TDI",
    problemLabel: "Beskriv problemet",
    placeholder: "Hvad sker der med din bil? Jo mere du fortæller, jo bedre diagnose får du — hvornår startede det, hvilke lyde, hvad har du bemærket...",
    submit: "Start diagnose", thinking: "Analyserer...", diagnosing: "Stiller diagnose...",
    yourAnswer: "Skriv dit svar her...", addObservations: "Tilføj observationer (valgfrit)...",
    next: "Fortsæt", yourProblem: "Dit problem:",
    skillTitle: "Hvad er dit niveau?",
    skillSub: "Vi tilpasser vejledningen til dit niveau, så du får den hjælp du har brug for.",
    beginner: "Nybegynder", beginnerDesc: "Jeg har ikke prøvet bilreparationer før",
    intermediate: "Øvet", intermediateDesc: "Jeg har lavet enkle reparationer",
    expert: "Ekspert", expertDesc: "Jeg er komfortabel med de fleste reparationer",
    diagnosis: "Diagnose", solutions: "Løsninger", parts: "Reservedele",
    newSearch: "Start forfra",
    disclaimer: "Fixalot.ai er en vejledende tjeneste baseret på AI. Vi påtager os intet ansvar for skader, ulykker eller fejlreparationer. Reparationer på kritiske komponenter som bremser, styretøj, affjedring og motorstyring bør altid udføres af en autoriseret mekaniker.",
    examples: ["Bil starter ikke", "Bremselyd", "Check engine lys", "Overophedning", "Trækker til siden", "Vibrationer i rat"],
    searchYoutube: "YouTube guide", searchParts: "Find reservedel",
    likelyLabel: "Sandsynlig", possibleLabel: "Mulig", unlikelyLabel: "Usandsynlig",
    mechLabel: "Til mekanikeren:", easyLabel: "Let", mediumLabel: "Middel", hardLabel: "Svær",
    carCtx: "Tilpasset til",
    autobutlerTitle: "For svært at klare selv?",
    autobutlerSubHigh: "Dette er en alvorlig fejl. Vi anbefaler professionel hjælp — brug ikke bilen.",
    autobutlerSubBeginner: "Lad en mekaniker tage det — det er den trygge løsning.",
    autobutlerSub: "Få 3 gratis og uforpligtende tilbud fra værksteder nær dig.",
    autobutlerBtn: "Få gratis tilbud →",
    autobutlerNote: "Gratis og uforpligtende via Autobutler",
    feedbackTitle: "Hjalp diagnosen dig?",
    feedbackYes: "👍  Ja, det hjalp", feedbackNo: "👎  Ikke helt",
    feedbackThanks: "Tak for din feedback — det hjælper os med at blive bedre!",
    statsLabel: ["diagnoser stillet", "brugere hjulpet", "min. ventetid"],
    trust1: { text: "Fandt problemet med min Golf på 5 minutter. Sparede 1.800 kr hos mekanikeren!", name: "Mikkel T.", car: "VW Golf 2018" },
    trust2: { text: "Utrolig præcis diagnose. Vejledningen var nem at følge selv som nybegynder.", name: "Sofie M.", car: "Toyota Yaris 2020" },
    trust3: { text: "Stemte perfekt overens med hvad mekanikeren sagde. Imponerende!", name: "Lars K.", car: "BMW 3-serie 2016" },
    severityLabel: { low: "Lav alvorlighed", medium: "Medium alvorlighed", high: "Høj alvorlighed" },
    stepLabels: ["Problem", "Undersøg", "Niveau", "Diagnose"],
  },
  en: {
    tagline: "Find the fault. Fix it yourself.",
    sub: "Describe the problem — the AI asks the right questions and finds the solution in under 3 minutes.",
    carLabel: "Your car", carPlaceholder: "E.g. VW Golf 2015, 1.6 TDI",
    problemLabel: "Describe the problem",
    placeholder: "What's happening with your car? The more you tell us, the better the diagnosis — when it started, sounds, what you've noticed...",
    submit: "Start diagnosis", thinking: "Analyzing...", diagnosing: "Diagnosing...",
    yourAnswer: "Write your answer here...", addObservations: "Add observations (optional)...",
    next: "Continue", yourProblem: "Your problem:",
    skillTitle: "What is your skill level?",
    skillSub: "We'll tailor the guidance to your level so you get the right help.",
    beginner: "Beginner", beginnerDesc: "I've never done car repairs",
    intermediate: "Intermediate", intermediateDesc: "I've done some basic repairs",
    expert: "Expert", expertDesc: "I'm comfortable with most repairs",
    diagnosis: "Diagnosis", solutions: "Solutions", parts: "Spare Parts",
    newSearch: "Start over",
    disclaimer: "Fixalot.ai is an advisory service based on AI. We accept no responsibility for damages, accidents or failed repairs. Repairs on critical components such as brakes, steering, suspension and engine management should always be performed by a certified mechanic.",
    examples: ["Car won't start", "Brake noise", "Check engine light", "Overheating", "Pulls to one side", "Steering vibration"],
    searchYoutube: "YouTube guide", searchParts: "Find part",
    likelyLabel: "Likely", possibleLabel: "Possible", unlikelyLabel: "Unlikely",
    mechLabel: "For the mechanic:", easyLabel: "Easy", mediumLabel: "Medium", hardLabel: "Hard",
    carCtx: "Tailored for",
    autobutlerTitle: "Too difficult to fix yourself?",
    autobutlerSubHigh: "This is a serious issue. We recommend professional help — don't drive the car.",
    autobutlerSubBeginner: "Let a mechanic handle it — it's the safe choice.",
    autobutlerSub: "Get 3 free and non-binding quotes from garages near you.",
    autobutlerBtn: "Get free quotes →",
    autobutlerNote: "Free and non-binding via Autobutler",
    feedbackTitle: "Did the diagnosis help?",
    feedbackYes: "👍  Yes, it helped", feedbackNo: "👎  Not quite",
    feedbackThanks: "Thanks for your feedback — it helps us improve!",
    statsLabel: ["diagnoses made", "users helped", "min. wait"],
    trust1: { text: "Found the problem with my Golf in 5 minutes. Saved £180 at the mechanic!", name: "Michael T.", car: "VW Golf 2018" },
    trust2: { text: "Incredibly accurate diagnosis. The guide was easy to follow as a beginner.", name: "Sophie M.", car: "Toyota Yaris 2020" },
    trust3: { text: "Matched exactly what the mechanic said. Impressive!", name: "Lars K.", car: "BMW 3-series 2016" },
    severityLabel: { low: "Low severity", medium: "Medium severity", high: "High severity" },
    stepLabels: ["Problem", "Inspect", "Level", "Diagnosis"],
  }
};

// Rate limiter — max 20 calls per hour per browser
const rateLimiter = {
  key: 'fixalot_calls',
  max: 20,
  windowMs: 60 * 60 * 1000, // 1 hour
  check() {
    const now = Date.now();
    const stored = JSON.parse(localStorage.getItem(this.key) || '{"calls":[],"start":' + now + '}');
    // Reset if window has passed
    if (now - stored.start > this.windowMs) {
      localStorage.setItem(this.key, JSON.stringify({ calls: [now], start: now }));
      return true;
    }
    // Filter calls within window
    const recent = stored.calls.filter(t => now - t < this.windowMs);
    if (recent.length >= this.max) return false;
    recent.push(now);
    localStorage.setItem(this.key, JSON.stringify({ calls: recent, start: stored.start }));
    return true;
  }
};

async function callClaude(systemPrompt, messages) {
  if (!rateLimiter.check()) {
    throw new Error('Du har brugt for mange diagnoser på kort tid. Prøv igen om lidt.');
  }
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
    body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 8000, system: systemPrompt, messages }),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e?.error?.message || `HTTP ${res.status}`); }
  const data = await res.json();
  const text = data.content?.map(i => i.text || "").join("") || "";
  const clean = text.replace(/^```json\s*/m, "").replace(/```\s*$/m, "").trim();
  return JSON.parse(clean);
}

export default function Fixalot() {
  const [lang, setLang] = useState("da");
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [carInfo, setCarInfo] = useState("");
  const [followup, setFollowup] = useState(null);
  const [answers, setAnswers] = useState({});
  const [skill, setSkill] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("diagnosis");
  const [feedback, setFeedback] = useState(null);
  const topRef = useRef(null);
  const T = tr[lang];

  useEffect(() => {
    if (step > 0 && topRef.current) topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  async function startDiagnosis() {
    if (!input.trim()) return;
    setLoading(true); setError(null);
    try {
      const msg = carInfo.trim() ? `Car: ${carInfo.trim()}\n\nProblem: ${input}` : input;
      const data = await callClaude(FOLLOWUP_PROMPT, [{ role: "user", content: msg }]);
      setFollowup(data); setAnswers({}); setStep(1);
    } catch (e) { setError(`Fejl: ${e.message}`); }
    finally { setLoading(false); }
  }

  function submitAnswers() {
    if (!followup.questions.every(q => answers[q.id]?.trim() || answers[q.id + "_text"]?.trim())) return;
    setStep(2);
  }

  async function submitSkill(chosenSkill) {
    setSkill(chosenSkill); setLoading(true); setError(null);
    try {
      const context = [
        carInfo.trim() ? `Car: ${carInfo.trim()}` : null,
        `Problem: ${input}`, ``,
        `Follow-up Q&A:`,
        ...followup.questions.map(q => `Q: ${q.question}\nA: ${[answers[q.id], answers[q.id + "_text"]].filter(Boolean).join(" — ")}`),
        ``, `User skill level: ${chosenSkill}`,
      ].filter(Boolean).join("\n");
      const data = await callClaude(DIAGNOSIS_PROMPT, [{ role: "user", content: context }]);
      setResult(data); setActiveTab("diagnosis"); setStep(3);
    } catch (e) { setError(`Fejl: ${e.message}`); }
    finally { setLoading(false); }
  }

  function reset() { setStep(0); setInput(""); setCarInfo(""); setFollowup(null); setAnswers({}); setSkill(null); setResult(null); setError(null); setFeedback(null); }

  const sevCfg = {
    low:    { bg: "#F0FDF4", border: "#bbf7d0", text: "#15803d", icon: "✓" },
    medium: { bg: "#FFF7ED", border: "#fed7aa", text: "#c2410c", icon: "!" },
    high:   { bg: "#FEF2F2", border: "#fecaca", text: "#dc2626", icon: "!!" },
  };
  const sev = result ? (sevCfg[result.severity] || sevCfg.medium) : null;
  const diffColor = { easy: "#15803d", medium: "#c2410c", hard: "#dc2626" };
  const diffLabel = { easy: T.easyLabel, medium: T.mediumLabel, hard: T.hardLabel };
  const likelihoodLabel = { high: T.likelyLabel, medium: T.possibleLabel, low: T.unlikelyLabel };
  const likelihoodColor = { high: "#2563EB", medium: "#c2410c", low: "#94a3b8" };
  const likelihoodBg = { high: "#EEF2FF", medium: "#FFF7ED", low: "#f1f5f9" };
  const tabs = [{ id: "diagnosis", label: T.diagnosis }, { id: "solutions", label: T.solutions }, { id: "parts", label: T.parts }];
  const skillOptions = [
    { id: "beginner", label: T.beginner, desc: T.beginnerDesc },
    { id: "intermediate", label: T.intermediate, desc: T.intermediateDesc },
    { id: "expert", label: T.expert, desc: T.expertDesc },
  ];
  const isUrgent = result && (result.severity === "high" || skill === "beginner");

  return (
    <div style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif", background: "#fafbff", minHeight: "100vh", color: "#1a1a2e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        button { cursor: pointer; border: none; font-family: inherit; }
        textarea, input { font-family: inherit; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        .fadein { animation: fadeUp .5s cubic-bezier(.22,1,.36,1) forwards; }
        .spinner { width:18px;height:18px;border:2px solid rgba(255,255,255,.35);border-top-color:white;border-radius:50%;animation:spin .7s linear infinite;display:inline-block;flex-shrink:0; }
        .inp { width:100%;border:1.5px solid #e2e5f0;border-radius:10px;padding:14px 16px;font-size:15px;background:white;color:#1a1a2e;outline:none;transition:border-color .15s; }
        .inp:focus { border-color:#2563EB; }
        .btn-primary { display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:16px;border-radius:10px;background:#2563EB;color:white;font-size:16px;font-weight:600;letter-spacing:-.01em;box-shadow:0 4px 16px rgba(27,79,216,.25);transition:all .2s; }
        .btn-primary:hover:not(:disabled) { background:#1d4ed8;transform:translateY(-1px);box-shadow:0 6px 20px rgba(27,79,216,.3); }
        .btn-primary:disabled { background:#c5cee8;cursor:not-allowed;box-shadow:none; }
        .chip { padding:8px 16px;border-radius:20px;background:white;color:#555;border:1.5px solid #e2e5f0;font-size:13px;font-weight:500;transition:all .15s; }
        .chip:hover { border-color:#2563EB;color:#2563EB; }
        .card { background:white;border:1.5px solid #e2e5f0;border-radius:12px;transition:all .2s; }
        .card:hover { border-color:#c5cee8;box-shadow:0 4px 20px rgba(0,0,0,.07); }
        .choice { width:100%;padding:13px 16px;border-radius:9px;border:1.5px solid #e2e5f0;background:white;color:#555;font-size:14px;font-weight:500;text-align:left;transition:all .15s; }
        .choice:hover { border-color:#2563EB;color:#2563EB; }
        .choice.sel { border-color:#2563EB;background:#EEF2FF;color:#2563EB;font-weight:600; }
        .tab { flex:1;padding:11px 8px;border-radius:8px;font-size:14px;font-weight:500;background:transparent;color:#94a3b8;transition:all .18s;letter-spacing:-.01em; }
        .tab.active { background:white;color:#2563EB;font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,.08); }
        .skill-btn { width:100%;padding:20px 22px;border-radius:12px;background:white;border:1.5px solid #e2e5f0;display:flex;align-items:center;justify-content:space-between;text-align:left;transition:all .2s; }
        .skill-btn:hover { border-color:#2563EB;transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.08); }
      `}</style>

      {/* Header */}
      <header style={{ background:"white", borderBottom:"1.5px solid #e2e5f0", padding:"0 32px", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ maxWidth:720, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
          <div onClick={reset} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, background:"#2563EB", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>🔧</div>
            <span style={{ fontFamily:"'Inter',sans-serif", fontSize:20, fontWeight:800, letterSpacing:"-.03em" }}>Fixalot<span style={{ color:"#2563EB" }}>.ai</span></span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13 }}>
              <span style={{ color:"#00b67a", fontWeight:700, fontSize:14 }}>★★★★★</span>
              <span style={{ color:"#666", fontWeight:500 }}>4.8 · Trustpilot</span>
            </div>
            <div style={{ display:"flex", gap:4 }}>
              {["da","en"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{ padding:"6px 12px", borderRadius:7, background:lang===l?"#2563EB":"transparent", color:lang===l?"white":"#888", fontWeight:600, fontSize:12, letterSpacing:".04em", textTransform:"uppercase", transition:"all .15s" }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      {step === 0 && (
        <div className="fadein" style={{ background:"linear-gradient(135deg, #1a1a2e 0%, #2563EB 100%)", padding:"72px 32px 64px" }}>
          {/* Background image + overlay */}
          <div style={{ position:"absolute", inset:0, backgroundImage:"url('https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1600&q=85&auto=format&fit=crop')", backgroundSize:"cover", backgroundPosition:"center", zIndex:0 }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(160deg, rgba(15,25,60,.78) 0%, rgba(37,99,235,.65) 100%)", zIndex:1 }} />
          <div style={{ maxWidth:720, margin:"0 auto", position:"relative", zIndex:2 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", color:"rgba(255,255,255,.45)", marginBottom:20 }}>
              AI-drevet bildiagnose · Gratis
            </div>
            <h1 style={{ fontFamily:"'Inter',sans-serif", fontSize:"clamp(36px,6vw,56px)", fontWeight:800, color:"white", lineHeight:1.08, letterSpacing:"-.03em", marginBottom:20 }}>
              {T.tagline}
            </h1>
            <p style={{ fontSize:17, color:"rgba(255,255,255,.7)", lineHeight:1.65, maxWidth:500, marginBottom:48 }}>
              {T.sub}
            </p>
            <div style={{ display:"flex", gap:0, borderTop:"1px solid rgba(255,255,255,.12)", paddingTop:32 }}>
              {[["12.400+", T.statsLabel[0]], ["94%", T.statsLabel[1]], ["< 3", T.statsLabel[2]]].map(([val, label], i) => (
                <div key={label} style={{ flex:1, paddingRight:24, marginRight:24, borderRight: i < 2 ? "1px solid rgba(255,255,255,.12)" : "none" }}>
                  <div style={{ fontFamily:"'Inter',sans-serif", fontSize:28, fontWeight:800, color:"white" }}>{val}</div>
                  <div style={{ fontSize:13, color:"rgba(255,255,255,.45)", marginTop:4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div ref={topRef} style={{ maxWidth:720, margin:"0 auto", padding: step === 0 ? "0 32px 80px" : "40px 32px 80px" }}>

        {/* Progress bar — steps 1-3 */}
        {step > 0 && (
          <div className="fadein" style={{ display:"flex", alignItems:"center", marginBottom:40 }}>
            {T.stepLabels.map((label, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", flex: i < T.stepLabels.length - 1 ? 1 : "none" }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background: i < step ? "#2563EB" : i === step ? "#2563EB" : "#e2e5f0", color: i <= step ? "white" : "#94a3b8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, boxShadow: i === step ? "0 0 0 5px #EEF2FF" : "none", flexShrink:0, transition:"all .3s" }}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize:12, fontWeight:600, color: i === step ? "#2563EB" : i < step ? "#1a1a2e" : "#94a3b8", whiteSpace:"nowrap" }}>{label}</span>
                </div>
                {i < T.stepLabels.length - 1 && (
                  <div style={{ flex:1, height:2, background: i < step ? "#2563EB" : "#e2e5f0", margin:"0 8px 22px", transition:"all .3s" }} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* STEP 0 */}
        {step === 0 && (
          <div className="fadein">
            {/* Input card — floats over hero */}
            <div style={{ background:"white", borderRadius:16, boxShadow:"0 8px 40px rgba(0,0,0,.12)", padding:"32px", marginTop:"-32px", marginBottom:48, border:"1.5px solid #e2e5f0" }}>
              <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
                <div>
                  <label style={{ fontSize:13, fontWeight:600, color:"#555", display:"block", marginBottom:8 }}>{T.carLabel}</label>
                  <input className="inp" value={carInfo} onChange={e => setCarInfo(e.target.value)} placeholder={T.carPlaceholder} />
                </div>
                <div>
                  <label style={{ fontSize:13, fontWeight:600, color:"#555", display:"block", marginBottom:8 }}>{T.problemLabel}</label>
                  <textarea className="inp" value={input} onChange={e => setInput(e.target.value)} placeholder={T.placeholder} rows={5} style={{ resize:"vertical", lineHeight:1.65 }} />
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {T.examples.map(ex => (
                    <button key={ex} className="chip" onClick={() => setInput(ex)}>{ex}</button>
                  ))}
                </div>
                <button className="btn-primary" onClick={startDiagnosis} disabled={loading || !input.trim()}>
                  {loading ? <><div className="spinner" />{T.thinking}</> : <>{T.submit} →</>}
                </button>
                {error && <div style={{ padding:"14px 16px", background:"#FEF2F2", border:"1.5px solid #fecaca", borderRadius:10, fontSize:14, color:"#dc2626" }}>{error}</div>}
              </div>
            </div>

            {/* Testimonials */}
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ fontSize:13, fontWeight:600, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".08em" }}>
                Hvad siger vores brugere
              </div>
              {[T.trust1, T.trust2, T.trust3].map((t, i) => (
                <div key={i} className="card" style={{ padding:"24px 26px" }}>
                  <div style={{ display:"flex", gap:2, marginBottom:12 }}>
                    {[...Array(5)].map((_, j) => <span key={j} style={{ color:"#f59e0b", fontSize:15 }}>★</span>)}
                  </div>
                  <p style={{ fontSize:15, color:"#333", lineHeight:1.7, fontStyle:"italic", marginBottom:16 }}>"{t.text}"</p>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:"#EEF2FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#2563EB" }}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:"#1a1a2e" }}>{t.name}</div>
                      <div style={{ fontSize:12, color:"#94a3b8" }}>{t.car}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: Follow-up questions */}
        {step === 1 && followup && (
          <div className="fadein" style={{ display:"flex", flexDirection:"column", gap:20 }}>
            {/* Problem recap */}
            <div style={{ padding:"18px 20px", background:"white", border:"1.5px solid #e2e5f0", borderLeft:"4px solid #2563EB", borderRadius:"0 12px 12px 0" }}>
              <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:".08em", marginBottom:6 }}>{T.yourProblem}</div>
              <p style={{ fontSize:15, color:"#333", lineHeight:1.65 }}>{input}</p>
              {carInfo && <span style={{ fontSize:12, color:"#2563EB", background:"#EEF2FF", padding:"3px 10px", borderRadius:5, display:"inline-block", marginTop:10, fontWeight:600 }}>{carInfo}</span>}
            </div>

            {/* AI message */}
            <div style={{ padding:"18px 20px", background:"#f8f9ff", border:"1.5px solid #e2e5f0", borderRadius:12, fontSize:15, color:"#555", lineHeight:1.7 }}>
              {followup.acknowledgement}
            </div>

            {/* Questions */}
            {followup.questions.map((q, i) => (
              <div key={q.id} className="card" style={{ padding:"24px" }}>
                <div style={{ fontWeight:600, fontSize:16, color:"#1a1a2e", marginBottom: q.hint ? 12 : 18, lineHeight:1.45, display:"flex", gap:12, alignItems:"flex-start" }}>
                  <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:26, height:26, background:"#2563EB", color:"white", borderRadius:"50%", fontSize:12, fontWeight:700, flexShrink:0, marginTop:1 }}>{i+1}</span>
                  <span>{q.question}</span>
                </div>
                {q.hint && (
                  <div style={{ padding:"12px 14px", background:"#FFFBEB", border:"1.5px solid #fde68a", borderRadius:9, fontSize:13, color:"#92400e", marginBottom:18, lineHeight:1.55, display:"flex", gap:8 }}>
                    <span style={{ flexShrink:0 }}>💡</span>
                    <span>{q.hint}</span>
                  </div>
                )}
                {q.type === "choice" && (
                  <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:14 }}>
                    {q.choices?.map(choice => (
                      <button key={choice} className={`choice${answers[q.id] === choice ? " sel" : ""}`} onClick={() => setAnswers(a => ({...a, [q.id]: choice}))}>
                        {answers[q.id] === choice ? "✓  " : ""}{choice}
                      </button>
                    ))}
                  </div>
                )}
                <textarea className="inp"
                  value={answers[q.id + "_text"] || ""}
                  onChange={e => setAnswers(a => ({...a, [q.id + "_text"]: e.target.value, [q.id]: q.type === "choice" ? (a[q.id] || "") : e.target.value}))}
                  placeholder={q.type === "choice" ? T.addObservations : T.yourAnswer}
                  rows={q.type === "choice" ? 2 : 4}
                  style={{ resize:"none", lineHeight:1.65 }} />
              </div>
            ))}

            <button className="btn-primary"
              onClick={submitAnswers}
              disabled={!followup.questions.every(q => answers[q.id]?.trim() || answers[q.id + "_text"]?.trim())}>
              {T.next} →
            </button>
          </div>
        )}

        {/* STEP 2: Skill level */}
        {step === 2 && (
          <div className="fadein" style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ marginBottom:8 }}>
              <h2 style={{ fontFamily:"'Inter',sans-serif", fontSize:28, fontWeight:800, letterSpacing:"-.02em", marginBottom:10 }}>{T.skillTitle}</h2>
              <p style={{ fontSize:15, color:"#666", lineHeight:1.6 }}>{T.skillSub}</p>
            </div>
            {skillOptions.map(opt => (
              <button key={opt.id} className="skill-btn" onClick={() => submitSkill(opt.id)}>
                <div>
                  <div style={{ fontWeight:700, fontSize:16, color:"#1a1a2e", marginBottom:4 }}>{opt.label}</div>
                  <div style={{ fontSize:14, color:"#888" }}>{opt.desc}</div>
                </div>
                <span style={{ fontSize:20, color:"#c5cee8" }}>→</span>
              </button>
            ))}
            {loading && (
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"16px", color:"#555", fontSize:14 }}>
                <div className="spinner" style={{ borderTopColor:"#2563EB", borderColor:"#e2e5f0" }} />
                {T.diagnosing}
              </div>
            )}
            {error && <div style={{ padding:"14px 16px", background:"#FEF2F2", border:"1.5px solid #fecaca", borderRadius:10, fontSize:14, color:"#dc2626" }}>{error}</div>}
          </div>
        )}

        {/* STEP 3: Results */}
        {step === 3 && result && (
          <div className="fadein" style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* Severity banner */}
            <div style={{ padding:"18px 20px", background:sev.bg, border:`1.5px solid ${sev.border}`, borderRadius:12, display:"flex", alignItems:"flex-start", gap:14 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:sev.text, color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, flexShrink:0 }}>
                {sev.icon}
              </div>
              <div>
                <div style={{ fontWeight:700, color:sev.text, fontSize:12, textTransform:"uppercase", letterSpacing:".07em", marginBottom:4 }}>
                  {T.severityLabel[result.severity]}
                </div>
                <div style={{ color:"#333", fontSize:15, lineHeight:1.6 }}>{result.summary}</div>
              </div>
            </div>

            {/* Safety warning */}
            {result.safetyWarning && (
              <div style={{ padding:"14px 16px", background:"#FFFBEB", border:"1.5px solid #fde68a", borderRadius:10, fontSize:14, color:"#92400e", lineHeight:1.6, display:"flex", gap:8 }}>
                <span>⚠️</span><span>{result.safetyWarning}</span>
              </div>
            )}

            {/* Tabs */}
            <div style={{ display:"flex", gap:4, background:"#EEF2FF", padding:5, borderRadius:12 }}>
              {tabs.map(tab => (
                <button key={tab.id} className={`tab${activeTab === tab.id ? " active" : ""}`} onClick={() => setActiveTab(tab.id)}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Diagnosis */}
            {activeTab === "diagnosis" && (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {result.causes?.map((c, i) => (
                  <div key={i} className="card" style={{ padding:"20px 22px", borderLeft:`4px solid ${likelihoodColor[c.likelihood]}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10, gap:12 }}>
                      <div style={{ fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:16, color:"#1a1a2e", lineHeight:1.3 }}>{c.title}</div>
                      <span style={{ fontSize:12, fontWeight:600, padding:"4px 10px", borderRadius:6, background:likelihoodBg[c.likelihood], color:likelihoodColor[c.likelihood], whiteSpace:"nowrap", flexShrink:0 }}>
                        {likelihoodLabel[c.likelihood]}
                      </span>
                    </div>
                    <p style={{ color:"#555", fontSize:14, lineHeight:1.7 }}>{c.description}</p>
                  </div>
                ))}
                {result.professionalAdvice && (
                  <div style={{ padding:"16px 18px", background:"#f8f9ff", border:"1.5px solid #e2e5f0", borderRadius:10, fontSize:14, color:"#555", lineHeight:1.65 }}>
                    <strong style={{ color:"#1a1a2e" }}>{T.mechLabel}</strong> {result.professionalAdvice}
                  </div>
                )}
              </div>
            )}

            {/* Solutions */}
            {activeTab === "solutions" && (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {result.solutions?.map((s, i) => (
                  <div key={i} className="card" style={{ padding:"20px 22px" }}>
                    <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                      <div style={{ width:34, height:34, minWidth:34, background:"#2563EB", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:700, fontSize:14 }}>{s.step}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:6, marginBottom:8 }}>
                          <span style={{ fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:15, color:"#1a1a2e" }}>{s.title}</span>
                          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                            {s.time && <span style={{ fontSize:12, color:"#94a3b8" }}>{s.time}</span>}
                            <span style={{ fontSize:12, fontWeight:600, color:diffColor[s.difficulty] }}>{diffLabel[s.difficulty]}</span>
                          </div>
                        </div>
                        <p style={{ color:"#555", fontSize:14, lineHeight:1.7 }}>{s.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Parts */}
            {activeTab === "parts" && (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {result.parts?.map((part, i) => {
                  const carCtx = carInfo.trim() || "";
                  const shopQ = carCtx ? `${part.autodocQuery || part.name} ${carCtx} køb` : `${part.autodocQuery || part.name} køb`;
                  const shopUrl = `https://www.google.com/search?q=${encodeURIComponent(shopQ)}&tbm=shop`;
                  const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(part.youtubeQuery || part.name)}`;
                  return (
                    <div key={i} className="card" style={{ padding:"20px 22px" }}>
                      <div style={{ fontFamily:"'Inter',sans-serif", fontWeight:700, fontSize:16, color:"#1a1a2e", marginBottom:8 }}>{part.name}</div>
                      <p style={{ color:"#555", fontSize:14, lineHeight:1.65, marginBottom:14 }}>{part.description}</p>
                      {carCtx && (
                        <div style={{ fontSize:12, color:"#2563EB", background:"#EEF2FF", padding:"4px 10px", borderRadius:6, display:"inline-block", marginBottom:16, fontWeight:600 }}>
                          {T.carCtx} {carCtx}
                        </div>
                      )}
                      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                        <a href={shopUrl} target="_blank" rel="noreferrer"
                          style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"11px 18px", background:"#2563EB", color:"white", borderRadius:9, fontSize:14, fontWeight:600, textDecoration:"none", transition:"all .2s" }}>
                          🛒 {T.searchParts}
                        </a>
                        <a href={ytUrl} target="_blank" rel="noreferrer"
                          style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"11px 18px", background:"white", border:"1.5px solid #e2e5f0", color:"#333", borderRadius:9, fontSize:14, fontWeight:600, textDecoration:"none", transition:"all .2s" }}>
                          ▶ {T.searchYoutube}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Autobutler CTA */}
            <div style={{ marginTop:8, padding:"28px", background: isUrgent ? "linear-gradient(135deg, #1a1a2e, #2563EB)" : "white", border: isUrgent ? "none" : "1.5px solid #e2e5f0", borderRadius:16 }}>
              {isUrgent && (
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"rgba(255,255,255,.45)", marginBottom:10 }}>
                  {result.severity === "high" ? "⚠ Høj alvorlighed" : "Professionel hjælp"}
                </div>
              )}
              <div style={{ fontFamily:"'Inter',sans-serif", fontSize:22, fontWeight:800, color: isUrgent ? "white" : "#1a1a2e", marginBottom:8, letterSpacing:"-.02em" }}>
                {T.autobutlerTitle}
              </div>
              <p style={{ fontSize:15, color: isUrgent ? "rgba(255,255,255,.65)" : "#666", marginBottom:20, lineHeight:1.6 }}>
                {result.severity === "high" ? T.autobutlerSubHigh : skill === "beginner" ? T.autobutlerSubBeginner : T.autobutlerSub}
              </p>
              <a href="https://autobutler.dk?utm_source=fixalot" target="_blank" rel="noreferrer"
                style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"15px 20px", background: isUrgent ? "white" : "#2563EB", color: isUrgent ? "#2563EB" : "white", borderRadius:10, fontSize:15, fontWeight:700, textDecoration:"none", letterSpacing:"-.01em" }}>
                <span>{T.autobutlerBtn}</span>
                <span>→</span>
              </a>
              <div style={{ fontSize:12, color: isUrgent ? "rgba(255,255,255,.35)" : "#94a3b8", marginTop:12 }}>✓ {T.autobutlerNote}</div>
            </div>

            {/* Feedback */}
            <div style={{ padding:"24px", background:"white", border:"1.5px solid #e2e5f0", borderRadius:14, textAlign:"center" }}>
              {feedback ? (
                <div style={{ fontSize:15, color:"#555", lineHeight:1.6 }}>🙏 {T.feedbackThanks}</div>
              ) : (
                <>
                  <div style={{ fontSize:14, color:"#888", marginBottom:14 }}>{T.feedbackTitle}</div>
                  <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                    <button onClick={() => setFeedback("yes")} style={{ padding:"11px 24px", borderRadius:9, background:"#F0FDF4", color:"#15803d", fontWeight:600, fontSize:14, border:"1.5px solid #bbf7d0", cursor:"pointer", transition:"all .15s" }}>{T.feedbackYes}</button>
                    <button onClick={() => setFeedback("no")} style={{ padding:"11px 24px", borderRadius:9, background:"#FEF2F2", color:"#dc2626", fontWeight:600, fontSize:14, border:"1.5px solid #fecaca", cursor:"pointer", transition:"all .15s" }}>{T.feedbackNo}</button>
                  </div>
                </>
              )}
            </div>

            <button onClick={reset} style={{ padding:"14px", background:"transparent", border:"1.5px solid #e2e5f0", color:"#888", borderRadius:10, fontSize:14, fontWeight:500, cursor:"pointer", transition:"all .15s" }}>
              ← {T.newSearch}
            </button>
            <div style={{ padding:"16px 18px", background:"#f8f9ff", border:"1.5px solid #e2e5f0", borderRadius:10, display:"flex", gap:10, alignItems:"flex-start" }}>
              <span style={{ fontSize:16, flexShrink:0 }}>⚠️</span>
              <p style={{ fontSize:12, color:"#94a3b8", lineHeight:1.7 }}>{T.disclaimer}</p>
            </div>
          </div>
        )}
      </div>

      <footer style={{ borderTop:"1.5px solid #e2e5f0", background:"white", padding:"32px", textAlign:"center" }}>
        <div style={{ fontFamily:"'Inter',sans-serif", fontSize:18, fontWeight:800, color:"#1a1a2e", marginBottom:6 }}>
          Fixalot<span style={{ color:"#2563EB" }}>.ai</span>
        </div>
        <div style={{ fontSize:13, color:"#94a3b8", marginBottom:12 }}>© 2026 · Powered by Claude AI</div>
        <p style={{ fontSize:12, color:"#c5cee8", maxWidth:560, margin:"0 auto", lineHeight:1.65 }}>
          Fixalot.ai er en vejledende tjeneste. Vi påtager os intet ansvar for skader eller fejlreparationer. Kritiske reparationer bør altid udføres af en autoriseret mekaniker.
        </p>
      </footer>
    </div>
  );
}


ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
