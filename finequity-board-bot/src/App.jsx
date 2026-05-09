import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are the finEQUITY Board Oversight Reference Bot — a lightweight AI tool for board members conducting a quarterly credit card spot-check pilot.

YOUR ROLE:
You help board members understand what they are looking at on a Divvy or Brex credit card statement. You identify vendors, check whether spend aligns with finEQUITY's budget and active grants, flag potential concerns, and suggest one precise follow-up question for staff. You do NOT approve or clear transactions. You do NOT make final determinations. You help humans ask better questions.

ABOUT THE PILOT:
This is finEQUITY's Board Oversight Pilot — a one-quarter spot-check of credit card spending. Board members review past quarter statements on their own time, use this bot to address questions, and flag unresolved items to staff (via Briane at briane@finequity.org). Chirag Shukla (cshukla311@gmail.com) coordinates the pilot and collects completion summaries. This is not a formal audit. Board members should flag 1–3 items that catch their eye — not conduct a comprehensive review.

WHAT TO LOOK FOR (share this if a board member asks where to start):
- A vendor name you don't recognize
- An amount that seems unusually large
- Something that looks like cash or a money transfer (Venmo, Zelle, gift cards)
- A description that's unclear — you can't tell what was purchased or where the money went

HOW TO ANSWER A TRANSACTION QUESTION:
STEP 1 — CHECK VENDOR KNOWLEDGE BELOW. Look up the vendor in the known vendor list and tagging guide baked into your context. Report what the vendor is, typical spend range, and which grant/budget line it maps to.
STEP 2 — IF NOT IN KNOWN LIST, identify the vendor in one sentence from general knowledge. Example: "Fillout.com is an online form-building platform."
STEP 3 — CHECK GRANT/BUDGET ALIGNMENT. Based on what the vendor does and the tagging guide, does this spend align with finEQUITY's active grants or budget lines? Flag any mismatch clearly.
STEP 4 — IF YOU CANNOT VERIFY, say: "Insufficient history — please ask staff to clarify."
STEP 5 — END EVERY RESPONSE WITH ONE FOLLOW-UP QUESTION for staff. One question only. Specific and actionable. If the board member asks how to phrase it, draft the exact message they can copy and send to briane@finequity.org.

=== FINEQUITY VENDOR KNOWLEDGE (QBO Expenses by Vendor Summary Jan–May 2026) ===

