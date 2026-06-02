# Aman Path (مسار أمان)

**Aman Path** is a private, Arabic-first recovery support companion web application tailored for Egypt and the MENA region. It is engineered as an emotionally safe, non-clinical digital sanctuary for people questioning their habits, dealing with chemical/behavioral addictions, or seeking daily support structure in absolute anonymity.

---

## 🚀 Core Features

1. **Anonymous Onboarding**: No real names, emails, or phone numbers. Select a screen name, recovery focus, and your dialect of choice (Modern Standard Arabic, Egyptian Colloquial Arabic, or English) to create your profile.
2. **Daily Pulse Check**: Log your mood, cravings index, sleep hours, and isolation rates with immediate feedback reflections synthesized by our safety-aligned AI engine.
3. **Aman Companion**: An empathetic, supportive chat guide equipped with quick-prompts for urge surfing, sponsor outreach writing, and post-slip recovery analysis.
4. **Urgent Relief Sanctuary**: A dedicated panic screen featuring an interactive 60-second deep breathing pacing visualizer, a 20-minute urge delay timer, and localized crisis helpline links.
5. **Private Secure Journal**: A completely private digital journal with trigger tags, searchable history logs, and instant deletion controls.
6. **Sponsor Message Generator**: Quickly compile WhatsApp/SMS drafts to safe contacts to break the isolation barrier, complete with Egyptian Franco/Arabizi phonetic options.
7. **Verified Support Directory**: Filterable database placeholders for online meetings, women-only networks, and multi-language support.
8. **Admin demo panel**: Prototype dashboard displaying aggregate counts and high-risk flags metadata with zero visibility of private journal contents.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js (App Router, Tailwind CSS, TypeScript, shadcn/ui)
- **Database**: Supabase core relational schema ready (integrated with full offline-persistent local storage emulation via `mockSupabase.ts` for immediate sandbox execution).
- **Localization**: Interactive RTL/LTR direction toggles via `translations.ts` and `BilingualProvider` contexts.
- **Safety Engine**: Real-time keyword filter scripts mapping suicide/self-harm triggers to raise risk warning disclaimers.

---

## 📁 File Structure

```
frontend/
├── app/
│   ├── admin/           # Demographical analytics dashboard
│   ├── check-in/        # Daily Questionnaire & AI reflection panel
│   ├── companion/       # Aman Companion chat screen
│   ├── dashboard/       # Recovery statistics, streaks, and sparklines
│   ├── directory/       # Safe meeting directories (women-only, etc.)
│   ├── generator/       # Quick SMS/WhatsApp template draft tools
│   ├── journal/         # Secure private journal lists
│   ├── onboarding/      # Low-friction anonymous signups
│   ├── urgent/          # Interactive breathing visualizers & timers
│   ├── safety/          # Governance, privacy, and compliance charter
│   ├── globals.css      # Warm desert/sand/green HSL styling definitions
│   └── layout.tsx       # Root layout binding the Bilingual context
├── components/
│   └── AmanNavbar.tsx   # Global header featuring dialect switches and emergency trigger buttons
├── lib/
│   ├── translations.ts  # Bilingual translation matrix (Fusha, Masry, English)
│   ├── BilingualContext.tsx # Instant RTL/LTR layout toggling
│   └── mockSupabase.ts  # Local Storage Mock Database & AI reflections engine
├── prompts/             # System Prompt files
│   ├── companion_chat.txt
│   ├── daily_reflection.txt
│   ├── relapse_support.txt
│   ├── urge_surfing.txt
│   └── safety_escalation.txt
├── safety/
│   └── safety_policy.md # Governance charter and crisis heuristics
└── supabase/
    └── supabase_schema.sql # Core Supabase SQL schema with Row-Level Security
```

---

## 🎯 Verification Test Checklist

To manually test every feature of the prototype:
1. **Dialect Switching**: Click the language buttons ("فصحى", "مصري", "English") in the header to instantly verify that the layout shifts directions (RTL for Arabic, LTR for English) and translates all headings, options, and placeholders.
2. **Anonymous Onboarding**: Input an anonymous screen name under `/onboarding`, select a recovery focus area, and submit to verify redirection to the Dashboard.
3. **Daily Check-in Logging**: Click "Log Daily Pulse", adjust sliders, type a journal entry, and submit to verify that it updates your streak, displays your sparkline, and generates a personalized AI reflection.
4. **Crisis Escalation Heuristic**: In the chat companion or private journal, type "I want to harm myself" or "عايز أموت" and submit. Verify that the system immediately displays a high-contrast emergency warning card containing mental health helpline details.
5. **Urgent Grounding**: Visit the Urgent Support screen, click "Start 20-Minute Delay", and watch the interactive breathing visualizer adjust sizes.
6. **Sponsor Messages**: Click the Outreach Message Builder, select "Had a Slip / Accident", and verify that the app generates precise Standard Arabic, colloquial Egyptian Arabic, and Franco-Arabizi drafts ready for single-click clipboard copying.

---

## 🌐 Deployment Notes for Vercel

1. Push all code to your connected GitHub repository:
   ```bash
   git add .
   git commit -m "feat: implement Aman Path recovery platform MVP"
   git push origin main
   ```
2. Log into the Vercel Dashboard, select **New Project**, and connect it to your `Fly-ai-guy7/addiction` GitHub repository.
3. In the project settings, specify the Root Directory as `frontend` (since Next.js resides in the `frontend` subfolder).
4. Deploy. Vercel will automatically compile the TypeScript files, optimize the Tailwind stylesheets, and make the platform live on a public URL!
