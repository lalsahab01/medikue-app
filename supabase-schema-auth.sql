-- MediKue+ Auth & Roles migration
-- Run this in the Supabase SQL Editor AFTER supabase-schema.sql

create extension if not exists "pgcrypto";

-- Every human who can log in (admin/doctor/staff/patient) has exactly one row here.
-- login_id is normally a 10-digit mobile number. The bootstrap super-admin is the
-- one exception and uses a fixed username instead of a phone number.
create table if not exists app_credentials (
  id uuid primary key default gen_random_uuid(),
  login_id text not null unique,
  name text not null,
  password_hash text not null,
  password_salt text not null,
  role text not null check (role in ('admin','doctor','staff','patient')),
  status text not null default 'active' check (status in ('active','disabled')),
  clinic_id uuid references clinics(id) on delete set null,
  doctor_id uuid references doctors(id) on delete set null,
  staff_id uuid references staff_profiles(id) on delete set null,
  patient_id uuid references patients(id) on delete set null,
  created_by uuid references app_credentials(id) on delete set null,
  created_at timestamptz default now()
);

create index if not exists app_credentials_role_idx on app_credentials(role);
create index if not exists app_credentials_clinic_idx on app_credentials(clinic_id);

-- Lets a doctor self-register straight into the correct clinic (branch) without
-- a human approval step: they enter this code during signup instead of an admin
-- reviewing every application.
create table if not exists clinic_invite_codes (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics(id) on delete cascade,
  code text not null unique,
  role text not null default 'doctor' check (role in ('doctor','staff')),
  active boolean not null default true,
  created_by uuid references app_credentials(id) on delete set null,
  created_at timestamptz default now()
);

alter table app_credentials enable row level security;
alter table clinic_invite_codes enable row level security;

-- These two tables are only ever touched by Next.js API routes using the Supabase
-- service role key (which bypasses RLS), never directly from the browser. Deny the
-- anon/authenticated roles completely.
drop policy if exists "No client access to credentials" on app_credentials;
create policy "No client access to credentials" on app_credentials for all using (false);

drop policy if exists "No client access to invite codes" on clinic_invite_codes;
create policy "No client access to invite codes" on clinic_invite_codes for all using (false);

-- Seed a second demo clinic branch so multi-clinic can be exercised immediately.
insert into clinics (id, name, address, city, phone) values
  ('00000000-0000-0000-0000-000000000002', 'MediKue Demo Clinic - Rohini Branch', '45 Rohini Sector 9', 'Delhi', '011-87654321')
on conflict do nothing;

-- One starter invite code per seeded clinic so doctor self-registration can be tested end to end.
insert into clinic_invite_codes (clinic_id, code, role) values
  ('00000000-0000-0000-0000-000000000001', 'MEDIKUE-MAIN-DOC', 'doctor'),
  ('00000000-0000-0000-0000-000000000002', 'MEDIKUE-ROHINI-DOC', 'doctor')
on conflict do nothing;
