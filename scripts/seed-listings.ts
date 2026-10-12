/**
 * scripts/seed-listings.ts
 *
 * Seeds the `listings` table with ~20 realistic (but fictional) Tallahassee
 * apartment listings for demo/dev purposes. Solves the "cold-start problem"
 * flagged in the project proposal so increment 1 doesn't demo an empty app.
 *
 * WHY CHECK-BEFORE-INSERT INSTEAD OF A PLAIN INSERT:
 * The `listings` table has no unique column to upsert against (no slug,
 * no unique constraint on name/address), so a plain INSERT would duplicate
 * rows every time this script is re-run. Instead, for each listing we check
 * whether a row with the same address already exists, and only insert if
 * it doesn't. This satisfies the "re-runnable without duplicating rows"
 * acceptance criterion without requiring a schema change.
 *
 * SETUP NEEDED BEFORE RUNNING:
 * 1. npm install @supabase/supabase-js dotenv tsx --save-dev
 * 2. Make sure .env.local has SUPABASE_SECRET_KEY set (in addition to the
 *    two NEXT_PUBLIC_ vars the app itself uses). The secret key is required
 *    here because it bypasses Row-Level Security, which blocks writes from
 *    the publishable key.
 * 3. Run with: npx tsx scripts/seed-listings.ts
 */

   import { config } from "dotenv";
   config({ path: ".env.local" });
   
   import { createClient } from "@supabase/supabase-js";
   import WebSocket from "ws";
   
   // @supabase/supabase-js initializes a Realtime client by default, which requires
   // the native WebSocket global available in Node 22+. This script doesn't use
   // Realtime at all (just inserts), so we polyfill the global to unblock Node 20.
   (globalThis as unknown as { WebSocket: typeof WebSocket }).WebSocket = WebSocket;

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in your environment. " +
      "Add SUPABASE_SECRET_KEY to .env.local (get it from Supabase dashboard -> " +
      "Project Settings -> API Keys -> Secret keys). Never give this key the " +
      "NEXT_PUBLIC_ prefix.",
  );
}

const supabase = createClient(supabaseUrl, supabaseSecretKey);

// Fixed reference point for distance calculations, per the proposal:
// "Distance to campus is computed and stored per listing rather than
// looked up live." Using FSU's Westcott Building / campus center.
const CAMPUS_REFERENCE = {
  lat: 30.4419,
  lng: -84.2985,
};

// ---------------------------------------------------------------------------
// HAVERSINE DISTANCE (straight-line distance in miles)
// ---------------------------------------------------------------------------

function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const earthRadiusMiles = 3958.8;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(earthRadiusMiles * c * 100) / 100;
}

// ---------------------------------------------------------------------------
// RAW SEED DATA
// ---------------------------------------------------------------------------
// 20 fictional-but-plausible listings spread across real streets/corridors
// near FSU and FAMU. Prices, bedroom counts, and distances are deliberately
// varied so filter/sort features have something meaningful to work with.
// Column names match supabase/migrations/20261005204500_create_initial_schema.sql.

type RawListing = {
  name: string;
  address: string;
  price: number;
  bedrooms: number;
  lat: number;
  lng: number;
  amenities: string[];
};

