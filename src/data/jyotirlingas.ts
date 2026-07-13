export type Jyotirlinga = {
  id: number;                        // 1..12, in shloka order
  name: string;                      // "Somnath"
  location: string;                  // "Veraval, Gujarat"
  state: string;                     // "Gujarat"
  coords: { lat: number; lng: number };
  copy: string;                      // 2-3 lines, factual placeholder
};

export const jyotirlingas: Jyotirlinga[] = [
  {
    id: 1,
    name: "Somnath",
    location: "Veraval",
    state: "Gujarat",
    coords: { lat: 20.8880, lng: 70.4017 },
    copy: "The first of the 12 Jyotirlingas, on India's western coast at Veraval. The current temple structure dates to 1951; the site is mentioned in the Rigveda.",
  },
  {
    id: 2,
    name: "Mallikarjuna",
    location: "Srisailam",
    state: "Andhra Pradesh",
    coords: { lat: 16.0730, lng: 78.8681 },
    copy: "On the banks of the Krishna river in Srisailam. One of the few Jyotirlingas also recognized as a Shakti Peetha — a dual shrine.",
  },
  {
    id: 3,
    name: "Mahakaleshwar",
    location: "Ujjain",
    state: "Madhya Pradesh",
    coords: { lat: 23.1828, lng: 75.7685 },
    copy: "The only Jyotirlinga facing south (Dakshinamurti). Famous for the Bhasma Aarti ritual held at dawn.",
  },
  {
    id: 4,
    name: "Omkareshwar",
    location: "Khandwa",
    state: "Madhya Pradesh",
    coords: { lat: 22.2433, lng: 76.1517 },
    copy: "On an island shaped like the Om symbol in the Narmada river. Two temples — Omkareshwar and Mamleshwar — share the Jyotirlinga status.",
  },
  {
    id: 5,
    name: "Vaidyanath",
    location: "Deoghar",
    state: "Jharkhand",
    coords: { lat: 24.4920, lng: 86.7000 },
    copy: "In Deoghar, Jharkhand. Devotees walk the 105-km Shrawan Yatra carrying holy water from the Ganges.",
  },
  {
    id: 6,
    name: "Bhimashankar",
    location: "Pune",
    state: "Maharashtra",
    coords: { lat: 19.0717, lng: 73.5519 },
    copy: "In the Sahyadri range, ~130 km from Pune. Source of the Bhima river and surrounded by dense forest.",
  },
  {
    id: 7,
    name: "Rameshwaram",
    location: "Rameswaram",
    state: "Tamil Nadu",
    coords: { lat: 9.2881, lng: 79.3174 },
    copy: "On Pamban Island, connected to the mainland by the Adam's Bridge. One of the Char Dham sites.",
  },
  {
    id: 8,
    name: "Nageshwar",
    location: "Dwarka",
    state: "Gujarat",
    coords: { lat: 22.2453, lng: 68.9684 },
    copy: "Near Dwarka in Gujarat. The Shiva lingam here is enshrined as Nagnesh — the serpent king.",
  },
  {
    id: 9,
    name: "Kashi Vishwanath",
    location: "Varanasi",
    state: "Uttar Pradesh",
    coords: { lat: 25.3109, lng: 83.0107 },
    copy: "In the heart of Varanasi, on the western bank of the Ganges. One of the 12 Jyotirlingas and one of the holiest Shiva shrines.",
  },
  {
    id: 10,
    name: "Trimbakeshwar",
    location: "Nashik",
    state: "Maharashtra",
    coords: { lat: 19.9322, lng: 73.5306 },
    copy: "Near Nashik, at the source of the Godavari river. One of the four sites of the Kumbh Mela.",
  },
  {
    id: 11,
    name: "Kedarnath",
    location: "Kedarnath",
    state: "Uttarakhand",
    coords: { lat: 30.7333, lng: 79.0667 },
    copy: "In the Himalayas at 3,583 m — the highest of the 12 Jyotirlingas. Open only 6 months a year due to snow.",
  },
  {
    id: 12,
    name: "Ghrishneshwar",
    location: "Aurangabad",
    state: "Maharashtra",
    coords: { lat: 19.8762, lng: 75.1433 },
    copy: "Near the Ellora caves in Aurangabad. The 12th Jyotirlinga, completing the canonical pilgrimage circuit.",
  },
];

export default jyotirlingas;
