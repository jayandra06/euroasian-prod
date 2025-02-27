create table rfq (
    id uuid default uuid_generate_v4(),
    
    client_profile uuid not null references public.profiles (id) default auth.uid(),
    lead_date text not null,
    supply_port text not null,
    expire_date text not null,
    vessel_name text not null,
    imo_no text not null,
    port text not null,
    hull_no text not null,

    equipment_tags text array,
    brand text,
    model text,
    category text,

    branch uuid not null references public.branch (id),

    created_at timestamp with time zone not null,

    primary key (id)
);

create type rfq_status as enum (
  'processing',
  'send',
  'finalized'
);



create table item (
    id uuid default uuid_generate_v4(),

    rfq uuid not null references public.rfq (id),

    part_no text not null,
    position_no text not null,
    alternative_part_no text not null,
    description text not null,
    req_qty int not null,
    offered_qty int not null,
    uom text not null,
    quoted_price int not null,
    quoted boolean,
    margin int not null,
    status rfq_status,
    merchant uuid references public.merchant (id),

    primary key (id)
);

create table itemcopy (
    id uuid default uuid_generate_v4(),
    item uuid references public.item (id),
    merchant uuid references public.merchant (id),
    comment text,
    part_no text not null,
    position_no text not null,
    alternative_part_no text not null,
    quoted_price int not null,
    quoted boolean,

    primary key (id)
);