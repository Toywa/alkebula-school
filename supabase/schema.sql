create table if not exists users (
  id uuid primary key,
  full_name text not null,
  email text unique not null,
  phone text,
  role text not null,
  status text default 'active',
  created_at timestamp default now()
);

create table if not exists parents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  agreement_accepted_at timestamp
);

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  parent_id uuid references parents(id) on delete cascade,
  date_of_birth date,
  school_level text,
  curriculum text,
  active_status boolean default true
);

create table if not exists educator_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  location text,
  national_id text,
  primary_subject text,
  curriculum_expertise text,
  years_experience integer,
  teaching_mode text,
  availability text,
  hourly_rate numeric,
  tsc_number text,
  reference_name text,
  reference_contact text,
  chief_name text,
  chief_contact text,
  bio text,
  status text default 'submitted',
  submitted_at timestamp default now()
);

create table if not exists educator_documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references educator_applications(id) on delete cascade,
  document_type text not null,
  file_url text not null,
  uploaded_at timestamp default now()
);

create table if not exists educators (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  application_id uuid references educator_applications(id),
  display_name text not null,
  profile_photo_url text,
  bio text,
  location text,
  hourly_rate numeric,
  teaching_mode text,
  is_verified boolean default false,
  is_active boolean default false,
  commission_rate numeric default 30
);
