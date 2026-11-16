/**
 * scripts/seed-reviews-data.ts
 *
 * Fictional students and the sample reviews they "wrote", used by seed-listings.ts so the app
 * does not look empty during demos. Everything here is made up. Keep it free of side effects
 * (no database calls) so the unit test can import it.
 */

export type SeedStudent = {
  // Reserved example domain, so these can never be a real person's address.
  email: string;
  displayName: string;
};

export type SeedReview = {
  // Must match a listing name in seed-listings.ts.
  listingName: string;
  // Must match an email in seedStudents.
  studentEmail: string;
  rating: number;
  comment: string;
  // How long ago the review was written, so the newest-first order looks natural.
  daysAgo: number;
};

export const seedStudents: SeedStudent[] = [
  { email: "maya.seed@seed.example.com", displayName: "Maya R." },
  { email: "devon.seed@seed.example.com", displayName: "Devon T." },
  { email: "priya.seed@seed.example.com", displayName: "Priya S." },
  { email: "marcus.seed@seed.example.com", displayName: "Marcus L." },
  { email: "ella.seed@seed.example.com", displayName: "Ella K." },
  { email: "jordan.seed@seed.example.com", displayName: "Jordan P." },
];

export const seedReviews: SeedReview[] = [
  {
    listingName: "Brevard Street Cottages",
    studentEmail: "maya.seed@seed.example.com",
    rating: 5,
    comment:
      "I lived here for two semesters and loved it. It is a ten minute walk to class, the landlord fixed a leaky faucet within a day, and they were fine with my cat.",
    daysAgo: 21,
  },
  {
    listingName: "Brevard Street Cottages",
    studentEmail: "devon.seed@seed.example.com",
    rating: 4,
    comment:
      "Great location and quiet street. The walls are a little thin and parking is tight on game days, but for the price it is hard to beat.",
    daysAgo: 9,
  },
  {
    listingName: "Stadium View",
    studentEmail: "priya.seed@seed.example.com",
    rating: 4,
    comment:
      "Super close to campus so I never needed a car. Stay on top of the maintenance requests, because the first one took about a week.",
    daysAgo: 16,
  },
  {
    listingName: "Gaines Street Lofts",
    studentEmail: "marcus.seed@seed.example.com",
    rating: 5,
    comment:
      "The gym and pool are actually nice and rarely crowded. In-unit laundry saved me so much time. Rent is high, but you get what you pay for.",
    daysAgo: 14,
  },
  {
    listingName: "Gaines Street Lofts",
    studentEmail: "ella.seed@seed.example.com",
    rating: 3,
    comment:
      "Nice building but it gets loud on weekends since it is right by the bars. Fine if you do not mind the noise, harder during finals.",
    daysAgo: 6,
  },
  {
    listingName: "Gaines Street Lofts",
    studentEmail: "jordan.seed@seed.example.com",
    rating: 4,
    comment:
      "Good amenities and responsive staff. The balcony view is great. I would pick a higher floor to get away from the street noise.",
    daysAgo: 2,
  },
  {
    listingName: "Ocala Road Apartments",
    studentEmail: "maya.seed@seed.example.com",
    rating: 3,
    comment:
      "Decent for the price and there is plenty of parking, but it is a long walk to campus and the bus does not run late. Better if you have a car.",
    daysAgo: 30,
  },
  {
    listingName: "Tennessee Street Flats",
    studentEmail: "devon.seed@seed.example.com",
    rating: 2,
    comment:
      "The location is convenient but the unit had ongoing problems with the AC and it took weeks to get repaired. I would think twice before signing here.",
    daysAgo: 25,
  },
  {
    listingName: "Tennessee Street Flats",
    studentEmail: "priya.seed@seed.example.com",
    rating: 3,
    comment:
      "In-unit laundry is a big plus and it is pet friendly. Traffic noise on Tennessee Street is constant, so a white noise machine helps.",
    daysAgo: 11,
  },
  {
    listingName: "College Avenue Towers",
    studentEmail: "marcus.seed@seed.example.com",
    rating: 5,
    comment:
      "Split a four bedroom with friends and it worked out great. Everyone has their own space, the pool is great in the summer, and downtown is a short walk.",
    daysAgo: 18,
  },
  {
    listingName: "College Avenue Towers",
    studentEmail: "ella.seed@seed.example.com",
    rating: 4,
    comment:
      "Very well kept and the staff are friendly. It is pricey per person unless you fill all four rooms, so plan your roommates early.",
    daysAgo: 4,
  },
  {
    listingName: "Woodward Studios",
    studentEmail: "jordan.seed@seed.example.com",
    rating: 4,
    comment:
      "Small but cheap, and you can walk to class in minutes. A good first apartment if you want to keep costs low and do not need much space.",
    daysAgo: 13,
  },
  {
    listingName: "Macomb Street House",
    studentEmail: "maya.seed@seed.example.com",
    rating: 5,
    comment:
      "It feels like a real house, with a big living room and a yard. Perfect for three of us. The landlord is easy to reach and fair about the deposit.",
    daysAgo: 7,
  },
  {
    listingName: "Kissimmee Street Flats",
    studentEmail: "devon.seed@seed.example.com",
    rating: 3,
    comment:
      "The amenities are excellent, but the price is steep and the walk to campus is longer than the listing makes it sound. Worth it only if you will use the pool and gym.",
    daysAgo: 3,
  },
];
