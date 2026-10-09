// Shared sample inventory for the Offplan / Ready Property / Rentals pages.
// Demo data only — nothing here is written to the database.

export type InventoryCategory = "offplan" | "ready" | "rental";

export type MockProperty = {
  id: string;
  title: string;
  community: string;
  bedrooms: string;
  size_sqft: number;
  price: number;
  status: string;
  agent: string;
  category: InventoryCategory;
};

export const MOCK_PROPERTIES: MockProperty[] = [
  { id: "p1", title: "Marina Vista 2 BR", community: "Dubai Marina", bedrooms: "2", size_sqft: 1180, price: 2450000, status: "live", agent: "Sara Khan", category: "ready" },
  { id: "p2", title: "Palm Garden Villa", community: "Palm Jumeirah", bedrooms: "4", size_sqft: 4200, price: 12800000, status: "live", agent: "Omar Farooq", category: "ready" },
  { id: "p3", title: "Downtown Loft Studio", community: "Downtown Dubai", bedrooms: "Studio", size_sqft: 480, price: 980000, status: "reserved", agent: "Sara Khan", category: "ready" },
  { id: "p4", title: "Creek Harbour 1 BR", community: "Dubai Creek Harbour", bedrooms: "1", size_sqft: 720, price: 1350000, status: "sold", agent: "Layla Haddad", category: "ready" },
  { id: "p5", title: "Emaar South Townhouse", community: "Emaar South", bedrooms: "3", size_sqft: 2100, price: 1890000, status: "live", agent: "Omar Farooq", category: "offplan" },
  { id: "p6", title: "Sobha Hartland 2 BR", community: "Sobha Hartland", bedrooms: "2", size_sqft: 1240, price: 2150000, status: "live", agent: "Layla Haddad", category: "offplan" },
  { id: "p7", title: "Damac Lagoons Villa", community: "Damac Lagoons", bedrooms: "5", size_sqft: 3800, price: 3400000, status: "reserved", agent: "Sara Khan", category: "offplan" },
  { id: "p8", title: "JVC Skyline 1 BR", community: "Jumeirah Village Circle", bedrooms: "1", size_sqft: 690, price: 820000, status: "live", agent: "Omar Farooq", category: "offplan" },
  { id: "p9", title: "Marina Quay 2 BR (rent)", community: "Dubai Marina", bedrooms: "2", size_sqft: 1150, price: 145000, status: "live", agent: "Layla Haddad", category: "rental" },
  { id: "p10", title: "JLT Cluster D Studio", community: "Jumeirah Lake Towers", bedrooms: "Studio", size_sqft: 460, price: 52000, status: "live", agent: "Sara Khan", category: "rental" },
  { id: "p11", title: "Hills Estate 3 BR (rent)", community: "Dubai Hills Estate", bedrooms: "3", size_sqft: 1980, price: 210000, status: "reserved", agent: "Omar Farooq", category: "rental" },
  { id: "p12", title: "Business Bay 1 BR (rent)", community: "Business Bay", bedrooms: "1", size_sqft: 740, price: 85000, status: "live", agent: "Layla Haddad", category: "rental" },
  { id: "p13", title: "Al Barsha 3 BR", community: "Al Barsha", bedrooms: "3", size_sqft: 2350, price: 3250000, status: "live", agent: "Sara Khan", category: "ready" },
  { id: "p14", title: "Silicon Oasis Studio", community: "Dubai Silicon Oasis", bedrooms: "Studio", size_sqft: 450, price: 460000, status: "live", agent: "Omar Farooq", category: "ready" },
  { id: "p15", title: "Al Barsha 2 BR (rent)", community: "Al Barsha", bedrooms: "2", size_sqft: 1250, price: 110000, status: "live", agent: "Omar Farooq", category: "rental" },
  { id: "p16", title: "City Walk 1 BR (rent)", community: "City Walk", bedrooms: "1", size_sqft: 810, price: 130000, status: "reserved", agent: "Sara Khan", category: "rental" },
];

export const byCategory = (c: InventoryCategory) => MOCK_PROPERTIES.filter((p) => p.category === c);
