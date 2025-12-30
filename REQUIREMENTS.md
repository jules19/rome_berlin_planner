

Requirements Specification

Project: Collaborative Travel Curator (Modular Roadmap)

Document Purpose

This document defines a phased, modular roadmap to build a collaborative travel curation app for a small group trip (e.g., 4 friends going to Berlin + Rome). Each module is independently testable, deployable, and adds user-visible value.

Success Criteria (Product)

The system succeeds if it becomes the group’s primary place to:
	1.	Collect links and media into a shared board.
	2.	Curate items into a coherent shortlist and booked plan.
	3.	Quickly retrieve “what we’re doing” while travelling.

⸻

0. Guiding Principles
	1.	Links must become cards. A list of raw hyperlinks is a failure state.
	2.	Curation over conversation. The product is not a chat app.
	3.	Fast capture, low friction. Non-planners must be able to contribute with minimal effort.
	4.	Planner-first utilities. One person will do most of the organization; the UI must support efficient triage and status management.
	5.	AI proposes; humans confirm. Any AI features are suggestion-based, never automatic decisions.

⸻

1. Core Concepts

Entities
	•	Trip: A container for a specific group trip.
	•	Idea: A card representing an activity/place/link/media item.
	•	User: A participant in a trip.

Key Taxonomy (Phase 1)
	•	City: {Berlin, Rome} (trip-defined; initially hardcoded)
	•	Status (pipeline): {Proposed, Shortlist, Booked, Archive}
	•	Category: {Food, Sight, Activity, Nightlife, Stay, Transport, Other}
	•	Tags: Freeform tokens normalized to lowercase.

⸻

2. Technical Requirements (Baseline)

Stack
	•	Frontend: Next.js (React) + Tailwind.
	•	Backend: Supabase (Postgres + Auth + Storage).
	•	Enrichment: OG scraping via serverless function (Supabase Edge Function or Next.js API route).

Performance Requirements
	•	Inserting a link should render a placeholder card in < 1 second.
	•	OG enrichment should update card within < 5 seconds under normal conditions.
	•	App should be mobile-first and usable on a phone.

Security Requirements
	•	Trip is private by default; only invited users can access.
	•	Signed upload URLs for user media.

⸻

3. Data Model (Initial)

Table: trips

Field	Type	Notes
id	UUID	PK
name	TEXT	e.g., “Berlin + Rome 2026”
created_by	UUID	FK to user
created_at	TIMESTAMPTZ	default now()

Table: trip_members

Field	Type	Notes
trip_id	UUID	FK
user_id	UUID	FK
role	TEXT	{member, planner} (optional)
created_at	TIMESTAMPTZ	

Table: ideas

Field	Type	Notes
id	UUID	PK
trip_id	UUID	FK
created_by	UUID	FK
created_at	TIMESTAMPTZ	default now()
updated_at	TIMESTAMPTZ	
updated_by	UUID	FK (nullable)
city	TEXT	{Berlin, Rome}
status	TEXT	{proposed, shortlist, booked, archive}
category	TEXT	{food, sight, activity, nightlife, stay, transport, other}
tags	TEXT[]	normalized lowercase
title	TEXT	user-editable
link_url	TEXT	nullable
image_url	TEXT	nullable
notes	TEXT	user-editable
likes	UUID[]	list of users who liked
reviewed	BOOLEAN	default false (Inbox feature)
enrichment	JSONB	AI or scraper outputs

Table: idea_events (introduced in Module 4)

Field	Type	Notes
id	UUID	PK
idea_id	UUID	FK
event_type	TEXT	{create, update, status_change, like, tag_add, tag_remove, comment}
payload	JSONB	details (before/after)
created_by	UUID	FK
created_at	TIMESTAMPTZ	


⸻

4. Modular Roadmap

Each module is intended to be shippable, testable, and optionally release-gated.

⸻

Module 1 — Trip + Board Skeleton (MVP Foundation)

Goal

Create a trip with a shared board where users can add manual ideas (no scraping yet).

Features
	1.	Create trip (name only).
	2.	Invite/add members (simple: email list or manual user IDs).
	3.	Board view shows list/grid of ideas.
	4.	Add idea manually:
	•	required: title
	•	optional: city, category, status, notes
	5.	Edit idea:
	•	title, notes, city, category, status
	6.	Delete idea.

Acceptance Criteria (Testable)
	•	A user can create a trip, add a second user, and both can see the same board.
	•	A user can add/edit/delete an idea and changes propagate to other members on refresh.
	•	Board renders well on mobile.

Non-goals
	•	No OG scraping.
	•	No file uploads.
	•	No likes.
	•	No tags filtering.

⸻

Module 2 — URL Ingestion + OG Enrichment (“Links become cards”)

Goal

Allow users to paste a URL and get a card with title + image.

Features
	1.	Add idea via URL input:
	•	user pastes URL, presses Save.
	2.	System immediately creates idea with:
	•	placeholder title (“Loading…”)
	•	placeholder image (generic)
	•	status = proposed
	•	reviewed = false
	3.	Background job fetches:
	•	og:title, og:image, og:description (optional)
	4.	Update card with scraped content:
	•	title defaults to og:title
	•	image_url defaults to og:image
	5.	UI shows enrichment state:
	•	“Enriching…” indicator while pending
	•	“Needs image” if scraper fails

Acceptance Criteria
	•	Pasting a URL yields a visible card instantly.
	•	Within 5 seconds, card updates with og:image and og:title for typical sites.
	•	If enrichment fails, the user can still edit title manually and the card remains usable.

Non-goals
	•	No AI.
	•	No custom image upload yet.

⸻

Module 3 — Media Upload Override (Critical for TikTok/Screenshots)

Goal

