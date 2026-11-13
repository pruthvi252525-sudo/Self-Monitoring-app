# Self-Monitor — Shareable App Brief

## One-sentence overview

**Self-Monitor is a calm personal productivity workspace for organizing tasks, planning time, building focus, and noticing progress.**

## What the app does

Self-Monitor brings several everyday planning tools together in one account:

- **Tasks:** Create, filter, and organize tasks in list, Kanban, or Eisenhower Matrix views.
- **Calendar:** See task deadlines by month, add tasks to a selected date, and configure deadline reminders.
- **Focus & plan:** Schedule time blocks and use a Pomodoro focus timer.
- **Workspace:** Keep notes, links, checklists, and image attachments alongside work.
- **Insights:** Review task and focus progress and export reports or a data backup.
- **Profile:** Manage account details and access app installation guidance.

Users can sign in with Google or email and password. Signed-in app data is associated with the user's Firebase account and synced through Firebase services.

## Product and platform status

- The product is a **web app** built with React, TypeScript, and Vite.
- It is being prepared as an **installable Progressive Web App (PWA)**. Users can add it to their phone's home screen from a supported browser; Android may offer a direct install prompt, while iPhone/iPad installation uses Safari's Share → Add to Home Screen flow.
- It is **not currently a native iOS or Android app distributed through the App Store or Google Play**.
- Installation from the website requires the deployed site to use HTTPS. The app still needs an internet connection for sign-in and cloud sync; do not promise offline functionality.
- The backend uses Firebase Authentication, Cloud Firestore, and Firebase Storage. Deployment guidance in the repository covers Vercel.
- The repository's Terms of Use and Privacy Notice are explicitly drafts. The app should not be marketed as legally reviewed, production-ready, or guaranteed to protect or retain data until those matters are addressed.

## Brand cues in the current product

- **Product name:** Self-Monitor; the interface wordmark is styled as `self.monitor`.
- **Existing tagline:** “A little more room to think.”
- **Other existing product line:** “Make space for what matters.”
- **Personality:** Calm, encouraging, clear, thoughtful, and practical—not competitive, noisy, or guilt-driven.
- **Visual direction:** Dark charcoal/navy surfaces, indigo/violet accents, occasional teal, soft gradients, rounded cards, and restrained glow effects.
- **Typography in the website:** Inter for interface text and JetBrains Mono for timer/numeric details.
- **Logo treatment in the interface:** A sparkle symbol paired with the `self.monitor` wordmark. Existing PWA icon artwork is a simple task-list/checkmark motif on an indigo-to-teal gradient.

Treat these as the current product direction, not as a finalized brand system. Keep spelling, name, and claims consistent unless explicitly asked to propose a rebrand.

## Audience and positioning

The code establishes the app's functionality, but it does not establish a validated customer segment or research-backed positioning. A reasonable **hypothesis to test**, not a confirmed fact, is that it may help people who want one approachable place to capture tasks, plan their time, focus, and review progress.

Marketing should explain what users can actually do and avoid claims such as “cures procrastination,” “improves mental health,” “guarantees productivity,” “works fully offline,” or “keeps data forever.” Do not present this as a medical, therapy, employee-surveillance, or emergency-response product.

## Guidance for creative and marketing agents

When creating videos, campaigns, brand concepts, or other materials:

1. Use the overview and feature list above as the source of truth; ask before inventing features, integrations, pricing, customer testimonials, or performance claims.
2. Emphasize a calmer workflow: capture tasks, choose priorities, make a plan, focus, and reflect on progress.
3. Keep the tone supportive and non-judgmental. Show progress as personal and flexible rather than a competition.
4. Show the real interface or request current screenshots before depicting detailed screens. Do not invent a polished mobile-native UI that does not exist.
5. Describe phone installation as adding the website to the home screen, not downloading a store app.
6. If publishing-facing copy is requested, flag that the privacy notice and terms are drafts and need review before public launch.
7. Offer concepts in reusable formats where useful (for example: a short-video script with hook, scenes, on-screen text, voiceover, and call to action; or a campaign brief with audience hypothesis, message, creative direction, and testable variants).

## Copy-paste context for another agent

> I’m working on Self-Monitor, a calm personal productivity web app. It helps people organize tasks (list, Kanban, and Eisenhower Matrix views), see deadlines in a calendar, plan time blocks, use a Pomodoro timer, keep notes/links/checklists/images with their work, and review task/focus progress. It supports Google and email/password sign-in, with user data synced through Firebase. The visual direction is dark charcoal/navy with indigo and teal accents, soft gradients, rounded cards, and a thoughtful, low-pressure tone. Existing lines are “A little more room to think” and “Make space for what matters.” It is an installable website/PWA, not a native App Store or Play Store app; phone installation is through the browser's home-screen install flow. The product's audience is not yet validated, and its Terms of Use and Privacy Notice are drafts. Please use these facts, don't invent capabilities or claims, and ask if you need current screenshots or a specific target audience. Your task is: [describe the task].
