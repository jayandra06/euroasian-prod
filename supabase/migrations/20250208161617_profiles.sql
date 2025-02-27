create type roles as enum (
  'customer',
  'vendor',
  'admin'
);


create table public.profiles (
    id uuid not null references auth.users on delete cascade,

    user_role roles,
    vessels text array,

    primary key (id)
);




-- inserts a row into public.profiles
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, user_role)
  values (new.id, 'customer');
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


create table branch (
  id uuid default uuid_generate_v4(),
  name text not null,

  vessels text array,

  creator uuid not null references public.profiles (id) default auth.uid(),
  created_at timestamp with time zone not null,

  primary key (id)
);


create type member_roles as enum (
  'employee',
  'admin',
  'creator'
);


create table member (
  id uuid default uuid_generate_v4(),

  member_profile uuid not null references public.profiles (id) default auth.uid(),
  branch uuid not null references public.branch (id),
  member_role member_roles,

  primary key (id) 
);