# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Collaborative Travel Curator — a web app for small groups to collect, curate, and retrieve travel ideas for trips (initially Berlin + Rome). The product turns shared links into rich visual cards that groups can organize together.

## Planned Tech Stack

- **Frontend**: Next.js (React) + Tailwind CSS
- **Backend**: Supabase (Postgres + Auth + Storage)
- **Enrichment**: OG scraping via Supabase Edge Functions or Next.js API routes

## Core Data Model

- **Trip**: Container for a group trip
- **Idea**: A card representing an activity/place/link (with city, status, category, tags)
- **User**: Trip participant with optional "planner" role

Key taxonomies:
- Cities: Berlin, Rome (hardcoded initially)
- Status pipeline: Proposed → Shortlist → Booked → Archive
- Categories: Food, Sight, Activity, Nightlife, Stay, Transport, Other

## Design Principles

1. Links must become rich cards (raw hyperlinks are a failure state)
2. Curation over conversation — this is not a chat app
3. Fast capture with low friction for non-planners
4. Planner-first utilities for efficient triage
5. AI proposes, humans confirm — never automatic decisions

## Performance Targets

- Link placeholder card renders in < 1 second
- OG enrichment completes in < 5 seconds
- Mobile-first responsive design
