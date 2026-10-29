begin;

-- Same formula and Earth radius as src/lib/distance.ts.
create function public.haversine_miles(
    lat1 double precision,
    lng1 double precision,
    lat2 double precision,
    lng2 double precision
)
returns double precision
language plpgsql
immutable
strict
set search_path = ''
as $$
declare
    a double precision;
begin
    if not (lat1 between -90 and 90)
        or not (lat2 between -90 and 90)
        or not (lng1 between -180 and 180)
        or not (lng2 between -180 and 180) then
        raise exception 'Invalid latitude or longitude'
            using errcode = '22023';
    end if;

    a :=
        power(sin(radians(lat2 - lat1) / 2), 2)
        + cos(radians(lat1))
        * cos(radians(lat2))
        * power(sin(radians(lng2 - lng1) / 2), 2);

    return 2 * 3958.7613
        * asin(sqrt(greatest(0.0, least(1.0, a))));
end;
$$;

-- Fixed reference: Westcott Fountain.
-- Coordinates supplied from Apple Maps: 30.44072 N, 84.29115 W.
create function public.distance_to_campus_miles(
    latitude double precision,
    longitude double precision
)
returns double precision
language sql
immutable
strict
set search_path = ''
as $$
    select public.haversine_miles(
        latitude, longitude, 30.44072, -84.29115
    );
$$;

create function public.set_listing_distance()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    if TG_OP = 'INSERT' then
        NEW.distance_miles :=
            public.distance_to_campus_miles(NEW.lat, NEW.lng);
    elsif NEW.lat is distinct from OLD.lat
        or NEW.lng is distinct from OLD.lng then
        NEW.distance_miles :=
            public.distance_to_campus_miles(NEW.lat, NEW.lng);
    else
        -- Preserve the stored value, including if a client tries to change it.
        NEW.distance_miles := OLD.distance_miles;
    end if;

    return NEW;
end;
$$;

-- Populate distances for listings that already exist.
update public.listings
set distance_miles = public.distance_to_campus_miles(lat, lng);

alter table public.listings
    alter column distance_miles set not null;

create trigger listings_set_distance
before insert or update on public.listings
for each row
execute function public.set_listing_distance();

comment on column public.listings.distance_miles is
    'Stored straight-line miles to Westcott Fountain (30.44072, -84.29115). Calculated on insert or coordinate changes; never on read.';

commit;