const rawListings: RawListing[] = [
  { name: "Tennessee Street Flats", address: "101 W Tennessee St, Tallahassee, FL 32304", price: 950, bedrooms: 1, lat: 30.4406, lng: -84.2963, amenities: ["in-unit laundry", "pet-friendly"] },
  { name: "Jefferson Court", address: "220 W Jefferson St, Tallahassee, FL 32301", price: 1150, bedrooms: 2, lat: 30.4389, lng: -84.2871, amenities: ["parking", "balcony"] },
  { name: "Gaines Street Lofts", address: "611 W Gaines St, Tallahassee, FL 32304", price: 1400, bedrooms: 2, lat: 30.4372, lng: -84.2989, amenities: ["pool", "gym", "in-unit laundry"] },
  { name: "Woodward Studios", address: "514 S Woodward Ave, Tallahassee, FL 32304", price: 725, bedrooms: 1, lat: 30.4381, lng: -84.2953, amenities: ["walk to class"] },
  { name: "Ocala Road Apartments", address: "1802 Ocala Rd, Tallahassee, FL 32304", price: 1050, bedrooms: 2, lat: 30.4442, lng: -84.3184, amenities: ["parking", "pet-friendly"] },
  { name: "Pensacola Place", address: "1500 W Pensacola St, Tallahassee, FL 32304", price: 875, bedrooms: 1, lat: 30.4409, lng: -84.3106, amenities: ["pool", "parking"] },
  { name: "Call Street Residences", address: "320 W Call St, Tallahassee, FL 32306", price: 1600, bedrooms: 3, lat: 30.4429, lng: -84.2986, amenities: ["in-unit laundry", "balcony", "gym"] },
  { name: "Stadium View", address: "901 Stadium Dr, Tallahassee, FL 32304", price: 680, bedrooms: 1, lat: 30.4372, lng: -84.3046, amenities: ["walk to class"] },
  { name: "Levy Avenue Apartments", address: "2200 Levy Ave, Tallahassee, FL 32310", price: 1250, bedrooms: 2, lat: 30.4235, lng: -84.3068, amenities: ["parking", "pet-friendly", "pool"] },
  { name: "Railroad Lofts", address: "406 Railroad Ave, Tallahassee, FL 32310", price: 800, bedrooms: 1, lat: 30.4276, lng: -84.2975, amenities: ["in-unit laundry"] },
  { name: "Macomb Street House", address: "810 N Macomb St, Tallahassee, FL 32303", price: 1500, bedrooms: 3, lat: 30.4531, lng: -84.2929, amenities: ["parking", "balcony", "pet-friendly"] },
  { name: "Gadsden Street Suites", address: "205 N Gadsden St, Tallahassee, FL 32301", price: 1050, bedrooms: 2, lat: 30.4453, lng: -84.2828, amenities: ["walk to class", "gym"] },
  { name: "College Avenue Towers", address: "120 W College Ave, Tallahassee, FL 32301", price: 1900, bedrooms: 4, lat: 30.4404, lng: -84.2841, amenities: ["pool", "gym", "in-unit laundry", "parking"] },
  { name: "Ferdon Commons", address: "3300 Ferdon Blvd, Tallahassee, FL 32312", price: 1350, bedrooms: 2, lat: 30.4834, lng: -84.2839, amenities: ["pool", "parking", "pet-friendly"] },
  { name: "Orange Avenue Apartments", address: "2100 W Orange Ave, Tallahassee, FL 32304", price: 900, bedrooms: 1, lat: 30.4185, lng: -84.3152, amenities: ["parking"] },
  { name: "Monroe Street North", address: "3010 N Monroe St, Tallahassee, FL 32303", price: 1600, bedrooms: 3, lat: 30.4761, lng: -84.2823, amenities: ["pool", "gym", "balcony"] },
  { name: "Brevard Street Cottages", address: "612 W Brevard St, Tallahassee, FL 32304", price: 650, bedrooms: 1, lat: 30.4472, lng: -84.2951, amenities: ["walk to class", "pet-friendly"] },
  { name: "Perry Street Residences", address: "908 W Perry St, Tallahassee, FL 32304", price: 1200, bedrooms: 2, lat: 30.4479, lng: -84.2988, amenities: ["in-unit laundry", "parking"] },
  { name: "Gibbs Drive Apartments", address: "2400 Gibbs Dr, Tallahassee, FL 32304", price: 780, bedrooms: 1, lat: 30.4192, lng: -84.2934, amenities: ["pet-friendly"] },
  { name: "Kissimmee Street Flats", address: "1710 Kissimmee St, Tallahassee, FL 32310", price: 2200, bedrooms: 4, lat: 30.4228, lng: -84.3121, amenities: ["pool", "gym", "in-unit laundry", "balcony", "parking"] },
];

// ---------------------------------------------------------------------------
// SEED FUNCTION
// ---------------------------------------------------------------------------

async function seed() {
  console.log(`Checking ${rawListings.length} listings against the database...`);

  let inserted = 0;
  let skipped = 0;

  for (const listing of rawListings) {
    const { data: existing, error: lookupError } = await supabase
      .from("listings")
      .select("id")
      .eq("address", listing.address)
      .maybeSingle();

    if (lookupError) {
      console.error(`Lookup failed for "${listing.name}":`, lookupError.message);
      continue;
    }

    if (existing) {
      skipped += 1;
      continue;
    }

    const distanceMiles = haversineMiles(
      listing.lat,
      listing.lng,
      CAMPUS_REFERENCE.lat,
      CAMPUS_REFERENCE.lng,
    );

    const { error: insertError } = await supabase.from("listings").insert({
      name: listing.name,
      price: listing.price,
      bedrooms: listing.bedrooms,
      address: listing.address,
      amenities: listing.amenities,
      lat: listing.lat,
      lng: listing.lng,
      distance_miles: distanceMiles,
    });

    if (insertError) {
      console.error(`Insert failed for "${listing.name}":`, insertError.message);
      continue;
    }

    inserted += 1;
  }

  console.log(`Seed complete. ${inserted} listings inserted, ${skipped} already existed and were skipped.`);
}

seed();