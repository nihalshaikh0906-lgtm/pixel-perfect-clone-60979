import { describe, it, expect } from "vitest";
import { findClosestOptions, UnitCandidate } from "./closest";

describe("src/ai/closest.ts - Closest Match Fallback", () => {
  const mockInventory: UnitCandidate[] = [
    {
      id: "u1",
      project_name: "Downtown Views",
      price_aed: 3500000,
      bedrooms: 2,
      location: "Downtown Dubai",
    },
    {
      id: "u2",
      project_name: "Business Bay Tower",
      price_aed: 2200000,
      bedrooms: 2,
      location: "Business Bay",
    },
    {
      id: "u3",
      project_name: "JVC Studio Oasis",
      price_aed: 650000,
      bedrooms: 0,
      location: "JVC",
    },
    {
      id: "u4",
      project_name: "Dubai Hills Villa",
      price_aed: 6000000,
      bedrooms: 4,
      location: "Dubai Hills Estate",
    },
  ];

  it("returns exact match when inventory satisfies criteria", () => {
    const result = findClosestOptions(mockInventory, {
      max_price: 2500000,
      bedrooms: 2,
      location: "Business Bay",
    });

    expect(result.has_exact_match).toBe(true);
    expect(result.closest_units.length).toBe(1);
    expect(result.closest_units[0].id).toBe("u2");
  });

  it("finds closest options when 0 exact matches exist", () => {
    // Requesting 2BR in Downtown under 1.5M AED (none exist, u1 is 3.5M, u2 is 2.2M in Business Bay)
    const result = findClosestOptions(mockInventory, {
      max_price: 1500000,
      bedrooms: 2,
      location: "Downtown Dubai",
    });

    expect(result.has_exact_match).toBe(false);
    expect(result.closest_units.length).toBeGreaterThan(0);
    expect(result.explanation).toContain("No exact inventory matches found");
    expect(result.explanation).toContain("closest available alternatives");

    // The closest 2BR units (u2 Business Bay, u1 Downtown) should rank before 4BR or studio
    const topMatch = result.closest_units[0];
    expect(topMatch.bedrooms).toBe(2);
  });

  it("handles empty inventory gracefully", () => {
    const result = findClosestOptions([], { max_price: 1000000 });
    expect(result.has_exact_match).toBe(false);
    expect(result.closest_units.length).toBe(0);
    expect(result.explanation).toContain("No property units available");
  });
});
