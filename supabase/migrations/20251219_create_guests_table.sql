-- Create guests table
create table if not exists guests (
  id bigint primary key generated always as identity,
  name text not null,
  slug text not null unique,
  created_at timestamptz default now()
);

-- Enable RLS
alter table guests enable row level security;

-- Create policy to allow everyone to read
create policy "Enable read access for all users" on guests for select using (true);

-- Create policy to allow everyone to insert/update/delete (for admin purpose, simplified for now)
create policy "Enable all access for all users" on guests for all using (true) with check (true);
