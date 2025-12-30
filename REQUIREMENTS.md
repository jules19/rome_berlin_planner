# Requirements Specification

## Project: Trip Board

A shared board for friends to collect and find travel ideas — before and during the trip.

---

## The Problem

Four friends planning a trip to Berlin and Rome. Everyone finds cool spots on Instagram, Google Maps, TikTok, blogs. These get dumped into a group chat where they're impossible to find later. Standing in Rome asking "what was that restaurant someone shared?" — nobody knows.

## The Solution

A shared board where links become visual cards. Add ideas, see what everyone likes, filter by city when you need to find something fast.

---

## Guiding Principles

1. **Links become cards.** A pasted URL should produce a card with image and title automatically.
2. **Likes are decisions.** No complex workflows — if everyone liked it, you're probably doing it.
3. **Retrieval is the payoff.** The app proves its worth when you're standing in Rome and can find "Food, most liked" in two taps.
4. **No planner, no hierarchy.** Four friends, equal participation, no admin roles.
5. **Ship small, ship fast.** Each module should be usable on its own.

---

## Core Concepts

**Board** — A shared collection of ideas for one trip.

**Card** — A single idea: a place, restaurant, activity, or thing to do. Has a title, optional image, optional link, city, and category.

**Like** — A friend expressing interest. When everyone likes something, it's a strong signal.

---

## Data Model

### Table: cards

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| created_at | TIMESTAMPTZ | |
| created_by | TEXT | User name or ID |
| title | TEXT | Required |
| link_url | TEXT | Optional, triggers OG enrichment |
| image_url | TEXT | From OG scrape or manual upload |
| city | TEXT | berlin, rome, or null |
| category | TEXT | food, sight, activity, nightlife, stay, transport, other |
| likes | TEXT[] | Array of user names/IDs who liked |
| is_booked | BOOLEAN | Default false |
| day | TEXT | Optional: "day-1", "day-2", etc. |
| notes | TEXT | Optional freeform notes |

### Table: users (Module 4+)

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| email | TEXT | |
| name | TEXT | Display name |
| created_at | TIMESTAMPTZ | |

---

## Tech Stack

- **Frontend:** Next.js + Tailwind CSS
- **Backend:** Supabase (Postgres + Storage)
- **OG Scraping:** Next.js API route or Supabase Edge Function
- **Auth (later):** Supabase Auth with magic links

---

## Modules

### Module 0 — Static Board

**Goal:** The smallest useful thing — a shared page to collect ideas.

**Features:**
- Single board (no auth, no trip management)
- Add card with title, optional city, optional category
- Grid of cards
- Manual refresh to see updates

**Acceptance Criteria:**
- Four friends can open the same URL
- Each can add a card
- Refreshing shows everyone's cards
- Works on mobile

---

### Module 1 — Link Enrichment

**Goal:** Paste a URL, get a proper card.

**Features:**
- URL input field
- On submit: create card immediately with placeholder
- Background job fetches og:title and og:image
- Card updates when enrichment completes
- Fallback: show domain name if scrape fails, user can edit title

**Acceptance Criteria:**
- Pasting a Google Maps link produces a card with title and image
- Card appears instantly, enriches within 5 seconds
- Failed enrichment doesn't break the card

---

### Module 2 — Likes

**Goal:** See what the group wants to do.

**Features:**
- Tap to like/unlike a card
- Show like count and who liked (names or avatars)
- Visual indicator when all friends have liked ("Everyone's in")

**Acceptance Criteria:**
- Likes persist across refresh
- Can see who liked each card
- "Everyone liked" state is visually distinct

**Note:** Before auth (Module 4), use a simple name picker or local storage to identify users.

---

### Module 3 — Filter & Search

**Goal:** Find ideas fast, especially while traveling.

**Features:**
- City toggle: Rome / Berlin / All
- Category filter dropdown
- Text search (searches titles)
- Sort options: Most liked, Newest

**Acceptance Criteria:**
- Can filter to "Food in Rome, sorted by most liked" in 2 taps
- Search is fast and responsive
- Filters persist during session

---

### Module 4 — Auth & Identity

**Goal:** Real user accounts.

**Features:**
- Sign up / sign in with email magic link
- Cards attributed to logged-in user
- Likes tied to real accounts
- Invite friends via shareable link

**Acceptance Criteria:**
- Each friend has their own account
- Cards show who added them
- Only invited users can access the board

---

### Module 5 — Share Sheet Capture

**Goal:** Add cards without opening the app.

**Features:**
- PWA with Web Share Target API, or
- Simple API endpoint + iOS Shortcut

**Acceptance Criteria:**
- From Instagram/Maps/TikTok, tap Share → Trip Board
- Card appears on the board with enrichment

---

### Module 6 — Image Upload

**Goal:** Handle content that doesn't scrape well (TikTok, screenshots).

**Features:**
- Upload image from device
- Attach to new or existing card
- Images stored in Supabase Storage

**Acceptance Criteria:**
- Can upload a screenshot and create a card from it
- Uploaded images display correctly on all devices

---

### Module 7 — Booked & Days

**Goal:** Track what's actually planned.

**Features:**
- Toggle card as "Booked"
- Optional day assignment (Day 1, Day 2, etc.)
- Filter to show only booked cards
- View by day

**Acceptance Criteria:**
- Can mark a card as booked
- Can assign a day
- Can view "What's booked for Day 2 in Rome?"

---

## UI Requirements

### Cards
- Image-forward design (image takes ~60% of card)
- Title clearly readable
- City and category shown as small badges
- Like count and avatars visible
- "Everyone's in" badge when all have liked

### Board
- Grid layout, responsive
- Filter bar at top (city, category, search)
- Sort toggle

### Mobile
- Touch-friendly tap targets
- Works well on phone screens
- Fast load times

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Card creation | < 1 second to show placeholder |
| OG enrichment | < 5 seconds |
| Filter/search | < 200ms |
| Initial page load | < 2 seconds on 4G |

---

## What's Explicitly Out of Scope

- Multiple trips / trip management
- Planner roles or admin features
- Activity logs / audit trails
- Comments or chat
- AI suggestions
- Calendar or itinerary view
- Export to PDF/external services
- Offline mode
- Real-time sync (refresh is fine)

---

## Milestones

| Milestone | Modules | What You Get |
|-----------|---------|--------------|
| **Usable board** | 0 + 1 | Shared board with link cards |
| **Trip-ready** | + 2 + 3 | Likes + filtering — useful during travel |
| **Real accounts** | + 4 | Proper identity and access control |
| **Frictionless capture** | + 5 + 6 | Share sheet + image upload |
| **Planning mode** | + 7 | Booked status and day assignments |

**Target:** Hit "Trip-ready" (Modules 0-3) before the trip. Everything else is polish.
