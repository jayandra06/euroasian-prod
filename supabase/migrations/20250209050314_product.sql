insert into storage.buckets (id, name)
values ('product_image', 'product_image')
on conflict do nothing;





create policy "Authenticated users can upload files for product"
on storage.objects for insert to authenticated with check (
  bucket_id = 'product_image' and
    owner = auth.uid() and
    public.uuid_or_null(path_tokens[1]) is not null
);

create policy "Users can view their own files for product"
on storage.objects for select to authenticated using (
  bucket_id = 'product_image' and owner = auth.uid()
);

create policy "Users can update their own files for product"
on storage.objects for update to authenticated with check (
  bucket_id = 'product_image' and owner = auth.uid()
);

create policy "Users can delete their own files for product"
on storage.objects for delete to authenticated using (
  bucket_id = 'product_image' and owner = auth.uid()
);



create table product (
    id uuid default uuid_generate_v4(),
    
    sku text not null,
    name text not null,
    description text not null,

    product_image uuid not null references storage.objects (id),
    
    quantity int,
    price int,
    taxable boolean default false,
    is_active boolean default true,
    merchant uuid not null references public.merchant,

    created_at timestamp with time zone not null,

    primary key (id)
);

insert into storage.buckets (id, name)
values ('drive_image', 'drive_image')
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



create policy "Authenticated users can upload files New"
on storage.objects for insert to authenticated with check (
  bucket_id = 'drive_image' and
    owner = auth.uid() and
    public.uuid_or_null(path_tokens[1]) is not null
);

create policy "Users can view their own files New"
on storage.objects for select to authenticated using (
  bucket_id = 'drive_image' and owner = auth.uid()
);

create policy "Users can update their own files New"
on storage.objects for update to authenticated with check (
  bucket_id = 'drive_image' and owner = auth.uid()
);

create policy "Users can delete their own files New"
on storage.objects for delete to authenticated using (
  bucket_id = 'drive_image' and owner = auth.uid()
);




create type drive_status_enum as enum (
  'uploaded',
  'requested',
  'approved'
);


create table drive  (
    id uuid default uuid_generate_v4(),

    drive_file uuid not null references storage.objects (id),
    drive_status drive_status_enum,
    merchant uuid not null references public.merchant,

    primary key (id)
);