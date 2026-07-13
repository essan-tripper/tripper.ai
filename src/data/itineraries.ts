import { itinerarySchema } from "@/lib/validation/itinerary";

export type ItineraryDay = {
  dayNumber: number;
  title: string;
  location: string;
  coords: { lat: number; lng: number };
  description: string;
  heroImage: string;
  highlights: string[];
};

export type Itinerary = {
  slug: string;
  title: string;
  durationDays: number;
  coverImage: string;
  summary: string;
  days: ItineraryDay[];
};

export const charDhamYatra: Itinerary = {
  slug: "char-dham-yatra",
  title: "Char Dham Yatra",
  durationDays: 8,
  coverImage:
    "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384111/Kedarnath_mg8mev.jpg",
  summary:
    "An 8-day spiritual journey through the Garhwal Himalayas, visiting the four sacred shrines of Yamunotri, Gangotri, Kedarnath, and Badrinath.",
  days: [
    {
      dayNumber: 1,
      title: "Arrival in Haridwar",
      location: "Haridwar, Uttarakhand",
      coords: { lat: 29.9457, lng: 78.1642 },
      description:
        "Arrive in the holy city of Haridwar, where the Ganges descends to the plains. Check into your guesthouse and spend the evening witnessing the spectacular Ganga Aarti at Har Ki Pauri.",
      heroImage:
        "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384110/dwarka_tznnnm.jpg",
      highlights: [
        "Ganga Aarti at Har Ki Pauri",
        "Evening boat ride on the Ganges",
        "Explore Haridwar's bustling bazaars",
        "Try local kachoris and malaiyo",
      ],
    },
    {
      dayNumber: 2,
      title: "Haridwar → Barkot",
      location: "Barkot, Uttarakhand",
      coords: { lat: 30.8138, lng: 78.2092 },
      description:
        "A scenic drive through the Shivalik hills takes you to Barkot, a quiet town with panoramic views of the snow-capped Bandarpunch peak. Rest and acclimatize for tomorrow's journey.",
      heroImage:
        "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384109/Rameshwaram_zbtrll.jpg",
      highlights: [
        "Scenic drive through Shivalik hills",
        "Views of Bandarpunch peak",
        "Stop at Kempty Falls",
        "Overnight stay in a hillside resort",
      ],
    },
    {
      dayNumber: 3,
      title: "Yamunotri Darshan",
      location: "Yamunotri, Uttarakhand",
      coords: { lat: 30.9997, lng: 78.4611 },
      description:
        "A short drive to Janki Chatti followed by a 6 km trek (or pony/palanquin ride) to the Yamunotri temple — the source of the Yamuna River. Soak in the thermal springs at Surya Kund.",
      heroImage:
        "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384110/Yamunotri_w0upb1.jpg",
      highlights: [
        "Trek to Yamunotri temple (6 km)",
        "Thermal springs at Surya Kund",
        "Panoramic Himalayan views",
        "Divine darshan at the source of Yamuna",
      ],
    },
    {
      dayNumber: 4,
      title: "Barkot → Uttarkashi",
      location: "Uttarkashi, Uttarakhand",
      coords: { lat: 30.7268, lng: 78.4354 },
      description:
        "Travel deeper into the Garhwal Himalayas to Uttarkashi, home to the Neelkanth temple and the Nehru Institute of Mountaineering. Visit the Vishwanath temple in the evening.",
      heroImage:
        "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384110/Jagannath_ths5zz.jpg",
      highlights: [
        "Visit Nehru Institute of Mountaineering",
        "Vishwanath temple evening aarti",
        "Teliband view of the Bhagirathi river",
        "Shop for local woolens and handicrafts",
      ],
    },
    {
      dayNumber: 5,
      title: "Gangotri Darshan",
      location: "Gangotri, Uttarakhand",
      coords: { lat: 30.9997, lng: 78.9619 },
      description:
        "Drive to Gangotri, the origin of the Bhagirathi River (Ganges). The temple sits at 3,100m surrounded by majestic peaks. Spend time at the riverbank and visit the submerged Shivlinga rock.",
      heroImage:
        "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384108/gangotri_h5odhj.jpg",
      highlights: [
        "Gangotri temple at 3,100m",
        "Submerged Shivlinga rock formation",
        "Meditation by the Bhagirathi riverbank",
        "Breathtaking mountain panoramas",
      ],
    },
    {
      dayNumber: 6,
      title: "Uttarkashi → Guptkashi → Kedarnath",
      location: "Kedarnath, Uttarakhand",
      coords: { lat: 30.7346, lng: 79.0669 },
      description:
        "A long drive through Rudraprayag and Kund to Guptkashi. From here, a helicopter ride (or 16 km trek) takes you to the Kedarnath temple — one of the twelve Jyotirlingas, set against the breathtaking Kedarnath range.",
      heroImage:
        "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384111/Kedarnath_mg8mev.jpg",
      highlights: [
        "Helicopter ride to Kedarnath (or trek)",
        "Darshan at the Jyotirlinga temple",
        "Kedarnath range sunset view",
        "Adi Shankaracharya samadhi",
      ],
    },
    {
      dayNumber: 7,
      title: "Kedarnath → Badrinath",
      location: "Badrinath, Uttarakhand",
      coords: { lat: 30.7433, lng: 79.4938 },
      description:
        "Descend from Kedarnath and drive via the confluence of Alaknanda and Mandakini rivers at Rudraprayag to Badrinath. Visit the Badrinath temple dedicated to Lord Vishnu, nestled between the Nar and Narayana mountain ranges.",
      heroImage:
        "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384110/badri_cgzxnb.jpg",
      highlights: [
        "Badrinath temple darshan",
        "Confluence of Alaknanda and Mandakini",
        "Tapt Kund hot springs",
        "Mana village — the last village before Tibet",
      ],
    },
    {
      dayNumber: 8,
      title: "Badrinath → Haridwar Departure",
      location: "Haridwar, Uttarakhand",
      coords: { lat: 29.9457, lng: 78.1642 },
      description:
        "After morning darshan at Badrinath, begin the return journey to Haridwar via Rishikesh. Depart with memories of a lifetime. The journey ends, but the pilgrimage stays with you.",
      heroImage:
        "https://res.cloudinary.com/dbciv3dc2/image/upload/v1781384110/dwarka_tznnnm.jpg",
      highlights: [
        "Morning aarti at Badrinath",
        "Drive through Rishikesh",
        "Ganges river views one last time",
        "Reflect on the journey's spiritual significance",
      ],
    },
  ],
};

itinerarySchema.parse(charDhamYatra);
