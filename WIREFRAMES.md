# Fiverr Gig & Inbox Copilot — Wireframe Specs

---

## 1. Login / Onboarding

**Layout:** Centered card, max-w-md.

**States:**
- **Initial:** Logo + "Sign in with Google" / "Continue with Email" buttons.
- **Email form:** Email input + "Send magic link".
- **Onboarding (first sign-in):** Multi-step form —
  1. "What's your main service?" (text input + niche selector dropdown).
  2. "Pick your tone" (cards: Professional, Friendly, Persuasive, Technical).
  3. "Set your business hours" (day-of-week toggles + time pickers).
  4. "Connect Fiverr account" (optional skip button, username field).

**Elements:**
- Progress bar (steps 1–4).
- Back / Next buttons.
- Skip CTA at bottom.

---

## 2. Dashboard

**Layout:** 3-column grid on desktop, stacked on mobile.

```
┌─────────────────────────────────────────────────────────┐
│  Header: Logo (left) · [Inbox: 3] 🔔 · Avatar           │
├──────────────┬──────────────────┬───────────────────────┤
│ Gig Score    │ Response Timer   │ Overdue Leads         │
│ ┌──────────┐ │ Next deadline:   │ ┌───────────────────┐ │
│ │   72     │ │ Sarah — 2h 14m   │ │ Mike — 26h ago    │ │
│ │  /100    │ │                  │ │ Jenny — 25h ago   │ │
│ └──────────┘ │ View all →       │ │ View all →        │ │
├──────────────┴──────────────────┴───────────────────────┤
│ Recent Activity                                         │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 🆕 Web dev gig draft generated (2 min ago)          │ │
│ │ 📩 New message from Alex — "serious buyer"          │ │
│ │ ⏰ Response deadline: Web dev gig — 3h remaining    │ │
│ └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Components:**
- **GigScoreCard:** Circular gauge (0–100), color bands (red < 50, yellow 50–75, green > 75).
- **ResponseTimerWidget:** Nearest deadline, mini countdown, link to inbox.
- **OverdueAlert:** List of conversations past deadline (red badge).
- **ActivityFeed:** Scrollable list of recent events (icon + text + timestamp).

---

## 3. Gig Builder (New Gig)

**Layout:** Two-panel — left form, right preview.

```
┌──────────────────────────────────┬───────────────────────────┐
│  Gig Builder                     │  Live Preview             │
│ ┌────────────────────────────┐   │ ┌─────────────────────┐  │
│ │ Service / Niche            │   │ │ Gig Title            │  │
│ │ [ e.g. "React developer" ] │   │ │ [title preview]      │  │
│ └────────────────────────────┘   │ └─────────────────────┘  │
│ ┌────────────────────────────┐   │ ┌─────────────────────┐  │
│ │ Keywords (comma-sep)       │   │ │ Description          │  │
│ │ [react, nextjs, tailwind]  │   │ │ [description         │  │
│ └────────────────────────────┘   │ │  preview...]         │  │
│ ┌────────────────────────────┐   │ └─────────────────────┘  │
│ │ Tone selector              │   │ ┌─────────────────────┐  │
│ │ ○ Professional  ○ Friendly │   │ │ Tags                 │  │
│ │ ○ Persuasive   ○ Technical │   │ │ #react #nextjs ...  │  │
│ └────────────────────────────┘   │ └─────────────────────┘  │
│ ┌────────────────────────────┐   │ ┌─────────────────────┐  │
│ │ [Generate Gig Draft]       │   │ │ Packages             │  │
│ └────────────────────────────┘   │ │ Basic — $30          │  │
│                                  │ │ Standard — $60       │  │
│     Loading state:               │ │ Premium — $120       │  │
│     ┌──────────────────────┐     │ └─────────────────────┘  │
│     │ 🔄 Generating...     │     │ ┌─────────────────────┐  │
│     │ Title  ████████░░ 80%│     │ │ FAQs                 │  │
│     │ Desc   ██████░░░░ 60%│     │ │ Q: How long...?      │  │
│     │ Tags   ████████░░ 80%│     │ │ A: Typically...      │  │
│     │ Pkg    ██████░░░░ 60%│     │ └─────────────────────┘  │
│     │ FAQ    ████░░░░░░ 40%│     │                          │
│     └──────────────────────┘     │                          │
└──────────────────────────────────┴───────────────────────────┘
```

**States:**
- **Empty:** Input fields ready, "Generate Gig Draft" button enabled only when service filled.
- **Loading:** Progress bars per section (Title, Description, Tags, Packages, FAQ).
- **Complete:** Preview panel populated. Editable fields (click to edit inline).
- **Error:** Toast "Generation failed — try again". Retry button.

**Validation:**
- Service field: required, min 3 chars.
- Keywords: optional but recommended.
- Tone: defaults to user's saved tone.

---

## 4. Gig Audit / Checklist

**Layout:** Single column, scrollable.

```
┌─────────────────────────────────────────────────────────┐
│  Gig Audit: "React Developer for Web Apps"              │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Score: 68/100          ●●●●●●○○○○               │  │
│  │                         Needs improvement         │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Checklist                                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │ ✅ Title contains primary keyword                │  │
│  │ ✅ Description has intro section                 │  │
│  │ ✅ Description includes proof / portfolio link   │  │
│  │ ❌ Process section missing    [Add section ➔]    │  │
│  │ ✅ CTA present in conclusion                     │  │
│  │ ❌ Packages: only 2 of 3 tiers active  [+Add]   │  │
│  │ ✅ All 5 tags filled                             │  │
│  │ ❌ No FAQs yet                     [+Generate]   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  [  Publish to Fiverr  ]   [  Regenerate Draft  ]      │
└─────────────────────────────────────────────────────────┘
```

**States:**
- **Loading:** Skeleton gauge + shimmer placeholders.
- **Empty:** No draft selected — "Select a gig to audit".
- **Complete:** Gauge + checklist with action links.
- **Error:** "Could not score this gig." Debug note.

**Interactions:**
- Click ❌ items → inline editor or "Add" popover.
- "Regenerate Draft" → replaces current gig draft with new AI call (confirmation modal).
- "Publish to Fiverr" → copies final copy to clipboard with formatted layout.

---

## 5. Keyword Planner

**Layout:** Top search bar + results grid.

```
┌─────────────────────────────────────────────────────────┐
│  Keyword Planner                          [Save Draft]  │
│                                                         │
│  Niche: [Mobile app development       ▼]                │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Primary (1)       Secondary (3)    Long-tail (2) │  │
│  │ ┌────────────┐  ┌──────────────┐  ┌───────────┐ │  │
│  │ │ Flutter    │  │ cross-plat   │  │ flutter   │ │  │
│  │ │ developer  │  │ mobile app   │  │ app for   │ │  │
│  │ │  (94)      │  │ developer    │  │ startups  │ │  │
│  │ └────────────┘  │ (78)         │  │  (62)     │ │  │
│  │  ★ selected     │ fintech app  │  └───────────┘ │  │
│  │                 │ developer    │  ┌───────────┐ │  │
│  │                 │  (71)        │  │ react     │ │  │
│  │                 │ mobile UX    │  │ native    │ │  │
│  │                 │ designer     │  │ architect │ │  │
│  │                 │  (65)        │  │  (55)     │ │  │
│  │                 └──────────────┘  └───────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Suggested Tags (drag to reorder / click to remove):    │
│  [#flutter] [#crossplatform] [#fintech] [#uxdesign]     │
│  [#reactnative] [#appdevelopment]                       │
│                                                         │
│  [  Apply to Gig  ]   [  Refresh Suggestions  ]        │
└─────────────────────────────────────────────────────────┘
```

**States:**
- **Empty:** Niche dropdown at default — "Select a niche to get keyword suggestions".
- **Loading:** Skeleton cards (3 columns).
- **Loaded:** Columns populated. Score badge on each keyword (0–100).
- **Error:** "Keyword service unavailable. Try again."

**Interactions:**
- Click keyword → select/deselect (star toggle).
- Drag tags to reorder priority.
- "Apply to Gig" → updates gig draft's keywords.
- Score tooltip shows search volume approximation.

---

## 6. Inbox Triage

**Layout:** Two-panel — left conversation list, right selected conversation detail.

```
┌───────────────────────────────┬────────────────────────────────────┐
│  Inbox (12)                   │  Conversation                      │
│                               │                                    │
│ ┌───────────────────────────┐ │  Sarah Johnson                      │
│ │ 📩 Sarah Johnson       2m │ │  ┌──────────────────────────────┐  │
│ │ 🏷️ Serious    ⏰ 23h 50m  │ │  │ Sarah: Hi, I need a React   │  │
│ └───────────────────────────┘ │  │ app for my startup...        │  │
│ ┌───────────────────────────┐ │ │  ─── 10:32 AM ───            │  │
│ │ 📩 Mike Chen           1h │ │  │                              │  │
│ │ 🏷️ Pricing    ⏰ 22h 15m  │ │  └──────────────────────────────┘  │
│ └───────────────────────────┘ │                                    │
│ ┌───────────────────────────┐ │  Intent: 🟢 Serious Buyer          │
│ │ 📩 Jenny Park          3h │ │  Deadline: ⏰ 23h 50m              │
│ │ 🏷️ Unclear    ⏰ 20h 10m  │ │  ┌──────────────────────────────┐  │
│ └───────────────────────────┘ │  │ Draft Reply                    │  │
│ ┌───────────────────────────┐ │  │ "Hi Sarah, thanks for          │  │
│ │ 📩 Alex Rivera         8h │ │  │ reaching out! I'd love to     │  │
│ │ 🏷️ Low-fit    ⏰ 15h 40m  │ │  │ help with your React app.    │  │
│ └───────────────────────────┘ │  │ Could you share more about    │  │
│ ┌───────────────────────────┐ │  │ the features you need?"       │  │
│ │ 📩 Spam Bot            12h│ │  │                                │  │
│ │ 🏷️ Spam                  │ │  │ [Approve & Copy] [Edit Draft]  │  │
│ └───────────────────────────┘ │  │ [Regenerate]                   │  │
│                               │  └──────────────────────────────┘  │
│  Filter: All │ Serious │ ...  │  Quick reply templates:            │
│                               │  [Away message] [Pricing] [More]  │
└───────────────────────────────┴────────────────────────────────────┘
```

**States:**
- **Empty inbox:** Illustration + "No new messages. You're all caught up!"
- **Loading:** Skeleton rows (avatar + 2 lines shimmer).
- **List loaded:** Rows with intent badge + deadline countdown.
- **Selected conversation:** Thread + draft area.
- **Error:** "Could not load conversations. Retry."

**Intent badges (color-coded):**
- 🟢 Serious — green
- 🟡 Pricing — yellow
- 🟠 Unclear — orange
- 🔴 Low-fit — red
- ⚫ Spam — gray (auto-collapsed)

**Interactions:**
- Click row → open detail panel.
- Deadline color: green (> 12h), yellow (6–12h), red (< 6h).
- "Approve & Copy" → marks approved, copies to clipboard.
- Quick reply template selector → inserts into draft editor.

---

## 7. Conversation Detail

**Layout:** Full thread view with action bar at bottom.

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Inbox               Sarah Johnson            │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Sarah — 10:32 AM                                 │  │
│  │ Hi, I need a React app for my startup. We're     │  │
│  │ looking for someone who can build an MVP in 3    │  │
│  │ weeks. Budget is flexible. Are you available?    │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Classified as: Serious Buyer                      │  │
│  │ Confidence: 92%                                   │  │
│  │ [Reclassify...]                                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Response Timer                                    │  │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░░░ 56%     │  │
│  │ 13h 42m remaining out of 24h                     │  │
│  │ (deadline: Jul 6, 10:32 AM)                      │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Draft Reply                     Confidence: 87%  │  │
│  │ ┌──────────────────────────────────────────────┐ │  │
│  │ │ Hi Sarah, thanks for reaching out! I'd love  │ │  │
│  │ │ to help with your React MVP. I have          │ │  │
│  │ │ availability in the next 2 weeks. Could you  │ │  │
│  │ │ share more about the core features?          │ │  │
│  │ │                                             │ │  │
│  │ │ Best, [Name]                                 │ │  │
│  │ └──────────────────────────────────────────────┘ │  │
│  │                                                    │  │
│  │ [  Approve & Copy  ] [  Edit Draft  ] [Regen]    │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ⚠️ Reminder: Auto-replies don't count toward Fiverr's │
│  24-hour response rate. Reply manually.                │
└─────────────────────────────────────────────────────────┘
```

**States:**
- **Loading:** Skeleton thread.
- **Unclassified:** "Classify this message" button.
- **Classified:** Intent badge + confidence.
- **Draft ready:** Editable textarea.
- **Approved:** "Copied to clipboard!" toast.
- **Error:** "Failed to generate draft. Try again."

**Timer bar:**
- Visual progress bar: green → yellow → red gradient.
- Label shows absolute deadline time.
- Pulsing red when < 1 hour.

---

## 8. Template Library

**Layout:** Card grid + create/edit modal.

```
┌─────────────────────────────────────────────────────────┐
│  Template Library                     [+ New Template]  │
│                                                         │
│  Filter: All │ Away │ Pricing │ Follow-up │ Custom      │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Away Message │  │ Pricing Qs   │  │ Follow-up    │  │
│  │ "Hi, thanks  │  │ "Thanks for  │  │ "Hi, just    │  │
│  │ for your     │  │ your         │  │ checking in  │  │
│  │ message! I'm │  │ interest! My │  │ on my last   │  │
│  │ currently    │  │ packages     │  │ message. Are │  │
│  │ away..."     │  │ start at..." │  │ you still..."│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐                     │
│  │ Custom: Dev  │  │ Custom:      │                     │
│  │ "I've built  │  │ Design       │                     │
│  │ 12+ React   │  │ "My design   │                     │
│  │ apps..."     │  │ process..."  │                     │
│  └──────────────┘  └──────────────┘                     │
└─────────────────────────────────────────────────────────┘
```

**States:**
- **Empty:** "No templates yet. Create your first one."
- **Loaded:** Grid of cards.
- **Modal open:** Title field, type dropdown, body textarea, niche tag.

**Interactions:**
- Click card → preview + "Use in inbox" / "Edit" / "Delete".
- "Use in inbox" → navigates to inbox with template pre-loaded.
- New/Edit modal → save / discard.

---

## 9. Settings

**Layout:** Vertical tabs on desktop, top tabs on mobile.

```
┌─────────────────────────────────────────────────────────┐
│  Settings                                               │
│  ┌──────┬────────────────────────────────────────────┐  │
│  │Profile│  Name: [Hassan A.                     ]   │  │
│  │Tone   │  Email: [hassan@example.com           ]   │  │
│  │Notifs │  Timezone: [(UTC+05:00) Islamabad/Karachi]│  │
│  │       │                                         │  │
│  │       │  Business Hours                         │  │
│  │       │  ┌─┬────────┬────────┐                  │  │
│  │       │  │ │ Start  │ End    │                  │  │
│  │       │  ├─┼────────┼────────┤                  │  │
│  │       │  │M│ 09:00  │ 17:00  │                  │  │
│  │       │  │T│ 09:00  │ 17:00  │                  │  │
│  │       │  │W│ 09:00  │ 17:00  │                  │  │
│  │       │  │...│      │        │                  │  │
│  │       │  └─┴────────┴────────┘                  │  │
│  │       │                                         │  │
│  │       │  [  Save Changes  ]                     │  │
│  ├───────┴─────────────────────────────────────────┤  │
│  │  Tone & Language                                │  │
│  │  Default tone: [Professional  ▼]               │  │
│  │  Response language: [English   ▼]              │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  Notifications                                   │  │
│  │  ☑ Email reminders (2h before deadline)          │  │
│  │  ☑ Browser push                                  │  │
│  │  ☐ Telegram (coming soon)                        │  │
│  │  Reminder timing: [1 hour  ▼] before deadline   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**States:**
- **Loading:** Skeleton form fields.
- **Loaded:** Editable form.
- **Saved:** Green toast "Settings saved".
- **Error:** Red toast "Failed to save. Try again."

---

## Responsive Behavior

| Screen | Layout |
|---|---|
| ≥ 1024px | Full multi-column grid |
| 768–1023px | Two-column, narrower sidebar |
| < 768px | Single column, bottom nav, modals full-screen |

**Mobile navigation:** Bottom tab bar: Dashboard | Gigs | Inbox | Templates | Settings.

---

## Component States Reference

Every interactive component should handle these states:
1. **Loading** — Skeleton / spinner (never blank).
2. **Empty** — Illustration + descriptive text + CTA.
3. **Error** — Error message + retry button (inline or toast).
4. **Success** — Data displayed + optional toast.
5. **Edge cases:**
   - Long text: truncated with "Show more".
   - Many items: paginated (20 per page) or virtualized list.
   - Offline: banner "You're offline. Changes saved locally."
