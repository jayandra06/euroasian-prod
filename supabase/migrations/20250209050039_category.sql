create table category (
    id uuid default uuid_generate_v4(),

    name text not null,
    description text not null,

    
    created_at timestamp with time zone not null,

    primary key (id)
);