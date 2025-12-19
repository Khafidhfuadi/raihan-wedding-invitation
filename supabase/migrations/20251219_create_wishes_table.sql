-- Create wishes table
create table if not exists wishes (
  id bigint primary key generated always as identity,
  name text not null,
  message text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table wishes enable row level security;

-- Create policy to allow everyone to read
create policy "Enable read access for all users" on wishes for select using (true);

-- Create policy to allow everyone to insert
create policy "Enable insert access for all users" on wishes for insert with check (true);
