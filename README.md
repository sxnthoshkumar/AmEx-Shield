# 🛡️ AmEx Shield — Financial AI Control Plane

> **The Living Trust Fabric for Autonomous Financial AI Agents**  
> *Enterprise Spec v2026.07 • EU AI Act Article 12 & DORA Article 18 Compliant*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1-646CFF.svg)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38BDF8.svg)](https://tailwindcss.com/)
[![Compliance](https://img.shields.io/badge/Regulatory-EU_AI_Act_Art_12_|_DORA_Art_18-emerald.svg)]()

---

## 💡 Executive Summary (Explain Like I'm 5)

In 2025–2026, payment networks like Visa, Mastercard, Google (AP2), and American Express (ACE) built the **rails** for AI agents to spend money and make purchases on behalf of humans.

However, **nobody built the seatbelt**. 

When an AI agent at a bank or credit card company attempts to approve a credit line increase, issue a dispute refund, or process an expense report:
- How do we know the agent hasn't been **tricked by a prompt injection attack**?
- How do we know the agent isn't **acting outside what the customer authorized**?
- How do we satisfy global banking regulators (EU AI Act, DORA) that every decision is **auditable, deterministic, and safe**?

**AmEx Shield is that seatbelt.** It is an enterprise-grade runtime governance control plane that intercepts every AI agent action, evaluates machine-readable policy rules, simulates outcomes in a parallel digital twin, tracks agent credit scores, and generates cryptographically signed decision receipts.

---

## 🏛️ The 7 Core Governance Mechanisms ("Living Trust Fabric")

AmEx Shield synthesizes 7 novel technical inventions into a single unified governance plane:

```
                  ┌─────────────────────────────────────────────────────────┐
                  │                 Signed Human Mandate                    │
                  │                   (AP2 / ACE Protocol)                  │
                  └────────────────────────────┬────────────────────────────┘
                                               │
                                               ▼
                  ┌─────────────────────────────────────────────────────────┐
                  │            LangGraph / MCP Agent Execution              │
                  └────────────────────────────┬────────────────────────────┘
                                               │ Every tool call intercepted
                                               ▼
    ┌─────────────────────────────────────────────────────────────────────────────────────┐
    │                                  AMEX SHIELD                                        │
    │                                                                                     │
    │  ┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐  │
    │  │   AI Firewall (#7)    │   │  Cedar Policy Engine  │   │   Risk Budget (#8)    │  │
    │  │ (OWASP Injection Scan)│   │  (Dynamic ABAC/PBAC)  │   │  (Circuit Breaker)    │  │
    │  └───────────┬───────────┘   └───────────┬───────────┘   └───────────┬───────────┘  │
    │              │                           │                           │              │
    │              ▼                           ▼                           ▼              │
    │  ┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐  │
    │  │ Governance Passport(#1)│  │ Shadow Twin Sim (#3)  │   │  Authority DAG (#6)   │  │
    │  │ (Trust Decay Engine #5)│  │(Digital Account Twin) │   │ (Multi-Hop Provenance)│  │
    │  └───────────────────────┘   └───────────────────────┘   └───────────────────────┘  │
    └──────────────────────────────────────────┬──────────────────────────────────────────┘
                                               │
                           ┌───────────────────┴───────────────────┐
                           ▼                                       ▼
                 [ PERMIT / ALLOW ]                       [ REQUIRE HITL / FORBID ]
                           │                                       │
                           ▼                                       ▼
             ┌───────────────────────────┐           ┌───────────────────────────┐
             │  Decision Certificate (#10)│           │ Human Review Queue (#16)  │
             │  (ECDSA Cryptographic Log)│           │ (Reflexive Pre-Mortem)    │
             └───────────────────────────┘           └───────────────────────────┘
```

### 1. Governance Passport (#1) & Trust Decay Engine (#5)
* **What it is**: "A credit score for AI agents."
* **How it works**: Every non-human financial agent carries a portable, cryptographically signed behavioral credential. If an agent executes clean, policy-compliant actions, its trust score increases. If it makes a bad decision or encounters a security violation, its trust score drops sharply and places the agent on **Probation**.

### 2. Cedar / OPA Dynamic Authorization Engine
* **What it is**: Machine-readable policy evaluation based on **Least Agency**.
* **How it works**: Evaluates dynamic attributes (action type, transaction amount, counterparty, agent trust score) before any tool call executes (`PERMIT`, `FORBID`, `REQUIRE_HITL`).

### 3. Economic Circuit Breaker & Risk Budget Market (#8)
* **What it is**: Spendable risk budgets for AI agents.
* **How it works**: Every agent receives a daily risk budget denominated in expected loss units ($). High-risk transactions debit more budget. When the risk budget is exhausted, the agent is automatically throttled to mandatory Human-in-the-Loop (HITL) review.

### 4. Counterfactual Shadow Execution (#3) & Digital Twins (#12)
* **What it is**: Parallel universe pre-execution simulation.
* **How it works**: Before writing to any real banking database, the proposed action is executed against a simulated digital twin of the customer's account. If the predicted outcome strays from historical spend envelopes, Shield gates the action.

### 5. Adversarial Self-Red-Teaming Twin (#7)
* **What it is**: Continuous AI firewall and immune system.
* **How it works**: Scans all incoming tool payloads and reasoning text for **OWASP ASI01 (Prompt Injections)**, **OWASP ASI03 (Privilege Abuse)**, and **MCP Stdio Code Execution** exploits.

### 6. Authority Provenance DAG (#6)
* **What it is**: Multi-hop delegation graph.
* **How it works**: Maps human mandate → primary agent → sub-agent → MCP tool call in a hash-linked Directed Acyclic Graph (DAG) to prevent "authority laundering."

### 7. Decision Provenance Certificates (#10)
* **What it is**: Regulator-grade decision receipts.
* **How it works**: Generates cryptographically signed (ECDSA SHA-256) receipts encoding context hashes, policy versions, and reasoning capsules to satisfy **EU AI Act Article 12** and **DORA Article 18**.

---

## 🚀 Beginner Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. Clone or navigate to the project directory:
   ```bash
   git clone https://github.com/sxnthoshkumar/AmEx-Shield.git
   cd AmEx-Shield
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🎮 How to Use the Application

### 1. Control Plane Overview
- View global telemetry metrics: Governed Decisions, Average Trust Score, Pending HITL Approvals, and Regulatory Compliance status.
- Monitor active Agent Governance Passports and real-time signed evaluation activity logs.

### 2. Agent Sandbox (Interactive Simulator)
- Select an Agent Persona (*Credit Line Underwriter*, *Dispute Refund Agent*, *Corporate Expense Verifier*, *AmEx Dining Companion*).
- Configure target action, dollar amount, counterparty, and reasoning.
- **Test Security**: Check the "Simulate Adversarial Attack Payload (#7)" box to launch an OWASP ASI01 prompt injection attack and watch AmEx Shield intercept it live!

### 3. Governance Passports Directory
- Inspect verifiable credentials, public key signatures, capabilities scope, clean streaks, and probation statuses for all registered agents.

### 4. Human-in-the-Loop (HITL) Queue
- Review gated high-risk actions. Read the agent's **Reflexive Pre-Mortem Self-Audit (#16)** detailing potential failure modes and self-confidence before authorizing or rejecting.

### 5. Independent Certificate Verification Tool
- Navigate to **Audit & Certs** and paste any Decision Certificate ID (e.g. `CERT-AMEX-...`) to cryptographically verify signature validity without accessing internal servers.
- Download full audit logs in **JSON** or **CSV** formats formatted for EU AI Act / DORA compliance reports.

### 6. Emergency Kill Switch
- Click the **KILL SWITCH** button in the header bar to immediately revoke all non-human agent credentials across the entire system.

---

## 🛠️ Tech Stack & Project Architecture

* **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Lucide Icons
* **Security & Cryptography**: Web Crypto API (SHA-256 / ECDSA certificate minter)
* **Policy Engine**: Cedar / ABAC / PBAC rule evaluator
* **Dual Engine Architecture**:
  * **Built-in High-Fidelity Simulation**: Works 100% offline with zero external API key requirements.
  * **Optional Live LLM Integration**: Settings modal allows optional configuration of `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`.

```
AmEx Shield Workspace
├── src/
│   ├── types/                  # TypeScript data structures (Passports, Certificates, DAGs)
│   ├── services/
│   │   ├── shieldCore.ts       # Unified Living Trust Fabric orchestration engine
│   │   ├── cryptoService.ts    # ECDSA / SHA-256 Certificate minter & verifier (#10)
│   │   ├── cedarPolicyEngine.ts# Dynamic Cedar / OPA authorization evaluator
│   │   ├── passportEngine.ts   # Governance Passport & Trust Decay Engine (#1, #5)
│   │   ├── riskBudgetEngine.ts # Risk scoring & Economic Circuit Breaker (#8)
│   │   ├── shadowExecution.ts  # Counterfactual Shadow Execution & Digital Twins (#3, #12)
│   │   ├── redTeamEngine.ts    # OWASP ASI01/ASI03 prompt injection scanner (#7)
│   │   ├── governanceGraph.ts  # Authority Provenance DAG builder (#6)
│   │   └── auditCompliance.ts  # EU AI Act & DORA regulatory log exporter
│   ├── components/
│   │   ├── Navbar.tsx          # Sleek header with AmEx Shield Monogram logo & controls
│   │   ├── DashboardOverview.tsx# Control Plane telemetry overview
│   │   ├── InteractiveSimulator.tsx# Interactive Agent Sandbox playground
│   │   ├── PassportDirectory.tsx# Verifiable Passport registry
│   │   ├── HITLApprovalQueue.tsx# Human-in-the-Loop review queue & pre-mortem
│   │   ├── GovernanceGraphView.tsx# Authority Provenance DAG visualizer
│   │   ├── RedTeamPlayground.tsx# Adversarial vulnerability scanner & shadow trace
│   │   ├── ShadowExecutionView.tsx# Counterfactual shadow twin state comparison
│   │   ├── CedarPolicyEditor.tsx# Declarative Cedar rules manager
│   │   ├── AuditComplianceExplorer.tsx# Regulator audit log exporter & cert verifier
│   │   └── SettingsModal.tsx   # Dual-engine API key settings modal
│   ├── App.tsx                 # Root component & state manager
│   └── main.tsx                # Application entry point
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## 📋 Regulatory Compliance Cross-Walk

| Regulatory Article | Requirement | AmEx Shield Implementation |
|---|---|---|
| **EU AI Act Article 12** | Automatic event logging throughout high-risk AI system lifecycle | Every decision produces a cryptographically signed Decision Provenance Certificate (#10) containing input context hashes, policy versions, and execution outcomes. |
| **EU AI Act Article 10** | Continuous data governance & risk boundary checks | Dynamic Cedar policy rules (#15) and Counterfactual Shadow Twins (#3) verify actions against customer spend envelopes before execution. |
| **DORA Article 18** | ICT operational resilience testing & incident reporting | Incident triggers sharply decay agent trust scores (#5), place agents on probation, and export structured DORA logs. |
| **OWASP ASI01 / ASI03** | Prompt Injection & Privilege Abuse mitigation | AI Firewall (#7) sanitizes untrusted inputs and Governance Graph (#6) detects multi-hop authority escalation. |

---

## ⚖️ License

Developed for American Express Enterprise Governance Hackathon 2026. All rights reserved.