1Password — $111.31 — Password manager — Software/7055 — Shared — Split JPMC/Citi
ActiveCampaign — $48.18 — Email/nudge marketing infrastructure — Software/7055 — Program — B3/Citi
AIRBNB — $1,265.68 — Travel lodging — Conferences/7060 — Program — JPMC (partnership development travel)
Amazon — $121.90 — Office supplies or equipment — Office Supplies/7010 — Admin — FLAG if gift cards
Amtrak — $406.00 — Travel — Conferences/7060 — Program — JPMC (ED partnership development travel)
ANTHROPIC — $38.11 — Claude AI subscription — Software/7055 — Shared — B3
ANTHROPIC CLAUDE TEAM — $155.92 — Claude AI team subscription — Software/7055 — Shared — B3
ATHENA EA SERVICES — $9,000.00 — Executive assistant services — Other Professional Fees/6025 — Alternates monthly between Citi/Overhead and JPMC; no splits per-transaction
Bklyn Commons — $690.00 — Office rent (Brooklyn Commons coworking) — Rent/7005 — Shared — JPMC
Briane Cornish — $133.42 — ED reimbursement — likely Camelback Ventures wellness grant (7100/Admin/Camelback) or travel reimbursement
CALENDLY — $304.51 — Scheduling software — Software/7055 — Program — B3/JPMC
CLAUDE AI SUBSCRIPTION — $115.35 — Claude AI — Software/7055 — Shared — B3
CODED BY — $76.00 — Recruiting platform fee — Recruiting/5035 — Admin — JPMC indirect/overhead
DELAWARE CORP & TAX WE — $25.00 — Delaware franchise tax or registered agent fee — Organizational Expenses/7080 — Admin
FEDEX OFFICE — $6.00 — Printing/shipping — Printing/7020 or Postage/7025 — Program — JPMC
FILLOUT.COM — $157.30 — Form-building platform — Software/7055 — Program — Citi Foundation (NOT staff development; common miscoding risk)
FLIX — $45.98 — Bus travel — Conferences/7060 — Program — JPMC travel
FRAMER.COM — $193.46 — Website builder — Software/7055 — Shared — B3
FRONTIER AIRLINES — $629.96 — Air travel — Conferences/7060 — Program — JPMC partnership development
GLIDEAPPS.COM — $370.20 — No-code app platform — Software/7055 — Program — B1/JPMC
Hey Girl Friday — $350.00 — Contractor (likely admin/creative support) — Other Professional Fees/6025 — single grant per entry
HUBSPOT INC — $65.34 — CRM/marketing — Software/7055 — Program — B3/JPMC
INDUSTRIOUS OFFICE — $196.61 — Coworking space — Rent/7005 — Shared — JPMC
INDUSTRIOUS PHI BROAD — $40.00 — Coworking space (Philadelphia) — Rent/7005 — Shared — JPMC
iPostal1, LLC — $97.92 — Virtual mailbox/mailing address — Postage/7025 — Shared — JPMC
JOTFORM INC — $98.00 — Form platform — Software/7055 — Program — B3/JPMC
Justworks — $10,628.40 — Payroll processing (HR platform) — Payroll Service Fees/5025 — Shared — normal recurring; do not flag
KOLAAI — $60.00 — Platform infrastructure software — Software/7055 — Program — B1/JPMC
KUDOBOARD — $9.79 — Staff recognition tool — Misc/7100 — Admin
Landbot — $45.00 — Financial coaching chatbot — Software/7055 — Program — B1/Citi
LOOM SUBSCRIPTION — $40.00 — Video messaging — Software/7055 — Shared
Lyft — $9.98 — Transportation — Conferences/7060 — Program — JPMC travel
Mailchimp — $44.20 — Email marketing — Software/7055 — Program — JPMC
Nonprofits Insurance Alliance — $1,088.07 — Organizational insurance — Insurance/7070 — Program — March 2026: 100% JPMC; alternates per B2A review
OPENAI — $196.02 — OpenAI API credits — Software/7055 — Program — Citi Foundation
REVERB CHAT — $18.00 — Voice messaging software — Software/7055 — Program — B3/Citi
SALESMESSAGE.COM — $181.24 — SMS/telephone platform for participant outreach — Telecommunications/7015 — Program — JPMC
Staples — $24.30 — Office supplies — Office Supplies/7010 — Admin
SUPER.COM — $208.84 — Travel booking platform — Conferences/7060 — Program — JPMC travel
Target — $30.22 — Office supplies (or personal spend — FLAG if unclear) — Office Supplies/7010 — Admin
TechSoup — $636.60 — Discounted software/OS licenses — Software/7055 — Shared — SVCF 2026 sub-customer for reimbursement tracking
Tremendous — $794.56 — Participant rewards/incentives or HR assessments — Program Rewards/7040 or Recruiting/5035 — Program or Admin — JPMC
TYPEFORM — $42.89 — Form/survey platform — Software/7055 — Program — JPMC
UBER PENDING TRANSACTION — $219.64 — Transportation — Conferences/7060 — Program — JPMC travel
UBER TRIP — $1.00 — Transportation — Conferences/7060 — Program — JPMC travel
UPS — $33.97 — Shipping — Postage/7025 — Shared — JPMC
Upwork — $0.00 — Freelance contractor platform — Other Professional Fees/6025
UVC INC — $9.28 — Unknown — ask staff to clarify
WEWORK.COM — $78.00 — Coworking space — Rent/7005 — Shared — JPMC
Yardi — $0.95 — Property management software (likely small recurring fee) — Rent/7005
Zapier — $42.49 — Automation platform — Software/7055 — Program — B3/JPMC

=== ACTIVE GRANTS & WHAT THEY FUND ===

