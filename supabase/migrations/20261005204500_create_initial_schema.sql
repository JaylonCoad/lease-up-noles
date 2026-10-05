begin;

-- Apartment listings.
create table public.listings (
    id uuid primary key default gen_random_uuid(),
    name text not null check (length(trim(name)) > 0),
    price numeric(10, 2) not null check (price >= 0),
    bedrooms integer not null check (bedrooms >= 0),
    address text not null check (length(trim(address)) > 0),
    amenities text[] not null default '{}',
    lat double precision not null check (lat between -90 and 90),
    lng double precision not null check (lng between -180 and 180),
    distance_miles double precision check (
        distance_miles >= 0 and distance_miles < 'Infinity'::double precision
    ),
    created_at timestamptz not null default now()
);

comment on column public.listings.price is
    'Monthly rent per person in USD. Use this basis consistently.';

comment on column public.listings.bedrooms is
    'Total bedrooms in the apartment; 0 represents a studio.';

comment on column public.listings.distance_miles is
    'Stored straight-line distance to the fixed FSU campus reference point. NULL until computed.';

-- Each profile belongs to an existing Supabase Auth user.
create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    display_name text,
    role text not null default 'student'
        check (role in ('guest', 'student', 'admin')),
    created_at timestamptz not null default now()
);

-- Student reviews linked to a listing and a profile.
create table public.reviews (
    id uuid primary key default gen_random_uuid(),
    listing_id uuid not null
        references public.listings(id) on delete cascade,
    user_id uuid not null
        references public.profiles(id) on delete cascade,
    rating integer not null check (rating between 1 and 5),
    comment text not null check (length(trim(comment)) > 0),
    created_at timestamptz not null default now()
);

-- Support listing filters and review lookups.
create index listings_price_idx on public.listings(price);
create index listings_bedrooms_idx on public.listings(bedrooms);
create index listings_distance_miles_idx on public.listings(distance_miles);
create index reviews_listing_id_idx on public.reviews(listing_id);
create index reviews_user_id_idx on public.reviews(user_id);

-- Access policies will be added in a separate migration.
alter table public.listings enable row level security;
alter table public.profiles enable row level security;
alter table public.reviews enable row level security;

commit;