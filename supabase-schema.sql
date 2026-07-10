-- MediKue+ Supabase Schema
-- Run this in Supabase SQL Editor

create extension if not exists "uuid-ossp";

create table if not exists clinics (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text not null,
  city text not null default 'Delhi',
  phone text not null,
  open_time time not null default '09:00',
  close_time time not null default '18:00',
  created_at timestamptz default now()
);

create table if not exists doctors (
  id uuid primary key default uuid_generate_v4(),
  clinic_id uuid references clinics(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  specialization text not null,
  qualification text not null default 'MBBS',
  experience_years int not null default 1,
  consultation_fee int not null default 300,
  is_available boolean default true,
  photo_url text,
  bio text,
  languages text[] default array['Hindi','English'],
  available_days text[] default array['Mon','Tue','Wed','Thu','Fri','Sat'],
  slot_duration_minutes int default 15,
  created_at timestamptz default now()
);

create table if not exists patients (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  clinic_id uuid references clinics(id) on delete cascade,
  name text not null,
  phone text not null,
  age int,
  gender text,
  blood_group text,
  address text,
  medical_history text,
  created_at timestamptz default now()
);

create table if not exists queue_entries (
  id uuid primary key default uuid_generate_v4(),
  clinic_id uuid references clinics(id) on delete cascade,
  doctor_id uuid references doctors(id) on delete cascade,
  patient_id uuid references patients(id) on delete set null,
  patient_name text not null,
  patient_phone text not null,
  token_number int not null,
  status text not null default 'waiting'
    check (status in ('waiting','called','with_doctor','done','skipped','cancelled')),
  reason text,
  estimated_wait_minutes int,
  called_at timestamptz,
  done_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists appointments (
  id uuid primary key default uuid_generate_v4(),
  clinic_id uuid references clinics(id) on delete cascade,
  doctor_id uuid references doctors(id) on delete cascade,
  patient_id uuid references patients(id) on delete set null,
  patient_name text not null,
  patient_phone text not null,
  appointment_date date not null,
  slot_time time not null,
  status text not null default 'scheduled'
    check (status in ('scheduled','waiting','in_progress','completed','cancelled')),
  reason text,
  queue_entry_id uuid references queue_entries(id) on delete set null,
  notes text,
  created_at timestamptz default now()
);

create table if not exists prescriptions (
  id uuid primary key default uuid_generate_v4(),
  clinic_id uuid references clinics(id) on delete cascade,
  doctor_id uuid references doctors(id) on delete cascade,
  patient_id uuid references patients(id) on delete set null,
  patient_name text not null,
  queue_entry_id uuid references queue_entries(id) on delete set null,
  diagnosis text not null,
  notes text,
  follow_up_date date,
  created_at timestamptz default now()
);

create table if not exists medications (
  id uuid primary key default uuid_generate_v4(),
  prescription_id uuid references prescriptions(id) on delete cascade,
  name text not null,
  dosage text not null,
  frequency text not null,
  duration text not null,
  instructions text
);

create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  clinic_id uuid references clinics(id) on delete cascade,
  patient_id uuid references patients(id) on delete set null,
  patient_name text not null,
  queue_entry_id uuid references queue_entries(id) on delete set null,
  appointment_id uuid references appointments(id) on delete set null,
  amount int not null,
  method text not null default 'cash'
    check (method in ('cash','upi','card')),
  status text not null default 'completed'
    check (status in ('pending','completed','refunded')),
  notes text,
  created_at timestamptz default now()
);

create table if not exists staff_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  clinic_id uuid references clinics(id) on delete cascade,
  name text not null,
  role text not null default 'receptionist',
  phone text,
  created_at timestamptz default now()
);

create table if not exists feedback (
  id uuid primary key default uuid_generate_v4(),
  clinic_id uuid references clinics(id) on delete cascade,
  patient_id uuid references patients(id) on delete set null,
  patient_name text not null,
  doctor_id uuid references doctors(id) on delete set null,
  queue_entry_id uuid references queue_entries(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

-- ============================================================================
-- Row Level Security (deny-by-default)
--
-- This app does NOT use Supabase Auth for its portal users. Authentication is a
-- custom signed-cookie JWT (see lib/auth/session.ts) and ALL privileged data access
-- happens in Next.js route handlers using the service-role key, which BYPASSES RLS.
--
-- Therefore every table below has RLS enabled with NO policy for the anon/authenticated
-- roles -> the browser's publishable key can neither read nor write them. The only
-- exception is public discovery (clinics, doctors) which the homepage reads with the
-- anon key.
-- ============================================================================
alter table clinics enable row level security;
alter table doctors enable row level security;
alter table patients enable row level security;
alter table queue_entries enable row level security;
alter table appointments enable row level security;
alter table prescriptions enable row level security;
alter table medications enable row level security;
alter table payments enable row level security;
alter table staff_profiles enable row level security;
alter table feedback enable row level security;

-- Public discovery only.
create policy "Public read clinics" on clinics for select to anon, authenticated using (true);
create policy "Public read doctors"  on doctors  for select to anon, authenticated using (true);

-- Realtime publication for the live queue board (server-side subscribers only).
alter publication supabase_realtime add table queue_entries;

-- Seed demo clinic and doctors
insert into clinics (id, name, address, city, phone) values
  ('00000000-0000-0000-0000-000000000001', 'MediKue Demo Clinic', '123 Gandhi Nagar, Near Bus Stand', 'Delhi', '011-12345678')
on conflict do nothing;

insert into doctors (clinic_id, name, specialization, qualification, experience_years, consultation_fee) values
  ('00000000-0000-0000-0000-000000000001', 'Dr. Priya Sharma', 'General Physician', 'MBBS, MD', 12, 300),
  ('00000000-0000-0000-0000-000000000001', 'Dr. Ramesh Patel', 'Orthopedics', 'MBBS, MS (Ortho)', 15, 500),
  ('00000000-0000-0000-0000-000000000001', 'Dr. Anita Singh', 'Pediatrics', 'MBBS, DCH', 8, 350),
  ('00000000-0000-0000-0000-000000000001', 'Dr. Suresh Kumar', 'Cardiology', 'MBBS, MD, DM (Cardio)', 20, 700)
on conflict do nothing;