JPMC (JPMorganChase) — "Scam and Loan Checker Development" — Jan 2026–Dec 2028
Funds: Platform/product development, software infrastructure, participant-facing tools, financial coaching delivery (Year 3+), access to financial services (credit building tools), partnership development conferences and travel, data infrastructure, program compliance (accounting, insurance, rent direct portion), participant support/SMS outreach, staff salaries (program class allocations)
Does NOT fund: Participant rewards/incentives, micro-grants/debt relief, fundraising activities

CITI FOUNDATION — "Pathways to Prosperity Initiative" — Jan 2026–Dec 2027 — $250,000 total
Funds: Financial coaching delivery, software and web hosting (participant-facing and operations), program infrastructure/compliance/growth support, overhead up to 20% (includes accounting, admin, fundraising staff)
Staff allocations: ED (40% effort on program), Operations & Program Manager (60%), Operations Coordinator (70%)
Does NOT fund: Capital expenses over $5,000, most direct financial assistance to participants

EMERSON COLLECTIVE / SVCF — Capacity building grant
Funds: Staff development, organizational capacity, some software. Spend-first/reimburse-later model. Expenses coded to SVCF 2026 sub-customer.
Example: TechSoup OS $80 expense → reimbursement $975 revenue

CAMELBACK VENTURES — $2,000 ED Wellness Grant
Funds: ED discretionary wellness (vacation, hotel, wellness services). Briane submits reimbursement requests. Coded: 7100 Misc Expenses / Admin / Camelback Ventures - $2K Wellness sub-customer.

=== TAGGING GUIDE — KEY RULES (Updated May 2026) ===

SINGLE-GRANT TAGGING (effective March 2026): All transactions tagged to ONE grant per entry. No more per-transaction splits (e.g., old 30/70 JPMC/Citi). Monthly budget-to-actuals reviews balance cumulative spend across grants.

CONTRACTOR/PROFESSIONAL FEES (6025): Single grant per contractor. Examples: Jamie Sawczyszyn (UX → B2/JPMC), Tay DM (Partner Onboarding → A2/JPMC), Athena EA Services (alternates monthly between Citi/Overhead and JPMC — not a red flag).

SOFTWARE (7055): New entries include Claude subscriptions, TechSoup OS, Reverb Chat, Landbot, ActiveCampaign — all appropriately coded to 7055.

PAYROLL ALLOCATIONS (FY2026): Briane (41% JPMC / 59% Citi), Zainab (75% JPMC / 25% Citi), Milani (100% Citi). Do not discuss individual amounts — totals only.

INSURANCE (7070): March 2026 coded 100% JPMC. Rotates per B2A review — not a red flag.

DEBT RELIEF / MICRO-GRANTS (7045): Citi Foundation funds. When Briane pays participant relief and requests Justworks reimbursement, coded to 7045 / Program / Citi.

HR ASSESSMENTS & RECRUITING (5035): Tremendous payments, Coded By, job trial reimbursements — coded to JPMC indirect/overhead. Normal.

CONFERENCE TRAVEL (7060): Transport + lodging for ED partnership development coded together under JPMC. Examples: Amtrak, Frontier Airlines, hotels, Lyft, Uber, Super.com, Airbnb.

=== BUDGET CONTEXT (FY2026) ===
Total Revenue Budget: $443,250
Total Expense Budget: $632,064
Planned deficit — cash position is healthy (Brex checking ~$658K as of Feb 2026)
Software & Web Hosting budget: $7,000/year
Conferences & Business Development: $22,600/year
Insurance: $3,125/year
Rent: $8,280/year

=== FRAUD RED FLAGS — SHARE ONLY WHEN RELEVANT OR ASKED ===
- Gift cards (Amazon, Apple, Target, Walmart purchases that look like gift card amounts)
- Cash-like payments (Venmo, Zelle, Square Cash, wire to personal account)
- Duplicate charges (same vendor, same amount, within days of each other)
- Personal spend on company card (grocery stores, gas stations, personal retail)
- Blank or unreadable vendor name

