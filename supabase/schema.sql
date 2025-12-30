-- Trip Board schema
-- Run this in your Supabase SQL editor to create the cards table

create table if not exists cards (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  created_by text,
  title text not null,
  link_url text,
  image_url text,
  city text check (city is null or city in ('berlin', 'rome')),
  category text check (category is null or category in ('food', 'sight', 'activity', 'nightlife', 'stay', 'transport', 'other')),
  likes text[] default '{}',
  is_booked boolean default false,
  day text,
  notes text
);

-- Enable Row Level Security (but allow all operations for now - no auth yet)
alter table cards enable row level security;

-- Allow anyone to read cards
create policy "Anyone can view cards" on cards
  for select using (true);

-- Allow anyone to insert cards
create policy "Anyone can insert cards" on cards
  for insert with check (true);

-- Allow anyone to update cards
create policy "Anyone can update cards" on cards
  for update using (true);

-- Allow anyone to delete cards
create policy "Anyone can delete cards" on cards
  for delete using (true);
