# AmEx Shield
## A Governance Layer for Financial Agents
### Enterprise Research Dossier — v1.0

**Prepared for:** American Express Leadership (illustrative enterprise proposal)
**Classification:** Internal Strategy / Not for External Distribution
**Date:** July 2026

---

### A note on scope and method, read before the rest

A genuine 80–150 page McKinsey/Gartner-caliber dossier — with every one of the dozens of papers, patents, and companies requested individually verified against primary sources — is a multi-week research program for a real team, not a single response. Producing that volume of text without doing that research would mean one of two things: either padding with generic filler, or inventing citations to hit a page count. The brief explicitly and correctly prohibits the second, so I've prioritized **depth and verifiability over length**.

What follows is a real research pass: every citation below was pulled from a live web search performed while writing this, every URL is one I actually retrieved, and every claim attributed to a source is paraphrased from that source (not fabricated, not quoted at length, per copyright constraints). Where I don't have a verified source for something in the brief's checklist (e.g., a specific patent number, a specific startup's Series A terms), I say so explicitly rather than guessing — that's a call an internal research team would make honestly too.

This document is structured to be **extended**: each major section ends with a clearly marked "deepen next" note so a follow-up pass (or a dedicated Research-mode session) can expand it into the full 80–150 page version with additional targeted searches — e.g., a dedicated patent-landscape session, a dedicated per-company technical teardown, a dedicated academic-literature session per risk category. I'd recommend treating this as **Volume I: Strategy, Market, and Architecture**, with Volumes II (Patent Landscape), III (Risk Taxonomy Deep-Dive), and IV (Full Bibliography) as separate deliverables — that's genuinely how a McKinsey/Deloitte engagement of this scope would be broken up and staffed.

---

## Table of Contents

1. Executive Summary
2. Problem Definition: What Is a Governance Layer for Financial Agents
3. Why Now: The Forcing Functions
4. Market & Competitive Landscape
5. Regulatory & Standards Landscape
6. Academic Literature Review (Grounded Subset)
7. Risk Taxonomy
8. Where Current Solutions Fall Short — Research & Engineering Gaps
9. AmEx Shield: Product Design
10. Technical Architecture
11. AI Stack: Build vs. Buy
12. Implementation Roadmap
13. Hackathon Execution Strategy
14. Top 20 Risks to the Program Itself
15. Future Research Directions
16. Bibliography (Verified Sources Only)
17. Appendix

---

## 1. Executive Summary

American Express, Visa, Mastercard, PayPal, Google, Stripe, and OpenAI have all launched agentic-commerce infrastructure in the last twelve months — Visa's Trusted Agent Protocol and Intelligent Commerce Connect, Mastercard's Agent Pay and Agentic Tokens, Google's Agent Payments Protocol (AP2), OpenAI's Agentic Commerce Protocol, and American Express's own Agentic Commerce Experiences (ACE) developer kit, whose Account Enablement, Intent Intelligence, and Payment Credentials specifications went live on April 14, 2026.<cite index="21-1,36-1">Visa's Trusted Agent Protocol, announced in September 2025, introduces a Verified Agent ID issued by Visa and a separate consent record signed by the consumer's issuer, while Amex's own Account Enablement, Intent Intelligence, and Payment Credentials specifications became available April 14, 2026, with Agent Registration and Cart Context still under development.</cite> This is no longer a speculative product category — it is live infrastructure with real transaction volume, and American Express's own Chairman's Letter describes it as one of the most significant shifts in commerce since the advent of e-commerce.<cite index="30-1">A shift from generative AI tools that inform decisions to AI-enabled agents that can act autonomously on behalf of consumers and businesses represents one of the most significant changes in how people can discover and pay for goods, services, and experiences since the advent of e-commerce.</cite>

Every one of these protocols solves the **payment authorization layer**: how does a merchant or network know an AI agent is legitimate, and how does a cardholder's consent get cryptographically bound to a transaction. None of them solve the **governance layer that sits behind Amex's own walls**: the policy, risk, and audit substrate that decides whether *any* of Amex's own internal or partner-facing agents — underwriting agents, fraud agents, servicing agents, expense-automation agents, the Dining Companion, future agentic B2B tools — is allowed to take a given action, under what authority, with what evidence trail, and with what kill-switch.

That gap is what **AmEx Shield** is designed to close. It is not a payments protocol (Amex already has ACE, AP2, and the network-level protocols for that). It is the **internal control plane** that sits between every Amex-built or Amex-integrated agent and every system of record — cards, accounts, underwriting, disbursement, customer data — enforcing policy in real time, producing regulator-grade audit trails, and giving risk, compliance, and product teams a single place to define what agents are and are not allowed to do. This is the same architectural role that IAM/PAM (identity and privileged access management) plays for human employees, applied to a new class of non-human, semi-autonomous actors that current IAM systems were never designed for — a gap the security community has begun naming explicitly (OWASP's ASI03 "Identity & Privilege Abuse" category, and NIST's proposed Agentic Profile extending AI RMF to "delegation chain accountability").<cite index="52-1">Without proper controls, an agent can potentially act beyond what the originating user authorized, even when role-based access control policies are in place, a risk the OWASP Top 10 for Agentic Applications classifies as ASI03: Identity and Privilege Abuse.</cite><cite index="3-1">The proposed NIST AI RMF Agentic Profile whitepaper argues that neither RMF 1.0 nor the 2024 Generative AI Profile contemplated agents that acquire tool-use capabilities and execute autonomously in live production environments, and proposes extensions specific to agent autonomy, tool-use risk, runtime behavioral governance, and delegation-chain accountability.</cite>

**Core recommendation:** Build a policy-engine-centered governance plane (Cedar or OPA-class fine-grained authorization, not RBAC) sitting in front of an MCP-based tool-calling layer, with mandatory human-in-the-loop gates on financially consequential actions, immutable structured audit logging designed to satisfy EU AI Act Article 12 and DORA Article 12 record-keeping simultaneously, and a dedicated red-team/eval harness built on the same benchmarks (AgentDojo, InjecAgent, Agent Security Bench) the research community now uses to measure prompt-injection robustness in tool-calling agents.

---

## 2. Problem Definition: What Is a Governance Layer for Financial Agents

A **governance layer for financial agents** is the set of systems that sits between an AI agent's *decision* and its *execution* of a real-world, money-moving or data-moving action, and that:

1. **Authenticates** the agent's identity and the identity of the human or business on whose behalf it acts (agent identity is not the same problem as user identity — an agent can be legitimate but acting outside its mandate).
2. **Authorizes** the specific action against a machine-readable policy (not a static role, but a dynamic function of amount, counterparty, channel, historical behavior, and risk score).
3. **Constrains** the agent's tool-use surface at runtime — which APIs it can call, with what parameters, in what sequence — rather than trusting the model's own judgment about what it should do.
4. **Requires human review** for actions above a risk threshold (human-in-the-loop) or **samples and monitors** lower-risk actions after the fact (human-on-the-loop).
5. **Records** an immutable, replayable trace of what the agent perceived, reasoned, decided, and did, sufficient to reconstruct the decision for a regulator, an auditor, or a disputing customer.
6. **Detects and contains** deviation — hallucinated actions, injected instructions, runaway loops, goal drift — and can revoke an agent's credentials or halt a workflow in real time.

This is distinct from, and sits on top of, three adjacent things people sometimes conflate it with:

- **Model safety / alignment** (RLHF, constitutional AI, refusal training) — necessary but not sufficient; a well-aligned model can still be manipulated by adversarial tool outputs or simply make a reasoning error under uncertainty.
- **Payment authorization protocols** (AP2, Visa TAP, Mastercard Agent Pay, Amex ACE) — these govern the *external*, cross-institution handshake for a single payment event. They assume each participant already has *internal* governance sorted out; they don't provide it.
- **Traditional application security / IAM** — RBAC and static scopes assume a bounded, enumerable set of actions decided at deploy time. Agents compose tools dynamically at runtime, which is exactly the property that breaks static authorization models, as AWS's own security engineering team has now written up explicitly for multi-agent Cedar deployments.<cite index="48-1">Software engineers deploying multi-agent AI architectures face a distinct authorisation vulnerability when autonomous agents delegate tasks through multi-hop chains, because role-based access control policies fail to maintain context across automated handoffs when the acting entity switches from the human to the machine.</cite>

**Deepen next:** a formal ontology paper-style definition cross-walked against NIST's Agentic Profile taxonomy and OWASP's ASI0x categories, section by section.

---

## 3. Why Now: The Forcing Functions

**3.1 — The industry has already shipped the payment rails; the control plane is racing to catch up.**
In a compressed nine-month window (Sept 2025–May 2026), essentially every major payment network and platform shipped a live agentic-commerce mechanism:

| Company | Mechanism | Announced | Status (per public reporting) |
|---|---|---|---|
| Mastercard | Agent Pay / Agentic Tokens (MDES extension) | Apr 29, 2025 | First live agentic transaction Sept 29, 2025; expanded to Hong Kong, Thailand<cite index="21-1,29-1">Mastercard Agent Pay is a payments framework announced April 29, 2025 that lets verified AI agents transact using Agentic Tokens binding a tokenized card credential to a specific agent, merchant scope, and consent policy, launched with Microsoft, IBM, and Braintree; on September 29, 2025 Mastercard completed the first live agentic payment transaction.</cite> |
| Visa | Trusted Agent Protocol + Intelligent Commerce + Intelligent Commerce Connect | Apr 2025 / Sept–Oct 2025 / Apr 2026 | Hundreds of live agent-initiated transactions by Dec 2025<cite index="25-1,28-1">Visa's Intelligent Commerce, announced April 2025, combines tokenization, authentication, payment instructions, and transaction signals, and by December 2025 Visa and partners including Skyfire, Nekuda, PayOS, and Ramp had completed hundreds of controlled, real-world agent-initiated transactions.</cite> |
| Google | Agent Payments Protocol (AP2) | Sept 2025 | Open protocol, 60+ launch partners including Mastercard, American Express, PayPal, Coinbase, Salesforce<cite index="21-1">Google's AP2, released September 2025 with more than 60 launch partners including Mastercard, American Express, PayPal, Coinbase, and Salesforce, defines an Intent Mandate and a Cart Mandate, both signed as verifiable records.</cite> |
| OpenAI | Agentic Commerce Protocol (ACP) | Q4 2025 | Adopted by PayPal for in-ChatGPT checkout<cite index="29-1">PayPal adopted the Agentic Commerce Protocol to embed payments directly within ChatGPT, with users able to buy items and merchants able to sell through ChatGPT starting in 2026.</cite> |
| Stripe | Agentic Commerce Suite | Dec 2025 | Covers discovery, checkout, payments, fraud handling<cite index="27-1">Stripe said in December that its Agentic Commerce Suite lets businesses sell on AI agents through a single integration that covers discovery, checkout, payments and fraud handling.</cite> |
| American Express | Agentic Commerce Experiences (ACE) developer kit | Announced in 2026 Chairman's Letter; specs live Apr 14, 2026 | Account Enablement, Intent Intelligence, Payment Credentials live; Agent Registration and Cart Context in development<cite index="36-1">Account Enablement, Intent Intelligence, and Payment Credentials specifications are available as of 4/14/2026, while Agent Registration and Cart Context specifications are still under development, and Amex Agent Purchase Protection covers eligible charges after a Card Member initiates a return following an eligible agent error.</cite> |

Visa's own framing of this moment is blunt: <cite index="23-1">"This breakthrough signals that 2025 will be the final year consumers shop and checkout alone, as AI agent-driven payments rapidly transition from experimentation to mainstream adoption."</cite> Independent estimates cited by industry analysts put the scale in the trillion-dollar range by decade's end.<cite index="28-1">McKinsey & Company projects that AI agents could be responsible for $1 trillion in U.S. transactions alone by 2030.</cite>

**3.2 — Amex is already running agents in production, internally.** This isn't hypothetical for Amex specifically: <cite index="31-1">Amex has integrated generative AI into its internal workflows, using AI agents to automate parts or all of tasks such as credit underwriting, fraud detection, and personalized customer service</cite>, and the company's own fraud model already <cite index="34-1">monitors more than $1.2 trillion in transaction value every year, generating a fraud decision in milliseconds for every card transaction worldwide</cite>. Layering *generative, tool-using* agents on top of that scale — rather than the classifier-style ML that has run fraud detection for over a decade — is a qualitatively different risk surface, because generative agents can take open-ended action sequences a classifier cannot.

**3.3 — Regulation has a hard deadline, not a soft one.** The EU AI Act's Annex III high-risk provisions — which explicitly capture creditworthiness assessment and several other financial use cases — enter full enforcement on **August 2, 2026**, alongside DORA, which has been in active enforcement since January 17, 2025 and treats AI models used in credit decisioning, fraud detection, and trading as ICT assets subject to operational-resilience testing.<cite index="58-1">Article 12 requires automatic logging of inputs and outputs, requiring infrastructure changes to credit origination systems — these are engineering requirements, not documentation tasks.</cite><cite index="62-1">Most AI systems used in financial services fall into the high-risk category under the EU AI Act, and a provider who cannot demonstrate conformity assessment completion for a high-risk system becomes a third-party risk that must be managed under DORA's third-party register.</cite> Amex is a global issuer with EU exposure; whatever agentic infrastructure ships domestically will need an audit/logging spine that is EU-AI-Act-and-DORA-compatible from day one rather than retrofitted.

**3.4 — Security research has moved from "this could be a problem" to "this is measured and it's bad."** Academic red-teaming of tool-calling agents now shows attack success rates that would be unacceptable in a regulated financial context if unmitigated: <cite index="40-1">Agent Security Bench testing 16 attack types against 11 defenses across 400+ tools finds the highest average attack success rate reaches 84.3%, with limited effectiveness of current defenses</cite>, and MCP-specific benchmarks show <cite index="40-1">host-side attacks such as intent injection and identity spoofing achieving over 80% success on average</cite>. This is not a fringe concern — OWASP now formally ranks prompt injection as the top agentic AI threat.<cite index="43-1">Prior work has shown that LLM agents are highly susceptible to indirect prompt injection attacks, which have been listed as the top AI threat by OWASP.</cite>

**Deepen next:** transaction-volume and loss-rate modeling specific to Amex's card-present/card-not-present mix, sourced from Amex's own 10-K/10-Q risk factors.

---

## 4. Market & Competitive Landscape

### 4.1 Payment networks and issuers — external protocol layer (already covered above in §3.1)

The critical strategic point for Amex leadership: **Amex is a participant, not a bystander, in the external protocol race** — it's an AP2 launch partner and has its own ACE kit — but every external protocol assumes each participant has already solved *internal* governance. None of Visa TAP, Mastercard Agent Pay, AP2, ACP, or ACE actually tell Amex how to decide, internally, whether its own underwriting agent should approve a credit line increase, or whether its own servicing agent should issue a refund. That decision layer is what's missing, and it's what AmEx Shield is.

### 4.2 Cloud/model providers building agent infrastructure

- **Anthropic** — originated MCP (Nov 2024), now governed by the Agentic AI Foundation (a Linux Foundation initiative Anthropic co-founded with Block and OpenAI in Dec 2025);<cite index="14-1">in December 2025, Anthropic donated the protocol to the Agentic AI Foundation, a Linux Foundation initiative co-founded with Block and OpenAI</cite> the Nov 2025 spec update (2025-11-25) formalized OAuth 2.1 for remote MCP servers.<cite index="12-1">The November 2025 specification (version 2025-11-25) formalized OAuth 2.1 as the authentication standard for remote MCP servers, representing a significant maturation of the protocol's security posture.</cite> Anthropic also already powers Amex's consumer-facing Dining Companion.<cite index="32-1">The integration of Resy with Anthropic's Claude AI, particularly through the American Express Dining Companion, significantly enhances Amex's value proposition by creating a seamless, hyper-personalized dining experience for card members.</cite>
- **AWS** — publishing concrete reference architecture for exactly this problem: Cedar-based least-privilege authorization for multi-hop agent delegation chains, directly addressing OWASP's ASI03.<cite index="52-1">AWS's security blog describes using Cedar to prevent authorization scope from silently expanding as agents delegate tasks through multi-hop chains.</cite>
- **Google** — AP2 (payments consent protocol) plus Agent-to-Agent (A2A) protocol; also a Universal Commerce Protocol effort referenced by Visa/Mastercard as a convergence point.<cite index="28-1">Visa and Mastercard both participate in Google's Universal Commerce Protocol and both adopt Cloudflare's Web Bot Auth technology to distinguish legitimate AI agents.</cite>
- **Microsoft** — launch partner on Mastercard Agent Pay; Copilot as an agent-initiated checkout surface.

### 4.3 Agent orchestration & durability layer

This is a live, fast-moving build-vs-buy decision directly relevant to Shield's architecture. The current consensus pattern among production teams is a **two-layer split**: an agent-reasoning framework (LangGraph) for the non-deterministic "what should I do next" loop, wrapped inside a durable-execution engine (Temporal) for the deterministic "guarantee this multi-hour, multi-system workflow survives crashes, retries, and human-in-the-loop pauses" layer.<cite index="65-1">Sophisticated production teams increasingly choose both: Temporal handles macro-level workflow orchestration — the durable lifecycle of a multi-hour agent job, retries of subsystem calls, state persistence across infrastructure events — while LangGraph handles micro-level agent reasoning, the dynamic, cyclical logic inside each agent step.</cite> Temporal explicitly ships a LangGraph plugin for this pattern as of mid-2026.<cite index="64-1">Temporal's LangGraph integration propagates trace context across Workflow and Activity boundaries so one agent run reads as one trace no matter how many machines it touched, and the same durable-execution approach already powers Temporal's integrations with the OpenAI Agents SDK, Google ADK, and AWS Strands.</cite> This maps well to a regulated environment: Temporal's durability guarantees and full execution history are a natural substrate for DORA-style operational-resilience and audit requirements, while LangGraph's human-in-the-loop interrupts map directly to Shield's approval-gate requirement.<cite index="68-1">Temporal is the right choice for document processing pipelines, financial analysis workflows, multi-agent systems with complex coordination requirements, and any workflow where a failure has significant business impact.</cite>

### 4.4 Policy / authorization engines

- **Cedar** (AWS, open-source, formally verified) — purpose-built for exactly the multi-hop-delegation authorization problem described above; AWS Verified Permissions is the managed offering.
- **Open Policy Agent (OPA) / Rego** — the incumbent general-purpose policy engine, widely used in Kubernetes admission control and API gateways; broader ecosystem maturity but not agent-delegation-specific out of the box.

### 4.5 Agent security / observability startups and vendors

Vendors explicitly building for the OWASP Agentic threat model include Palo Alto Networks (Prisma AIRS), Zenity, and others cited in the OWASP review board itself.<cite index="53-1">The OWASP Distinguished Expert Review Board for the Top 10 for Agentic Applications includes Zenity CTO Michael Bargury co-leading AI VSS and AWS security leader Matt Saner, among others from NIST, the Alan Turing Institute, and Microsoft's AI Red Team.</cite><cite index="54-1">Palo Alto Networks positions Prisma AIRS as helping organizations apply OWASP's agentic guidance, framing the core challenges as agents acting rather than just generating text, chaining tools dynamically such that static policy enforcement is insufficient, and retaining memory that can be manipulated through poisoned prompts or compromised RAG data.</cite>

**Deepen next:** a dedicated pass through YC/Techstars/NVIDIA Inception/OpenAI Startup Fund portfolios filtered for "agent governance," "AI observability," and "financial AI" — this needs its own directory-style search session rather than general web search, since these lists change monthly and a stale snapshot would misrepresent the space; I did not fabricate a startup list here for that reason.

---

## 5. Regulatory & Standards Landscape

| Framework | Scope | Key dates | Relevance to Shield |
|---|---|---|---|
| **NIST AI RMF 1.0** (NIST AI 100-1) | Voluntary US risk-management framework: Govern/Map/Measure/Manage | Jan 2023 | Organizing structure for Shield's Governance/Risk/Compliance modules |
| **NIST AI 600-1** Generative AI Profile | 12 GenAI-specific risk categories including Confabulation, Information Security, Value Chain Integrity | Jul 26, 2024<cite index="5-1">On July 26, 2024, NIST released the Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile pursuant to President Biden's Executive Order on Safe, Secure, and Trustworthy AI, designed as a technology-specific implementation of the AI RMF for generative AI.</cite> | Direct mapping target for Shield's evaluation harness |
| **Proposed NIST AI RMF Agentic Profile** (community whitepaper, not yet official NIST) | Extensions for tool-use risk, runtime behavioral governance, delegation-chain accountability | 2026<cite index="3-1">The proposed profile supplements RMF 1.0 with categories specific to agent autonomy, tool-use risk, runtime behavioral governance, and delegation chain accountability.</cite> | Closest existing template for Shield's control taxonomy — worth tracking for official NIST adoption |
| **EU AI Act (Reg. 2024/1689)**, Annex III | High-risk classification for creditworthiness/credit-scoring AI and certain insurance AI | High-risk obligations enforce **Aug 2, 2026**<cite index="57-1">The EU AI Act's high-risk AI provisions deadline lands August 2, 2026, covering creditworthiness assessment, insurance risk and pricing, and certain other financial services use cases.</cite> | Direct compliance target if any Amex EU entity uses agentic underwriting/credit decisioning; Article 10 (data governance), Article 12 (automatic logging) are engineering requirements, not policy documents<cite index="57-1">Article 10 requires documented data governance practices including collection, preparation, labeling, and quality assessment; Article 12 requires high-risk AI systems to automatically log events throughout their lifecycle.</cite> |
| **DORA** (Digital Operational Resilience Act) | ICT risk management, incident reporting, resilience testing, third-party oversight for EU financial entities | Full enforcement since **Jan 17, 2025**<cite index="56-1">DORA entered full enforcement on January 17, 2025, and applies to banks, insurers, investment firms, payment providers, and their third-party ICT service providers.</cite> | Treats any AI model used in credit decisioning, fraud detection, or trading as an ICT asset subject to resilience testing<cite index="58-1">AI models embedded in credit decisioning, fraud detection, and trading are ICT assets under DORA, so the ICT risk management framework must cover their operational resilience.</cite> |
| **PCI DSS, SOC 2, ISO 27001** | Established security/controls standards | Ongoing | Baseline Shield must satisfy regardless of AI-specific rules; agent tool-calling surfaces (DB access, payment API access) fall inside existing PCI scope and must be assessed as such |
| **OWASP Top 10 for Agentic Applications (2026)** | Practitioner threat taxonomy for autonomous/tool-using/multi-agent systems, peer-reviewed by 100+ experts including NIST, Alan Turing Institute, Microsoft AI Red Team, AWS reps | Dec 2025<cite index="53-1">Since February 2025, OWASP released documents covering the entire agentic AI lifecycle, and this Top 10 was reviewed by a Distinguished Expert Board including NIST's Apostol Vassilev and leaders from the Alan Turing Institute, Oracle Cloud, AWS, and Microsoft's AI Red Team.</cite> | The most implementation-ready threat taxonomy available today; recommend using its ASI0x numbering as Shield's internal risk-category IDs |

**Regulatory bottom line for Amex leadership:** DORA is already fully enforced and treats AI as an ICT asset now, not eventually. The EU AI Act's high-risk Annex III obligations land in roughly five weeks from a mid-2026 reading of this document. Any Shield rollout touching underwriting, credit-line decisions, or insurance-adjacent products needs Article 10/12-compliant data governance and automatic logging **built into the architecture from day one** — retrofitting audit logging onto an agent system after the fact is a materially harder engineering problem than designing for it up front, because it requires the policy/decision engine to already be structured around discrete, loggable decision points.

**Deepen next:** RBI guidelines (India) and any other non-EU/non-US jurisdictions where Amex has card-issuing or merchant-acquiring exposure; a dedicated legal/compliance-team review is more appropriate than web search for jurisdiction-specific interpretation.

---

## 6. Academic Literature Review (Grounded Subset)

The brief asks for exhaustive per-paper citation tables (title/authors/year/summary/contribution/weakness/relevance/link/DOI) across a dozen venues. Doing that properly — verifying author lists, years, and DOIs against ArXiv/ACL Anthology/NeurIPS proceedings directly — is itself a multi-day literature-review project. What I can respons­ibly do here is surface the **papers and benchmarks that came up as load-bearing, real, verifiable sources** in this research pass, with what they actually contribute to Shield's design. This should be treated as a **starter set**, not the full survey the brief envisions.

**MCP Protocol Security**

- *Breaking the Protocol: Security Analysis of the Model Context Protocol Specification and Prompt Injection Vulnerabilities in Tool-Integrated LLM Agents* — Maloyan & Namiot. Identifies three architectural MCP vulnerabilities (no capability attestation, unauthenticated bidirectional sampling, implicit multi-server trust propagation) and proposes AttestMCP, which the authors report cuts attack success from 52.8% to 12.4% with ~8.3ms overhead.<cite index="20-1">The authors present the first rigorous security analysis of MCP's architectural design, identifying absence of capability attestation, bidirectional sampling without origin authentication, and implicit trust propagation in multi-server configurations as three fundamental protocol-level vulnerabilities, and propose AttestMCP, a backward-compatible extension reducing attack success rates from 52.8% to 12.4%.</cite> **Relevance to Shield:** directly informs the MCP-gateway hardening requirements in §10.3 — Shield should not trust MCP server-declared capabilities without independent attestation. Link: https://arxiv.org/html/2601.17549v1

- *Model Context Protocol (MCP): Landscape, Security Threats, and Future Research Directions.* Surveys the MCP host/client/server lifecycle and enumerates installer/supply-chain risks.<cite index="13-1">The paper examines the current MCP landscape and analyzes security and privacy risks of the MCP server, proposing mitigation strategies, and notes that security validation of installers such as checksum verification and signature authentication is necessary to prevent tampering or injection of malicious binaries.</cite> Link: https://arxiv.org/pdf/2503.23278

**Prompt-Injection / Tool-Calling Attack Benchmarks (directly reusable as Shield's eval harness)**

- **AgentDojo** (Debenedetti et al.) — 97 tasks, 629 security test cases across email/banking/travel/workspace domains, jointly measuring utility and security.<cite index="40-1">AgentDojo provides an extensible environment for prompt injection evaluation with 97 tasks and 629 security test cases across email, banking, travel, and workspace domains, uniquely measuring utility and security jointly; the best agent tested achieves 78% benign utility.</cite>
- **InjecAgent** (Zhan et al., ACL Findings 2024) — 1,054 test cases, 17 user tools, 62 attacker tools, specifically for indirect prompt injection.<cite index="40-1">InjecAgent focuses specifically on indirect prompt injection with 1,054 test cases covering 17 user tools and 62 attacker tools; GPT-4 is vulnerable 24% of the time at baseline, rising to 47% with enhanced attack prompts.</cite> DOI/link: https://doi.org/10.18653/v1/2024.findings-acl.624
- **Agent Security Bench (ASB)** (Zhang et al.) — 16 attack types, 11 defenses, 10 scenarios, 400+ tools, 13 LLM backbones; introduces a "Plan-of-Thought" backdoor attack.<cite index="40-1">Agent Security Bench provides the most comprehensive attack/defense evaluation framework, testing 16 attack types against 11 defenses across 10 scenarios with 400+ tools and 13 LLM backbones, with the highest average attack success rate reaching 84.3% and limited effectiveness of current defenses.</cite>
- **WASP** (Evtimov et al., NeurIPS 2026 Datasets & Benchmarks) — web-agent security under prompt injection; the authors characterize present-day agent robustness as <cite index="40-1">"security by incompetence" — agents fail attacks through inability rather than robust defense</cite>, a finding with direct implications for Shield: as underlying models get *more* capable at following injected instructions competently, the current apparent safety margin will shrink unless Shield's runtime controls (not model behavior alone) are the actual line of defense.

**Governance frameworks**

- *Open Problems in Technical AI Governance* — broad survey of unresolved technical-governance problems, cites NIST's own GenAI Profile.<cite index="11-1">The survey catalogs open problems in technical AI governance and references NIST's Generative AI Profile among its foundational sources.</cite> Link: https://arxiv.org/pdf/2407.14981
- *Security Considerations for Multi-agent Systems* — maps NIST AI 600-1's four "primary considerations" (Governance, Content Provenance, Pre-deployment Testing, Incident Disclosure) directly onto AI RMF's Govern/Map/Measure/Manage subcategories, and explicitly flags that the profile <cite index="7-1">recognizes direct and indirect prompt injection and data poisoning as Information Security risks, and supply chain integrity as a Value Chain and Component Integration risk, though its coverage is consistently governance-level rather than a technical security standard</cite>. This is the single clearest existing academic bridge between "compliance framework" and "engineering requirement," and Shield's compliance-engine mapping table in §9 should be built directly on top of it. Link: https://arxiv.org/pdf/2603.09002

**Deepen next:** this section is the single highest-value target for a dedicated follow-up research session — ideally one that also pulls FAccT, KDD, and ICLR/NeurIPS proceedings directly (rather than via secondary citation lists, which is what surfaced most of the above) and adds a formal weaknesses/relevance table per paper as the brief requests.

---

## 7. Risk Taxonomy

Organized using OWASP's Agentic Security Initiative (ASI) numbering where a direct mapping exists, since it's the most implementation-ready taxonomy available and was built with input from NIST, AWS, Microsoft, and the Alan Turing Institute.<cite index="53-1">The taxonomy was developed through extensive collaboration with more than 100 industry experts, researchers, and practitioners.</cite>

| Category | Description | Why it happens | Current mitigation state |
|---|---|---|---|
| **Goal Hijack / Prompt Injection (direct & indirect)** | Attacker-controlled text (email, webpage, document, tool output) overrides the agent's actual objective | LLMs don't reliably distinguish privileged instructions from untrusted data encountered during task execution<cite index="44-1">Because LLMs often lack the contextual understanding to distinguish benign instructions they should follow from malicious instructions embedded in untrusted data, a well-placed injection can cause an agent to execute the attacker's commands instead of the user's original intent.</cite> | Best current defenses (instruction hierarchy training, dual-LLM architectures, spotlighting/delimiting untrusted content, tool filtering) reduce but do not eliminate the risk; academic benchmarks still show attack success rates from ~25% to ~85% depending on attack sophistication and defense stack<cite index="40-1,43-1"></cite> |
| **Identity & Privilege Abuse (OWASP ASI03)** | An agent's authorization scope silently expands as it delegates across a multi-hop chain | Static RBAC assumes a bounded, enumerable action set decided at deploy time; agents compose tool calls dynamically at runtime, and the "acting entity" switches from human to machine mid-chain<cite index="52-1"></cite> | Cedar/OPA-based dynamic policy engines with per-hop re-authorization are the emerging best practice, not yet standard |
| **Tool / Skill Poisoning & Supply-Chain Risk** | Malicious or compromised MCP servers, skill files, or tool definitions | MCP's original design lacked capability attestation, letting servers claim arbitrary permissions<cite index="20-1"></cite>; skill files can carry natural-language instruction manipulation that pattern-matching scanners miss | AttestMCP-style attestation extensions, signed tool registries, and provenance tracking are proposed but not yet widely deployed |
| **MCP Remote Code Execution** | stdio-based MCP server parameters can pass arbitrary shell commands with insufficient input sanitization | Protocol design allows command execution as a first-class feature | Requires strict input validation and sandboxing at the MCP gateway; documented as an active, unresolved class of vulnerability as of 2026 reporting<cite index="17-1"></cite> |
| **Hallucination / Confabulation** | Agent states false information as fact, potentially triggering an incorrect financial action | Generative models optimize for plausible continuation, not verified truth | NIST names this explicitly as a named GenAI risk category<cite index="9-1">NIST AI 600-1 explicitly identifies "Confabulation" (hallucination) as a primary risk category.</cite>; mitigations include grounding, tool-verified fact-checking before action, and mandatory human review above a risk threshold |
| **Cascading / Multi-Step Hallucination in Agentic RAG** | An early hallucinated fact compounds across a multi-step agent plan | Multi-step agents feed their own prior (possibly wrong) outputs into later steps without independent re-verification | Active research area (e.g., CHARM framework) explicitly proposing detection/mitigation architectures mapped to NIST RMF functions<cite index="9-1">CHARM directly addresses hallucination by mapping its architectural mitigations to the foundational functions of the broader NIST AI RMF.</cite> |
| **Unauthorized Transactions / Incorrect Refunds & Disputes** | Agent executes a financially consequential action outside its actual mandate, or misjudges a dispute | Combination of the above risks manifesting in a specific, customer-facing financial outcome | Amex has already built a partial product mitigation here: Agent Purchase Protection covers eligible charges after an eligible agent error<cite index="36-1">Amex Agent Purchase Protection is available for eligible charges only after the Card Member has initiated a return with the merchant following an eligible agent error.</cite> — this is a financial backstop, not a prevention control, and Shield should aim to reduce the *rate* of triggering events, not just fund the remediation |
| **Multi-Agent Deadlocks / Infinite Loops / Runaway Autonomy** | Agents coordinating with other agents (internal or external, e.g., a merchant's agent) get stuck in unproductive or unbounded loops | Emergent property of multi-agent systems without global liveness guarantees | Durable-execution frameworks (Temporal) provide timeout/kill-switch primitives; needs explicit step-budget and cost-budget enforcement at the orchestration layer |
| **Data / Model Poisoning, Training Data Leakage** | Adversarial manipulation of training or retrieval data; PII leaking through model outputs | Standard ML supply-chain and memorization risks, amplified when agents have write access to systems that later feed training/fine-tuning pipelines | Requires strict separation between production agent context and any data used for future fine-tuning, plus PII-scrubbing at ingestion |
| **Explainability / Auditability Gaps** | Inability to reconstruct why an agent took a specific action | Free-form chain-of-thought is not a reliable or complete record of the actual causal decision process | Shield's Audit Engine (§9) must log structured decision points (policy inputs, tool calls, tool outputs, final action) independent of — and in addition to — any natural-language reasoning trace |
| **Cost Explosion / Latency / Availability** | Runaway token spend, multi-agent call chains multiplying latency, single points of failure | Operational risk inherent to any distributed, LLM-call-heavy architecture | Budget enforcement, circuit breakers, model routing/fallback strategy (§11) |
| **Regulatory Non-Compliance (EU AI Act Art. 10/12, DORA Art. 12/18/26)** | Missing data-governance documentation or automatic logging for high-risk systems | Treating compliance as a documentation exercise rather than an architectural requirement | Must be designed in, not retrofitted (§5) |

**Deepen next:** AML/KYC-specific agent risks (an agent inadvertently structuring transactions, or failing to flag suspicious patterns it would have caught as a classifier) deserve their own dedicated risk workshop with Amex's existing BSA/AML compliance team, since this is where regulatory and criminal liability exposure is highest and where I have the least ability to responsibly speak for Amex's specific existing controls.

---

## 8. Where Current Solutions Fall Short — Research & Engineering Gaps

1. **Protocol security is architectural, not just implementation-level.** The MCP security analysis found the vulnerabilities to be structural — absent capability attestation, unauthenticated bidirectional sampling — meaning point patches don't fully close the gap; only a protocol-level extension (like the proposed AttestMCP) or a mediating gateway that Shield controls can.<cite index="20-1">The findings establish that MCP's security weaknesses are architectural rather than implementation-specific, requiring protocol-level remediation.</cite>

2. **Defenses lag attacks badly.** Even the best current defenses in academic benchmarks leave double-digit attack success rates; WASP's authors bluntly describe current agent robustness as incompetence-driven rather than defense-driven.<cite index="40-1"></cite> This means Shield cannot rely on "the model will refuse" as a control — it needs deterministic, non-model-based enforcement (policy engine, sandboxed tool execution, human gates) as the actual safety boundary.

3. **No unified compliance-to-engineering mapping exists yet for agentic AI specifically.** NIST's GenAI Profile and the proposed Agentic Profile are governance-level, not technical-standard-level.<cite index="7-1">Across evaluated categories with above-baseline scores, the framework's coverage is consistently governance-level, reflecting its character as a risk management profile rather than a technical security standard.</cite> Someone has to do the translation work from "Article 12 requires automatic logging" to "here is the schema, retention policy, and query interface" — that translation work is itself a core piece of Shield's value, and no vendor product does it off the shelf for Amex's specific stack today (based on this research pass; a deeper vendor bake-off could surface an exception).

4. **Orchestration and governance are currently separate concerns in the tooling landscape.** LangGraph gives reasoning flexibility; Temporal gives durability; neither is a policy/compliance engine. Cedar/OPA give authorization; neither orchestrates or logs a full agent run. Shield's core architectural contribution is **gluing these together** into one coherent control plane rather than assuming any single vendor product already does this end-to-end.

5. **Payment-network protocols solve consent, not internal governance**, as established in §4.1 — a structural, not incidental, gap for any issuer building on top of them.

---

## 9. Product Design: AmEx Shield

### 9.1 Vision
Every AI agent that touches an Amex customer's money, credit, or data operates inside a governance boundary that is as rigorous, auditable, and battle-tested as the human approval chains it augments or replaces — so that "an agent did it" is never a weaker answer to a regulator or a customer than "a person did it."

### 9.2 Mission
Give Amex's risk, compliance, and product organizations a single control plane to define, enforce, monitor, and prove what every internal and partner-facing agent is allowed to do — before agentic AI scales past the point where retrofitting governance is possible.

### 9.3 Core Principles
- **Deterministic enforcement over model trust.** The model proposes; the policy engine, not the model, disposes. Every consequential action passes through a non-bypassable authorization check that does not depend on the model "choosing" to be safe.
- **Least agency.** Grant each agent the minimum autonomy needed for its task — directly adopting OWASP's 2026 framing.<cite index="49-1">OWASP introduces the concept of least agency in the 2026 list: only grant agents the minimum autonomy required to perform safe, bounded tasks.</cite>
- **Everything is replayable.** Any action must be reconstructable from an immutable log, independent of the model's own natural-language explanation of itself.
- **Human authority is explicit and tiered**, not implicit in "someone was probably watching."
- **Compliance is a build-time constraint, not a post-hoc audit exercise.**
- **The control plane is agent-framework-agnostic.** Shield governs actions and identities, not any single agent SDK, so it survives the current framework churn (LangGraph today, something else in three years).

### 9.4 Trust Model
Three trust boundaries, each independently enforced:
1. **Human ↔ Agent** — the customer or employee's consent/intent is captured as a signed, scoped mandate (directly modeled on AP2's Intent Mandate / Cart Mandate pattern, which Amex already participates in as a launch partner).<cite index="21-1">AP2 defines an Intent Mandate representing what the user wants and a Cart Mandate representing what the agent proposes to buy, both signed as verifiable records.</cite>
2. **Agent ↔ Tool/System of Record** — every tool call is authorized against policy at call time, not just at agent-deployment time, addressing the multi-hop delegation gap identified by AWS.<cite index="52-1"></cite>
3. **Agent ↔ Agent** (internal multi-agent, or Amex agent ↔ external merchant/partner agent) — identity attestation and scope-bounded delegation tokens, not implicit trust propagation, directly addressing the MCP "implicit trust propagation in multi-server configurations" vulnerability.<cite index="20-1"></cite>

### 9.5 Core Engines

- **Authorization Engine** — Cedar or OPA policy evaluation at every tool call; policies are versioned, testable, and owned by risk/compliance teams, not hardcoded in agent prompts.
- **Risk Engine** — computes a real-time risk score per action (amount, counterparty novelty, channel, agent confidence, historical anomaly signal) that determines which tier of review applies.
- **Decision/Governance Engine** — the orchestration brain deciding, per risk tier: auto-approve, human-in-the-loop (blocking approval required), human-on-the-loop (async review + rollback window), or hard-deny.
- **Compliance Engine** — maps every logged decision to the specific regulatory citation it satisfies (EU AI Act Art. 10/12, DORA Art. 12/18/26, PCI DSS control IDs) so an audit is a query, not a project.
- **Audit Engine** — immutable, structured, replayable event log (see §10.4) — separate from any vendor observability tool, because regulator-facing evidence cannot depend on a third party's retention policy.
- **AI Firewall / Guardrails** — input/output filtering, prompt-injection detection at the tool-output boundary (the point WASP and InjecAgent research identifies as highest-risk), and a hard allowlist of callable tools per agent role.
- **Evaluation Framework** — continuous red-teaming against AgentDojo/InjecAgent/ASB-style benchmarks as a release gate, not a one-time certification.

### 9.6 Human-in-the-Loop vs. Human-on-the-Loop Strategy
- **HITL (blocking):** any action above a dynamic dollar/risk threshold, any first-time counterparty, any action affecting a protected/vulnerable customer flag, any credit-limit or underwriting decision above a defined delta.
- **HOTL (async, sampled + full-coverage for high-risk categories):** routine, previously-approved-pattern transactions below threshold; reviewed on a rolling basis with a rollback/reversal window, consistent with how Amex already frames Agent Purchase Protection as a post-hoc remediation backstop.<cite index="36-1"></cite>
- Thresholds are **not static** — they are themselves governed artifacts, versioned and testable, adjustable by risk teams without an engineering release cycle (a policy-as-data pattern, not policy-as-code baked into the agent).

### 9.7 Memory, Context, and Knowledge Management
- Session memory is scoped per-agent-run and does not persist across customers or sessions unless explicitly required and logged.
- Any memory or RAG store an agent reads from is itself a governed asset — write access to it is authorization-checked exactly like any other tool, since poisoned memory/RAG stores are an explicitly named attack vector.<cite index="54-1"></cite>
- Long-term knowledge (policy documents, product terms) is retrieved read-only through a dedicated, versioned knowledge service — never fine-tuned ad hoc into a production model, to keep provenance traceable.

### 9.8 Incident Response
- Every agent identity carries a **kill switch** independent of the model provider's own controls — Shield can revoke an agent's tool-calling credentials in real time regardless of which model is behind it.
- Incident classification explicitly covers "AI-related ICT incident" as its own category, feeding directly into DORA's existing incident-reporting obligations rather than creating a parallel process.<cite index="62-1">Organizations should check that their incident response process covers AI system failures, with incident classification criteria explicit about what constitutes an AI-related ICT incident.</cite>

### 9.9 Model Routing / Multi-Model Strategy
Route by task risk tier, not by a single default model: higher-risk, consequential decisions route to the most capable/most-evaluated model with mandatory HITL; lower-risk, high-volume tasks (categorization, summarization) route to smaller/cheaper models behind the same policy engine. This is a cost-optimization move as much as a safety one, and it's why the Authorization Engine must be model-agnostic — it enforces policy on the *action*, not on which model produced it.

---

## 10. Technical Architecture

### 10.1 High-level flow

```
Customer / Employee
       │  (signed intent — AP2-style mandate)
       ▼
┌─────────────────────────┐
│   Agent Orchestration    │  LangGraph (reasoning) inside
│   Layer                  │  Temporal (durable execution,
│                           │  retries, HITL pause/resume)
└─────────────┬─────────────┘
              │  every tool call intercepted
              ▼
┌─────────────────────────┐
│   MCP Gateway             │  capability-attested, signed
│   (hardened per §8.1)     │  tool registry; sandboxed exec;
│                           │  input validation on all params
└─────────────┬─────────────┘
              │
              ▼
┌─────────────────────────┐      ┌───────────────────────┐
│   Authorization Engine    │◄────►│   Risk Engine          │
│   (Cedar / OPA)           │      │   (real-time scoring)  │
└─────────────┬─────────────┘      └───────────────────────┘
              │ allow / deny / require-review
              ▼
┌─────────────────────────┐      ┌───────────────────────┐
│   Decision / Governance   │◄────►│  HITL Approval Queue   │
│   Engine                  │      │  (human review UI)     │
└─────────────┬─────────────┘      └───────────────────────┘
              │ approved actions only
              ▼
┌─────────────────────────┐
│  Systems of Record        │  cards, accounts, underwriting,
│  (existing Amex core)     │  disbursement, CRM
└─────────────┬─────────────┘
              │
              ▼
┌─────────────────────────┐
│   Audit / Compliance      │  immutable structured log,
│   Engine                  │  regulator-queryable, mapped
│                           │  to EU AI Act / DORA article IDs
└───────────────────────────┘
```

### 10.2 Orchestration & durability
Adopt the two-layer pattern validated by current production usage: LangGraph for the agent's reasoning graph (cyclical, non-deterministic tool selection), wrapped in Temporal workflows for guaranteed durable execution, retries, and — critically for Shield — native long-running human-in-the-loop pause/resume semantics.<cite index="65-1"></cite> Temporal's own execution history is itself a partial audit trail (every step visible, retryable, auditable),<cite index="64-1">every step of every run is visible, retryable, and auditable through Temporal's tooling</cite> which Shield's Audit Engine builds on rather than duplicates. This pattern is already validated at production scale by other regulated/high-stakes users (Klarna is cited in current production comparisons of this exact stack).<cite index="63-1">Klarna's scale is exactly where orchestration choices become visible.</cite>

### 10.3 Tool-calling layer: MCP, hardened
Standardize on MCP for tool exposure (it's already the de facto standard adopted across OpenAI, Google DeepMind, Microsoft, and thousands of enterprise teams, and is now foundation-governed rather than single-vendor).<cite index="14-1"></cite> But treat the raw spec as insufficient on its own, given the documented architectural vulnerabilities:<cite index="20-1"></cite>
- Require the Nov 2025 OAuth 2.1 baseline at minimum for any remote MCP server.<cite index="12-1"></cite>
- Add a Shield-controlled **capability attestation layer** in front of any MCP server before it's addressable by a production agent — don't trust server-declared capabilities.
- Sandbox all stdio-based server execution; strict input validation on any parameter that could reach a shell, closing the RCE class of vulnerability reported in 2026.<cite index="17-1"></cite>
- Maintain a signed, versioned internal tool registry — no agent calls an unregistered or unattested tool, full stop.

### 10.4 Audit & data layer
- **Structured event store** (e.g., append-only log + PostgreSQL/columnar store) capturing: agent identity, human/customer identity, mandate reference, policy version evaluated, risk score, tool calls with parameters and outputs, final action, approver identity (if HITL), timestamp chain.
- **Separation from vendor observability tooling** (LangSmith-class tools remain valuable for engineering debugging, but the regulator/audit-facing log is Amex-owned, immutable, and retained per DORA/EU AI Act schedules independent of any vendor's retention defaults).
- **Vector/knowledge layer** (for RAG-based policy/knowledge lookups) kept read-only and versioned separately from the audit log — never conflate "what the agent knew" with "what the agent did."

### 10.5 Security architecture
- Zero Trust between every component in the diagram above — no implicit trust even between Shield's own internal services.
- Secrets management (e.g., vault-based) for all tool credentials; agents never hold raw long-lived credentials, only short-lived, scope-bound tokens issued per authorized action.
- RBAC for human operators of the Shield console; ABAC/PBAC (Cedar-native) for agent-to-resource authorization, since agent authorization needs to be a function of dynamic attributes (risk score, counterparty, time) not just static roles.

### 10.6 Observability
OpenTelemetry-based tracing threaded through both the LangGraph and Temporal layers (Temporal's LangSmith integration already demonstrates this is technically solvable — one run, one trace, across process boundaries).<cite index="64-1"></cite> Prometheus/Grafana for operational metrics (latency, cost, approval-queue depth); the Audit Engine remains the system of record for compliance, while OTel/Grafana serve engineering operations.

**Deepen next:** full sequence diagrams per major workflow (credit-line agent decision, dispute-resolution agent, agentic-commerce checkout via ACE), plus a formal data-flow diagram mapped to PCI DSS scope boundaries — genuinely a systems-design workshop deliverable, not a desk-research one.

---

## 11. AI Stack: Build vs. Buy

| Subsystem | Recommendation | Justification |
|---|---|---|
| Foundation model(s) | **Buy** (multi-model via API) | No enterprise realistically trains a frontier model in-house for this; the differentiation is in the governance layer, not the base model |
| Agent reasoning framework | **Buy/open-source** (LangGraph) | Fast-moving ecosystem; building a bespoke reasoning framework is not Amex's core competency and would fall behind the field within a year |
| Durable execution / orchestration | **Buy** (Temporal, self-hosted or Temporal Cloud) | Already proven at production scale for exactly this pattern;<cite index="63-1"></cite> reinventing durable execution is a multi-year distributed-systems project with no differentiation upside |
| Tool-calling protocol | **Buy/adopt standard** (MCP) + **Build** the hardening/attestation layer | Standing up a proprietary protocol would isolate Amex from the ecosystem now converging on MCP; the attestation/gateway hardening is exactly where Amex-specific governance value is created and should be built in-house |
| Policy/authorization engine | **Buy/open-source** (Cedar or OPA) + **Build** the policy library itself | The engine is commoditized infrastructure; the actual Amex-specific policies (what an underwriting agent may do) are proprietary IP and must be built and owned internally |
| Risk scoring model | **Build** (leveraging existing Amex fraud ML) | Amex's fraud model already processes $1.2T+ in transaction value annually;<cite index="34-1"></cite> this is a genuine, defensible internal asset — extend it rather than buying a generic third-party risk score |
| Audit/compliance engine | **Build** | Regulator-facing evidence generation mapped to Amex's specific control framework is not something any vendor can own on Amex's behalf; DORA explicitly makes accountability non-transferable to vendors<cite index="58-1">Deployer accountability does not transfer to your vendor.</cite> |
| Observability (engineering-facing) | **Buy** (OpenTelemetry + existing APM stack; optionally LangSmith-class tooling) | Commodity tooling; no reason to build |
| Eval / red-team harness | **Hybrid** — buy/adopt open benchmarks (AgentDojo, InjecAgent, ASB) as a baseline, build Amex-specific financial-workflow test scenarios on top | Public benchmarks won't cover Amex's specific product surface (card disputes, underwriting) but provide a validated, comparable floor |
| Agent-identity / credentialing | **Build**, aligned to emerging network standards (AP2 mandates, ACE Payment Credentials) | This is Shield's core differentiator and must interoperate with Amex's own external ACE kit rather than be a separate silo |

---

## 12. Implementation Roadmap

**MVP (0–3 months):** Single internal use case (e.g., expense-report policy verification agent, already on Amex's public roadmap<cite index="30-1">Amex plans an AI-powered expense app that will help automate expense reporting for employees, from receipt capture to policy verification to submission for approvals.</cite>). Authorization Engine (Cedar) + basic Audit Engine + HITL queue for anything above a low dollar threshold. No external agent-to-agent surface yet.

**V1 (3–9 months):** Add Risk Engine integration with existing fraud ML; expand to a second internal use case (servicing/dispute agent). Stand up the hardened MCP gateway with capability attestation. Begin EU AI Act Art. 10/12 and DORA-aligned logging schema formally, ahead of the Aug 2026 deadline.

**V2 (9–18 months):** Multi-agent orchestration (Temporal + LangGraph two-layer pattern) for workflows spanning multiple internal agents. Integrate with Amex's own ACE developer kit so externally-facing agentic-commerce flows (Agent Registration, Cart Context, once those specs mature past "in development") share the same governance spine as internal agents rather than being governed separately.

**V3 / Enterprise (18–36 months):** Full policy-as-data self-service for risk/compliance teams (no engineering release cycle to change a threshold). Formal conformity-assessment tooling for EU AI Act high-risk systems. Cross-border policy variants (US/EU/other jurisdictions) from a single policy library.

**Future roadmap (36+ months):** Shield as a potential external offering — the same pattern Amex already has precedent for productizing (ACE itself, offered to "select partners").<cite index="30-1">The American Express Agentic Commerce Experiences developer kit is designed to enable select partners to seamlessly integrate our payment capabilities into their agentic experiences.</cite> A governance-layer product could plausibly follow the same partner-enablement model.

---

## 13. Hackathon Execution Strategy

Switching perspective, as instructed, to what actually wins a hackathon demo without misrepresenting the enterprise substance above:

**What will impress judges most:**
- A **live, visible policy denial** — show an agent attempting an out-of-policy action (e.g., a refund above threshold to a first-time counterparty) and Shield blocking it in real time, with the specific policy rule shown on screen. This is more memorable than any amount of architecture slides.
- A **replayable audit trail** — click on a past agent decision and show the full reconstructed reasoning/policy/approval chain. Judges who've seen a dozen "AI agent" demos rarely see the audit story; it's a genuine differentiator.
- A **kill switch** — mid-demo, revoke an agent's credentials and show an in-flight action get halted. High visual impact, directly demonstrates the "governance, not just automation" thesis.

**What to simplify for the demo:**
- Use a single policy engine (Cedar) rather than showing the full Cedar/OPA build-vs-buy analysis.
- Simulate the durable-execution/Temporal layer's crash-recovery behavior rather than actually killing and restarting workers live (real, but harder to stage reliably in a 3-minute demo).
- Use synthetic transaction data, clearly labeled as such — don't imply live production data.
- Skip the full EU AI Act/DORA compliance-mapping UI; mention it exists, show one example row.

**What should be shown live vs. simulated:**
- Live: policy denial, approval queue UI, audit trail replay, kill switch.
- Simulated (clearly labeled): the underlying LLM's reasoning trace (can be pre-recorded to avoid live-demo model-latency risk), the multi-agent delegation chain if too complex to run reliably live.

**Metrics to display:** attack/injection block rate against a known benchmark subset (even a small self-run AgentDojo-style test set lends real credibility — "we tested against the same benchmark used in the 2025 InjecAgent paper" is a strong, verifiable claim); policy decision latency; percentage of actions auto-approved vs. HITL vs. denied.

**Story to tell:** "Every payment network just shipped the rails for AI agents to act on your behalf. Nobody has shipped the seatbelt. AmEx Shield is the seatbelt — and it's the same one whether the agent is ours or a partner's." Anchor it explicitly in Amex's own public framing of this moment as the biggest shift since e-commerce,<cite index="30-1"></cite> which gives the pitch external credibility beyond the hackathon room.

**Maximizing credible wow factor:** the single highest-leverage move is grounding the demo's attack scenario in a *real, cited* academic benchmark rather than an invented one — judges with any security background will recognize AgentDojo/InjecAgent/OWASP ASI naming and it substantially raises perceived rigor over a generic "we prevent bad stuff" narrative.

---

## 14. Top 20 Risks (Program-Level, Not Just Threat-Model-Level)

1. Treating this as a compliance checkbox project rather than an architecture-first build — retrofitting audit logging is materially harder than designing for it.
2. Underestimating attack success rates because internal red-teaming is weaker than academic benchmarks (which already show up to 84% success against current defenses).<cite index="40-1"></cite>
3. Vendor lock-in to a single agent framework that falls out of favor within 18 months (mitigate via the model/framework-agnostic Authorization Engine design in §9.3).
4. MCP's architectural vulnerabilities being inherited wholesale without the attestation hardening layer.<cite index="20-1"></cite>
5. Policy thresholds becoming stale because they're hardcoded rather than governed as versioned, testable data.
6. HITL queues becoming a rubber-stamp bottleneck (reviewer fatigue leading to de facto auto-approval) — needs its own quality-monitoring loop.
7. Audit logs that are complete but not actually queryable in the format regulators request under time pressure.
8. Divergence between Shield's internal governance and Amex's external ACE/AP2 commitments, creating two sources of truth for what an agent is allowed to do.
9. Multi-agent deadlocks or cost explosions in production going undetected until a cost or SLA incident.
10. Over-scoped agent credentials issued during MVP that never get tightened as the system matures ("permission creep").
11. DORA and EU AI Act obligations being treated as separate workstreams rather than a single compliance stack, duplicating effort or leaving gaps.<cite index="61-1"></cite>
12. Reliance on a single foundation-model provider's safety training as the actual security boundary, rather than Shield's own deterministic controls.
13. Insufficient sandboxing of stdio-based MCP tool execution, leaving the documented RCE class of vulnerability open.<cite index="17-1"></cite>
14. Customer trust erosion if an early, visible agent error (incorrect refund/dispute) isn't clearly and quickly remediated — Agent Purchase Protection helps here but is reactive.<cite index="36-1"></cite>
15. Internal misalignment between engineering, risk, and compliance teams on who owns policy authorship (this should sit with risk/compliance, not engineering, by design).
16. Underinvestment in the eval harness relative to the orchestration layer — flashy demos, weak red-teaming.
17. Regulatory landscape shifting faster than the roadmap (EU AI Act enforcement date is fixed, but interpretation and enforcement posture may evolve).
18. Third-party/partner agents (in a multi-agent commerce scenario) not being held to the same governance bar as Amex's own agents, creating a weak link.
19. Insufficient incident-response tabletop testing before a real production incident occurs.
20. Treating this dossier's roadmap as complete rather than as a living document requiring the "deepen next" follow-ups flagged throughout.

---

## 15. Future Research Directions

- **Formal verification of agent policy compliance** — extending Cedar's formally-verified authorization model to verify properties of the *agent's plan* before execution, not just each individual tool call in isolation.
- **Standardized, regulator-recognized agentic AI audit formats** — currently every framework (EU AI Act Art. 12, DORA Art. 18) specifies *what* must be logged but not a common schema; an industry-standard "agent decision record" format (analogous to what SAML/OIDC did for identity assertions) would reduce compliance cost industry-wide and is a space Amex, as a network with both issuing and standards-participation leverage, could help shape.
- **Real-time, protocol-level capability attestation** for MCP becoming a ratified part of the spec rather than a proprietary Shield extension — worth Amex actively engaging the Agentic AI Foundation given Anthropic, Block, and OpenAI already co-founded it.<cite index="14-1"></cite>
- **Causal, non-narrative audit trails** — moving beyond "the model's chain-of-thought says X" toward structurally-verified decision records, building on emerging inference-time defense research (e.g., causal-attribution-based sanitization).<cite index="44-1">CausalArmor uses causal attribution to selectively sanitize untrusted content at privileged decision points.</cite>
- **Cross-network governance interoperability** — as Visa TAP, Mastercard Agent Pay, AP2, and ACP converge on shared primitives (several already interoperate via Cloudflare Web Bot Auth and Google's Universal Commerce Protocol),<cite index="28-1"></cite> an open question is whether internal governance layers like Shield should expose a standardized interface too, so that a merchant's or partner's agent-governance posture can be verified the way payment credentials already are.

---

## 16. Bibliography (Verified Sources Only)

Every source below was retrieved live during this research pass; no citation in this document was invented.

**Standards & Regulation**
- NIST AI Risk Management Framework — https://www.nist.gov/itl/ai-risk-management-framework
- NIST AI 600-1 Generative AI Profile — https://doi.org/10.6028/NIST.AI.600-1
- DLA Piper, "NIST releases its Generative Artificial Intelligence Profile: Key points" — https://www.dlapiper.com/en-us/insights/publications/ai-outlook/2024/nist-releases-its-generative-artificial-intelligence-profile
- "NIST AI Risk Management Framework: Agentic Profile" (Cloud Security Alliance Lab Space) — https://labs.cloudsecurityalliance.org/agentic/agentic-nist-ai-rmf-profile-v1/
- Modulos, "Implement NIST AI Risk Management Framework" — https://www.modulos.ai/nist-ai-rmf/
- EU AI Act / DORA compliance analyses — https://digiwit.ai/blog/dora-onpremise-ai ; https://iomete.com/resources/blog/dora-eu-ai-act-financial-institutions-data-infrastructure ; https://www.knowlee.ai/blog/ai-act-financial-services-compliance ; https://sysart.consulting/insights/sovereign-ai-financial-services-on-premises-dora/ ; https://sebastienrousseau.com/2026-05-28-dora-ai-act-data-sovereignty-banking-compliance-stack-2026/index.html ; https://doragrc.com/blog/eu-ai-act-dora-financial-services-ai-risk
- OWASP Top 10 for Agentic Applications — https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/ ; https://genai.owasp.org/2025/12/09/owasp-top-10-for-agentic-applications-the-benchmark-for-agentic-security-in-the-age-of-autonomous-ai/

**Academic / Technical Papers**
- Maloyan & Namiot, "Breaking the Protocol: Security Analysis of the Model Context Protocol Specification and Prompt Injection Vulnerabilities in Tool-Integrated LLM Agents" — https://arxiv.org/html/2601.17549v1
- "Model Context Protocol (MCP): Landscape, Security Threats, and Future Research Directions" — https://arxiv.org/pdf/2503.23278
- "Security Considerations for Multi-agent Systems" — https://arxiv.org/pdf/2603.09002
- "Open Problems in Technical AI Governance" — https://arxiv.org/pdf/2407.14981
- "Cascading Hallucination in Agentic RAG: The CHARM Framework" — https://arxiv.org/pdf/2606.04435
- "Taxonomy and Consistency Analysis of Safety Benchmarks for AI Agents" (covers AgentDojo, InjecAgent, Agent Security Bench, WASP, MCP-SafetyBench) — https://arxiv.org/pdf/2605.16282
- "Assessing Automated Prompt Injection Attacks in Agentic Environments" — https://arxiv.org/html/2606.10525v1
- Zhan et al., "InjecAgent: Benchmarking Indirect Prompt Injections in Tool-Integrated Large Language Model Agents" — https://doi.org/10.18653/v1/2024.findings-acl.624

**Protocols & Infrastructure**
- Model Context Protocol specification — https://modelcontextprotocol.io/specification/2025-11-25
- Anthropic, "Introducing the Model Context Protocol" — https://www.anthropic.com/news/model-context-protocol
- MCP Wikipedia entry (general background/timeline) — https://en.wikipedia.org/wiki/Model_Context_Protocol
- Zenity, "What Is the Model Context Protocol? Full Guide" — https://zenity.io/academy/model-context-protocol-explained
- AWS Security Blog, "Enforce least-privilege authorization in multi-agent AI chains using Cedar" — https://aws.amazon.com/blogs/security/enforce-least-privilege-authorization-in-multi-agent-ai-chains-using-cedar/
- LangChain, "LangGraph vs Temporal" — https://www.langchain.com/resources/langgraph-vs-temporal
- Temporal, "LangGraph in production: Temporal's LangGraph Plugin adds Durable Execution" — https://temporal.io/blog/temporal-langgraph-plugin-durable-execution

**Market / Payments**
- American Express 2026 Chairman's Letter to Shareholders — https://www.americanexpress.com/en-us/newsroom/articles/financial-news/2026-chairman-s-letter-to-shareholders.html
- American Express, Agentic Commerce Experiences (ACE) — https://www.americanexpress.com/en-us/company/agentic-commerce/
- American Banker, "Amex reports earnings in line with analyst expectations" — https://www.americanbanker.com/payments/news/amex-reports-earnings-in-line-with-analyst-expectations
- Emerj, "Artificial Intelligence at American Express" — https://emerj.com/artificial-intelligence-at-american-express-2/
- Visa, "Visa and Partners Complete Secure AI Transactions" — https://usa.visa.com/about-visa/newsroom/press-releases.releaseId.21961.html
- TechInformed, "Visa opens one integration for AI agent payments" — https://techinformed.com/visa-opens-one-integration-for-ai-agent-payments/
- Eco, "What Is Mastercard Agent Pay?" — https://eco.com/support/en/articles/15192001-what-is-mastercard-agent-pay-ai-agent-commerce-protocol-in-2026
- Paz.ai, "Visa, Mastercard, PayPal Agentic Commerce Moves: Q4 2025 Guide" — https://www.paz.ai/blog/the-payment-networks-are-all-in-what-visa-mastercard-and-paypals-q4-moves-signal
- American Banker, "Visa, Mastercard expand agentic AI deployments" — https://www.americanbanker.com/payments/news/visa-mastercard-expand-agentic-ai-deployments

---

## 17. Appendix

### A. What this dossier does not yet cover, and should before an actual leadership decision
- A verified patent landscape (numbers, filers, white space) — the brief's patent-research section requires dedicated patent-database access (USPTO/EPO full-text search), not general web search, to do responsibly.
- A verified, current startup directory (YC/Techstars/NVIDIA Inception/OpenAI Startup Fund) — these change monthly and deserve a dedicated, dated snapshot rather than a one-off search.
- Amex-internal system architecture specifics (this dossier necessarily worked from public information only; actual integration points with Amex's core banking, underwriting, and CRM systems require internal architecture review).
- A full 40+ paper academic literature table with individually verified DOIs, authors, and per-paper weaknesses as originally requested — §6 above is a grounded starting set, not the complete survey.
- Jurisdiction-specific analysis beyond the EU (RBI, and other markets where Amex operates).

### B. Suggested immediate next actions
1. Commission the four follow-up volumes flagged throughout ("Deepen next" callouts) as separate, scoped research tracks.
2. Stand up a small cross-functional working group (the same eleven-role team framing from the brief is a good model: research, architecture, security, compliance, product) to validate §9's design principles against Amex's actual internal systems before committing to the roadmap in §12.
3. Prioritize the EU AI Act/DORA logging-schema work given the fixed Aug 2, 2026 deadline — this is the one item on this roadmap with a hard external clock already running.

---

*End of Volume I. This document is intended as a rigorous starting point for a real research and build program, not a finished 150-page dossier — see the note at the top for why, and the "Deepen next" markers throughout for how to extend it responsibly.*

