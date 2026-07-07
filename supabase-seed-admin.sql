-- MediKue+ super-admin seed
-- Run this in the Supabase SQL Editor AFTER supabase-schema.sql and supabase-schema-auth.sql
-- Login ID: LalsahabTheGreat
-- Password: (the one you chose - not stored here, only its scrypt hash+salt below)

insert into app_credentials (login_id, name, password_hash, password_salt, role, status)
values (
  'LalsahabTheGreat',
  'Admin',
  '4b4a99618234b7c4413a4515deca11e6fc04c0de21eafda341a62e48d34e7acffa0ea0c4c1e0f162231e7bfc685dd4b3dde6de6276b34f3ae015e53d2a3bb71c',
  '63a2a86980cf9b43b2c11dd190337cc2',
  'admin',
  'active'
)
on conflict (login_id) do nothing;
