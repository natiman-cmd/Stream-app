export type PropertyType = "Apartment" | "House" | "Villa" | "Commercial";

export interface Property {
  id: string;
  title: string;
  location: string;
  type: PropertyType;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  amenities: string[];
  imageUrl: string;
  featured?: boolean;
  verified?: boolean;
  agent: {
    name: string;
    phone: string;
  };
}

export const PROPERTIES: Property[] = [
  {
    id: "piazza-courtyard",
    title: "Piazza Courtyard Apartment",
    location: "Piazza, Arada",
    type: "Apartment",
    price: 4800000,
    bedrooms: 2,
    bathrooms: 2,
    area: 92,
    description: "A bright two-bedroom apartment close to Piazza cafés, galleries, and the heart of central Addis. The home has a generous living room, a practical kitchen, and a quiet shared courtyard.",
    amenities: ["Secure entry", "Courtyard", "Backup water", "Parking"],
    imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85",
    featured: true,
    verified: true,
    agent: { name: "Mekdes Alemu", phone: "+251911000101" },
  },
  {
    id: "arat-kilo-townhouse",
    title: "Arat Kilo Townhouse",
    location: "Arat Kilo, Arada",
    type: "House",
    price: 8500000,
    bedrooms: 3,
    bathrooms: 2,
    area: 168,
    description: "A calm, family-sized townhouse with a private garden and flexible upper-floor study. Walkable to schools, groceries, and the university district.",
    amenities: ["Private garden", "Study room", "Solar hot water", "Garage"],
    imageUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
    verified: true,
    agent: { name: "Dawit Bekele", phone: "+251911000202" },
  },
  {
    id: "shiro-meda-villa",
    title: "Shiro Meda Garden Villa",
    location: "Shiro Meda, Arada",
    type: "Villa",
    price: 14500000,
    bedrooms: 4,
    bathrooms: 3,
    area: 286,
    description: "A spacious villa with mature trees, natural light, and a generous entertaining floor. A strong fit for a family looking for privacy without leaving the city.",
    amenities: ["Large garden", "Staff quarters", "Fireplace", "Two-car garage"],
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    featured: true,
    verified: true,
    agent: { name: "Selamawit Tesfaye", phone: "+251911000303" },
  },
  {
    id: "tewodros-loft",
    title: "Tewodros Square Loft",
    location: "Tewodros Square, Arada",
    type: "Apartment",
    price: 3600000,
    bedrooms: 1,
    bathrooms: 1,
    area: 58,
    description: "A compact, modern loft for a city-first lifestyle. High ceilings, wide windows, and a central address make this an easy lock-and-leave home.",
    amenities: ["Elevator", "Concierge", "Fiber ready", "Rooftop view"],
    imageUrl: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=85",
    agent: { name: "Yonas Girma", phone: "+251911000404" },
  },
  {
    id: "mexico-square-home",
    title: "Mexico Square Family Home",
    location: "Mexico Square, Arada",
    type: "House",
    price: 9800000,
    bedrooms: 4,
    bathrooms: 3,
    area: 224,
    description: "A well-proportioned home with a shaded veranda, separate guest room, and room to update over time. Convenient access to transport and central business districts.",
    amenities: ["Veranda", "Guest room", "Laundry room", "Compound security"],
    imageUrl: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=85",
    agent: { name: "Rahel Worku", phone: "+251911000505" },
  },
  {
    id: "ras-desta-office",
    title: "Ras Desta Office Suite",
    location: "Ras Desta Damtew, Arada",
    type: "Commercial",
    price: 7200000,
    bedrooms: 0,
    bathrooms: 2,
    area: 118,
    description: "A polished commercial unit for a studio, consultancy, or growing team. The floor plan supports a reception, private office, and collaborative workspace.",
    amenities: ["Street frontage", "Reception area", "Generator backup", "Parking"],
    imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85",
    verified: true,
    agent: { name: "Nati Properties", phone: "+251911000606" },
  },
];

export function getProperty(id: string | undefined) {
  return PROPERTIES.find((property) => property.id === id);
}

export function formatPrice(price: number) {
  return `ETB ${price.toLocaleString()}`;
}