Allow users to upload an image for a card (manual override).

Features
	1.	Upload image to Supabase storage.
	2.	Attach to idea:
	•	image_url updated to uploaded media
	3.	UI:
	•	“Replace image” on card modal
	•	Crop/resize optional (defer if needed)

Acceptance Criteria
	•	User can upload an image from mobile and it becomes the card hero image.
	•	Upload persists and displays on other devices.
	•	Upload does not require exposing storage buckets publicly (use signed URLs or public bucket with random filenames).

Non-goals
	•	No video uploads.
	•	No multiple images per card.

⸻

Module 4 — Collaboration & Trust (Likes + Activity Log)

Goal

Make collaboration safe and understandable: show “who did what” and support light sentiment.

Features
	1.	Likes:
	•	users can “heart” an idea
	•	likes stored as array of user IDs
	2.	Activity log:
	•	record events for:
	•	create
	•	status changes
	•	edits (title/notes/city/category)
	•	likes/unlikes
	•	tags changes (when tags added later)
	3.	UI:
	•	“Last updated by X”
	•	In modal: show last 5 events

Acceptance Criteria
	•	When User A changes status, User B can see who changed it.
	•	Likes count updates and is consistent across refresh.

Non-goals
	•	No full comment threads (optional later).
	•	No real-time push required (refresh acceptable).

⸻

Module 5 — Tags + Filtering + Saved Views (Core Curation)

Goal

Enable curation and retrieval via tags + filters.

Features
	1.	Add tags to idea:
	•	user enters tags freeform
	•	normalize to lowercase, remove leading #
	2.	Filter bar:
	•	City toggle (Berlin/Rome)
	•	Status chips
	•	Category dropdown
	•	Tag filter autocomplete
	3.	Sorting:
	•	default: created_at desc
	•	option: likes desc

Acceptance Criteria
	•	A user can filter “Rome + Food + Shortlist” and see only matching ideas.
	•	Tag filter returns accurate results.
	•	Tags are normalized consistently (e.g., “#Brunch” becomes “brunch”).

Non-goals
	•	No tag management pages.
	•	No complex query builder UI.

⸻

Module 6 — Planner Utilities: Inbox + Pinning + Dashboard

Goal

Make the product excellent for the planner.

Features
	1.	Inbox (“Unreviewed”):
	•	new ideas set reviewed=false
	•	planner can mark reviewed
	2.	Pinning:
	•	pinned=true
	•	show pinned section at top per city
	3.	Trip dashboard:
	•	counts by status per city
	•	“New since you last opened”
	•	“Top tags”
	•	“Most liked proposed items”

Acceptance Criteria
	•	Planner can process the Inbox in under 1 minute for 10 items.
	•	Pinned items appear consistently at top.
	•	Dashboard reflects real board state.

Non-goals
	•	No reminders or notifications.
	•	No calendar integration.

⸻

Module 7 — AI Suggestions (Optional but High Value)

Goal

Use an AI API key to reduce metadata work: suggest category/tags/city and generate a short description.

Feature Set

AI enrichment runs after OG scraping.

AI suggests:
	•	category
	•	tags
	•	city (Berlin/Rome/unknown)
	•	summary (1–2 lines)
	•	optional place_name/address extraction

UI:
	•	Show suggestions as chips (“Suggested tags”)
	•	User accepts/rejects
	•	AI never changes status automatically

Acceptance Criteria
	•	On adding a URL, AI suggests category and tags and user can accept in one tap.
	•	AI output is stored and visible but editable.
	•	If AI fails or key is missing, product still works.

Non-goals
	•	No itinerary generation.
	•	No chat interface.

⸻

Module 8 — Export (Planner Deliverable)

Goal

Give planners an outcome artifact.

Features (choose at least one)
	1.	Export “Booked” list to a clean shareable web view (read-only).
	2.	Export to PDF.
	3.	Export to Google Maps list (via CSV or link format).
	4.	Export to Markdown.

Acceptance Criteria
	•	Planner can export “Booked” items and share with the group.
	•	Export is stable and readable on mobile.

Non-goals
	•	No deep integrations required.

⸻

5. UI Requirements (Baseline)

Board Views
	•	Default: Status columns (Proposed / Shortlist / Booked / Archive)
	•	Secondary: Grid view (optional in early modules)

Card UI
	•	Hero image dominates card (target ~60%).
	•	Status badge visible.
	•	Tags appear as chips.
	•	Like icon and count visible.

Interaction Requirements
	•	Quick status change:
	•	can be done without opening modal (dropdown or quick menu)
	•	Modal detail view:
	•	edit status, city, tags, notes, image
	•	show activity log

⸻

6. Error Handling & Edge Cases

OG Scraping
	•	If og:image missing: show placeholder and “Upload image”
	•	If og:title missing: fall back to domain name or user-editable title
	•	Timeout after N seconds; do not block UI

Duplicate URLs
	•	Allow duplicates in Phase 1
	•	Optional: AI duplicate detection later

⸻

7. Test Plan (Minimum)

For each module:
	•	Unit tests for server functions (scrape/enrichment).
	•	Integration test: create trip → add member → add idea → edit → view on second account.
	•	Mobile viewport test.
	•	Basic performance check (link-to-card latency).

⸻

8. Explicit Non-Goals for Phase 1
	•	Full itinerary/day planner
	•	Offline mode
	•	Booking integrations
	•	Real-time collaboration (push updates)
	•	Full social/comment threads
	•	Multi-trip management and onboarding polish (beyond minimal)

⸻

9. Deliverables Summary (Engineering)

Each module delivers:
	•	schema migrations (if needed)
	•	API routes / edge functions
	•	frontend components
	•	acceptance tests checklist
	•	deployable feature flag (optional)

⸻
