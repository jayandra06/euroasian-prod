create type status_enum as enum (
  'waiting',
  'approved',
  'rejected'
);

create table merchant (
    id uuid default uuid_generate_v4(),
    name text not null,
    business_email text not null,
    phone text not null,
    
    status status_enum,

    merchant_profile uuid not null references public.profiles (id) default auth.uid(),
    brands text array,
    category text array,
    model text array,

    tax_id text,
    warehouse_address text,
    managing_director text,
    managing_director_email text,
    port text,

    created_at timestamp with time zone not null,

    primary key (id)
);