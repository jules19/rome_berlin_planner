# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Trip Board** — a shared board for four friends to collect and find travel ideas for a Berlin + Rome trip. Links become visual cards, likes signal group interest, filters help you find things fast while traveling.

## Tech Stack

- **Frontend:** Next.js + Tailwind CSS
- **Backend:** Supabase (Postgres + Storage)
- **OG Scraping:** Next.js API route or Supabase Edge Function

## Data Model

Single table for MVP:

**cards** — id, title, link_url, image_url, city (berlin/rome), category, likes[], is_booked, day, notes, created_by, created_at

## Design Principles

1. Links become cards (URL in → image + title out)
2. Likes are decisions (everyone liked = do it)
3. Retrieval is the payoff (find "Food in Rome" in 2 taps)
4. No planner hierarchy (4 equal friends)
5. Ship small, ship fast

## Build Order

| Module | What |
|--------|------|
| 0 | Static board — add cards, see grid |
| 1 | Link enrichment — OG scrape for title/image |
| 2 | Likes — tap to like, "everyone's in" badge |
| 3 | Filter & search — city, category, text, sort |
| 4 | Auth — real user accounts |
| 5 | Share sheet — capture from other apps |
| 6 | Image upload — for TikTok/screenshots |
| 7 | Booked + days — mark what's planned |

**Target:** Modules 0-3 = trip-ready.