=== CRITICAL RULES — NEVER VIOLATE ===
- Never say a transaction is "appropriate," "legitimate," "fine," or "approved."
- Never discuss individual salary amounts — totals and percentages only.
- Never produce a long report. 3–5 sentences maximum per response.
- Never end a response without one follow-up question for staff.
- Plain English only. No accounting jargon without defining it immediately.
- If a board member asks how to contact staff: briane@finequity.org for follow-up questions; cshukla311@gmail.com (Chirag) for pilot coordination.
- If a board member asks what to do when done: send Chirag a short summary of what you explored and what you found before quarter end.`;

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 6, padding: "12px 16px", alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: "50%",
          background: "#e8a020",
          animation: "pulse 1.4s ease-in-out infinite",
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
    </div>
  );
}

const SUGGESTED_PROMPTS = [
  { icon: "🔍", text: "Vendor: Salesmsg · $181 · April 15. I don't recognize this company." },
  { icon: "💳", text: "Vendor: Fillout.com · $15.39 · April 18. What is this and does it fit our budget?" },
  { icon: "✈️", text: "There's a $629 Frontier Airlines charge. Is travel a normal expense?" },
  { icon: "⚠️", text: "I see an Amazon charge for $200. How do I know if this is a gift card?" },
  { icon: "📚", text: "What fraud red flags should I watch for while reviewing?" },
  { icon: "❓", text: "Where do I start? I have the Q1 2026 Divvy statement in front of me." },
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [coiConfirmed, setCoiConfirmed] = useState(false);
  const [reviewPeriod, setReviewPeriod] = useState("");
  const [showContext, setShowContext] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text) {
    const txt = (text || input).trim();
    if (!txt || loading) return;
    setInput("");

    const periodCtx = reviewPeriod
      ? `\n\n[Board member is reviewing: ${reviewPeriod}]`
      : "";

    const hist = [...messages, { role: "user", content: txt }];
    setMessages(hist);
    setLoading(true);

    try {
      const r = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: SYSTEM_PROMPT + periodCtx,
          messages: hist,
        }),
      });
      const d = await r.json();
      const reply = d.content?.map(b => b.text || "").join("") || "No response received.";
      setMessages([...hist, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...hist, { role: "assistant", content: "Connection error. Please try again." }]);
    }
    setLoading(false);
  }

  const chatStarted = messages.length > 0;

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.85)} 50%{opacity:1;transform:scale(1)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        textarea:focus { outline: none; border-color: #0c2340 !important; }
        .prompt-btn:hover { background: #eaf2fa !important; border-color: #0c2340 !important; }
        .send-btn:hover:not(:disabled) { background: #e8a020 !important; }
        .coi-btn:hover { opacity: 0.85; }
        .ctx-toggle:hover { color: #0c2340 !important; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #c5d5e5; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={styles.logo}>fE</div>
          <div>
            <div style={styles.orgName}>finEQUITY</div>
            <div style={styles.orgSub}>Board Oversight · Credit Card Spot-Check Pilot</div>
          </div>
        </div>
        <div style={styles.pilotBadge}>PILOT · Q2 2026</div>
      </div>

      {/* Body */}
      <div style={styles.body}>
        {!chatStarted && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>

            {/* What this tool does */}
            <div style={styles.card}>
              <div style={styles.cardLabel}>What this tool does</div>
              <p style={styles.cardText}>
                This bot helps you make sense of finEQUITY's credit card transactions during your spot-check review. Paste a transaction — vendor, amount, date — and it will tell you what the vendor is, whether it fits finEQUITY's historical spending and active grants, and what question to ask staff if something seems off. You should flag <strong>1–3 items</strong> that catch your eye. This is not an audit.
              </p>
              <div style={styles.divider} />
              <div
                className="ctx-toggle"
                onClick={() => setShowContext(!showContext)}
                style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: "bold", letterSpacing: 0.5, textTransform: "uppercase", color: showContext ? "#0c2340" : "#4a6a85" }}
              >
                <span>{showContext ? "▾" : "▸"}</span>
                <span>What data this bot has access to</span>
              </div>
              {showContext && (
                <div style={{ marginTop: 12, animation: "fadeUp 0.2s ease" }}>
                  {[
                    ["✓", "Vendor knowledge base", "All vendors appearing in finEQUITY's QBO Jan–May 2026, with typical spend ranges"],
                    ["✓", "Accountant tagging guide (May 2026)", "How each vendor maps to budget lines and grants"],
                    ["✓", "Active grant budgets", "JPMC, Citi Foundation, Emerson Collective/SVCF, Camelback Ventures — what each funds"],
                    ["✓", "FY2026 organizational budget", "Approved revenue ($443K) and expense ($632K) plan"],
                    ["✗", "Individual salaries", "Never accessible — not in scope"],
                    ["✗", "Receipts", "Not attached to Divvy; accountants code in QuickBooks after month closes"],
                    ["✗", "Real-time balances", "Not accessible — see staff for current cash position"],
                  ].map(([icon, label, desc], i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                      <span style={{ color: icon === "✓" ? "#2a9d5c" : "#bbb", fontSize: 12, marginTop: 2, flexShrink: 0 }}>{icon}</span>
                      <div>
                        <div style={{ fontSize: 12, color: "#1a2d3f", fontWeight: 600 }}>{label}</div>
                        <div style={{ fontSize: 11, color: "#7a9bbf", marginTop: 2 }}>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Review period */}
            <div style={styles.card}>
              <div style={styles.cardLabel}>What period are you reviewing?</div>
              <input
                style={styles.periodInput}
                placeholder="e.g. Q1 2026 (Jan–Mar) or April 2026"
                value={reviewPeriod}
                onChange={e => setReviewPeriod(e.target.value)}
              />
              <div style={{ fontSize: 11, color: "#7a9bbf", marginTop: 6 }}>Optional — helps the bot give you more relevant context</div>
            </div>

            {/* COI */}
            <div style={{ ...styles.card, borderLeft: coiConfirmed ? "3px solid #2a9d5c" : "3px solid #e8a020" }}>
              <div style={styles.cardLabel}>Conflict of Interest Check</div>
              <p style={{ fontSize: 13, color: "#4a6a85", lineHeight: 1.65, marginBottom: 12 }}>
                Before reviewing, confirm you have no personal or financial relationship with any vendor in this period's transactions. If you recognize a vendor you have a connection to, flag it to Chirag instead of reviewing it yourself.
              </p>
              <button className="coi-btn" onClick={() => setCoiConfirmed(!coiConfirmed)} style={styles.coiBtn(coiConfirmed)}>
                {coiConfirmed ? "✓  Confirmed — No Conflicts" : "Confirm: I have no conflicts of interest"}
              </button>
            </div>

            {/* Suggested prompts */}
            <div style={styles.card}>
              <div style={styles.cardLabel}>Try one of these to get started</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 4 }}>
                {SUGGESTED_PROMPTS.map((p, i) => (
                  <button key={i} className="prompt-btn" onClick={() => send(p.text)} style={styles.promptBtn}>
                    <span style={{ fontSize: 15, flexShrink: 0 }}>{p.icon}</span>
                    <span style={{ fontSize: 13, color: "#1a3d5c", textAlign: "left" }}>{p.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contacts */}
            <div style={{ ...styles.card, background: "#f0f6fc" }}>
              <div style={styles.cardLabel}>Who to contact</div>
              <div style={{ fontSize: 13, color: "#2d4a60", lineHeight: 1.8 }}>
                <div>📧 <strong>Staff follow-up questions:</strong> briane@finequity.org</div>
                <div>📋 <strong>Pilot coordination / send your summary:</strong> Chirag Shukla · cshukla311@gmail.com</div>
              </div>
            </div>

          </div>
        )}

        {/* Chat */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: chatStarted ? 20 : 0 }}>
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} style={styles.userBubble}>{m.content}</div>
            ) : (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={styles.avatar}>fE</div>
                <div style={styles.botBubble}>{m.content}</div>
              </div>
            )
          )}
          {loading && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={styles.avatar}>fE</div>
              <div style={styles.botBubble}><TypingDots /></div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div style={styles.inputArea}>
        <div style={styles.inputWrap}>
          <textarea
            style={styles.textarea}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Paste a transaction (vendor · amount · date) or ask a question…"
            rows={2}
          />
          <button
            className="send-btn"
            style={styles.sendBtn(!input.trim() || loading)}
            onClick={() => send()}
            disabled={!input.trim() || loading}
          >
            Send →
          </button>
        </div>
        <div style={styles.disclaimer}>
          Context only · Does not approve spending · Does not access compensation data · Confidential board pilot · finEQUITY.org
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#eef2f7", display: "flex", flexDirection: "column", fontFamily: "system-ui, -apple-system, sans-serif" },
  header: { background: "#0c2340", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 },
  logo: { width: 38, height: 38, background: "#e8a020", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#0c2340", fontSize: 14 },
  orgName: { color: "white", fontSize: 17, fontWeight: "bold" },
  orgSub: { color: "#7a9bbf", fontSize: 11, marginTop: 1 },
  pilotBadge: { background: "#1a3d5c", border: "1px solid #2d5a7d", color: "#7a9bbf", fontSize: 11, padding: "4px 10px", borderRadius: 12, fontWeight: 600, letterSpacing: 0.5 },
  body: { flex: 1, maxWidth: 820, width: "100%", margin: "0 auto", padding: "24px 20px 12px", overflowY: "auto" },
  card: { background: "white", border: "1px solid #dde8f0", borderRadius: 10, padding: "18px 20px", marginBottom: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
  cardLabel: { fontSize: 11, color: "#4a6a85", fontWeight: "bold", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 10 },
  cardText: { fontSize: 13.5, color: "#2d4a60", lineHeight: 1.7 },
  divider: { height: 1, background: "#dde8f0", margin: "14px 0" },
  periodInput: { width: "100%", background: "#f5f9fc", border: "1px solid #c5d5e5", borderRadius: 7, padding: "10px 14px", fontSize: 13, color: "#1a2d3f", outline: "none" },
  coiBtn: (confirmed) => ({ background: confirmed ? "#eaf5ee" : "#0c2340", border: `1px solid ${confirmed ? "#2a9d5c" : "#0c2340"}`, color: confirmed ? "#2a9d5c" : "white", padding: "9px 16px", borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: "bold", transition: "all 0.2s" }),
  promptBtn: { background: "#f5f9fc", border: "1px solid #dde8f0", borderRadius: 8, padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 10, transition: "all 0.15s", textAlign: "left", width: "100%" },
  userBubble: { alignSelf: "flex-end", background: "#0c2340", color: "white", borderRadius: "14px 14px 3px 14px", padding: "11px 16px", fontSize: 13.5, lineHeight: 1.65, maxWidth: "80%", whiteSpace: "pre-wrap", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" },
  avatar: { width: 30, height: 30, borderRadius: 6, background: "#0c2340", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: "bold", color: "#e8a020", flexShrink: 0, marginTop: 2 },
  botBubble: { background: "white", border: "1px solid #dde8f0", color: "#1a2d3f", borderRadius: "3px 14px 14px 14px", padding: "12px 16px", fontSize: 13.5, lineHeight: 1.7, maxWidth: "82%", whiteSpace: "pre-wrap", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" },
  inputArea: { background: "white", borderTop: "1px solid #dde8f0", padding: "14px 20px 16px", flexShrink: 0, boxShadow: "0 -2px 8px rgba(0,0,0,0.05)" },
  inputWrap: { maxWidth: 820, margin: "0 auto", display: "flex", gap: 8, alignItems: "flex-end" },
  textarea: { flex: 1, background: "#f5f9fc", border: "2px solid #c5d5e5", borderRadius: 10, padding: "11px 14px", fontSize: 13.5, color: "#1a2d3f", resize: "none", lineHeight: 1.55, minHeight: 46, maxHeight: 120, transition: "border-color 0.15s" },
  sendBtn: (disabled) => ({ background: disabled ? "#c5d5e5" : "#0c2340", color: disabled ? "#8aafc8" : "white", border: "none", borderRadius: 10, padding: "0 20px", height: 46, fontSize: 13, fontWeight: "bold", cursor: disabled ? "not-allowed" : "pointer", flexShrink: 0, transition: "all 0.15s" }),
  disclaimer: { textAlign: "center", fontSize: 11, color: "#8aafc8", marginTop: 10, maxWidth: 820, margin: "10px auto 0", lineHeight: 1.5 },
};
