insert into storage.buckets (id, name)
values ('brand-image', 'brand-image')
on conflict do nothing;


create or replace function public.uuid_or_null(str text)
returns uuid
language plpgsql
as $$
begin
  return str::uuid;
  exception when invalid_text_representation then
    return null;
  end;
$$;



create policy "Authenticated users can upload files"
on storage.objects for insert to authenticated with check (
  bucket_id = 'brand-image' and
    owner = auth.uid() and
    public.uuid_or_null(path_tokens[1]) is not null
);

create policy "Users can view their own files"
on storage.objects for select to authenticated using (
  bucket_id = 'brand-image' and owner = auth.uid()
);

create policy "Users can update their own files"
on storage.objects for update to authenticated with check (
  bucket_id = 'brand-image' and owner = auth.uid()
);

create policy "Users can delete their own files"
on storage.objects for delete to authenticated using (
  bucket_id = 'brand-image' and owner = auth.uid()
);



create table brand (
    id uuid default uuid_generate_v4(),

    name text not null,
    description text not null,

    is_active boolean default true,

    brand_image uuid not null references storage.objects (id),

    created_at timestamp with time zone not null,

    primary key (id)
);


create table model (
    id uuid default uuid_generate_v4(),

    name text not null,
    description text not null,

    created_at timestamp with time zone not null,

    primary key (id)
);