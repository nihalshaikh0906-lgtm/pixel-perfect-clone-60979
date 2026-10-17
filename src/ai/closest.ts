/**
 * Closest Match Fallback Algorithm for DealOS
 * When exact filters (budget, bedrooms, area) yield 0 matches,
 * finds and ranks the closest available alternatives with transparent disclaimers.
 */

export interface UnitCandidate {
  id: string | number;
  project_id?: string | number;
  project_name?: string;
  unit_name?: string;
  price_aed: number;
  bedrooms: number;
  area_sqft?: number;
  location?: string;
  handover_date?: string;
  payment_plan?: string;
  url?: string;
  [key: string]: unknown;
}

export interface SearchCriteria {
  min_price?: number;
  max_price?: number;
  target_price?: number;
  bedrooms?: number;
  location?: string;
}

export interface ClosestMatchResult<T extends UnitCandidate> {
  has_exact_match: boolean;
  total_candidates: number;
  closest_units: Array<T & { score: number; match_reason: string }>;
  explanation: string;
}

/**
 * Calculates a match distance score between a unit and the desired criteria.
 * Lower score = closer match.
 */
function calculateDistance(unit: UnitCandidate, criteria: SearchCriteria): { score: number; reason: string } {
  let score = 0;
  const reasons: string[] = [];

  // Price distance
  const targetPrice = criteria.target_price ?? criteria.max_price ?? criteria.min_price;
  if (targetPrice && unit.price_aed) {
    const priceDiff = Math.abs(unit.price_aed - targetPrice);
    const pricePctDiff = priceDiff / targetPrice;
    score += pricePctDiff * 100;

    if (criteria.max_price && unit.price_aed > criteria.max_price) {
      const overPct = Math.round(((unit.price_aed - criteria.max_price) / criteria.max_price) * 100);
      reasons.push(`${overPct}% above max budget`);
    } else if (criteria.min_price && unit.price_aed < criteria.min_price) {
      const underPct = Math.round(((criteria.min_price - unit.price_aed) / criteria.min_price) * 100);
      reasons.push(`${underPct}% below min budget`);
    } else {
      reasons.push("within budget range");
    }
  }

  // Bedroom distance
  if (criteria.bedrooms !== undefined) {
    const bedDiff = Math.abs(unit.bedrooms - criteria.bedrooms);
    score += bedDiff * 50; // Each bedroom difference adds significant penalty
    if (bedDiff > 0) {
      reasons.push(`${unit.bedrooms} BR vs requested ${criteria.bedrooms} BR`);
    } else {
      reasons.push("exact bedroom match");
    }
  }

  // Location distance
  if (criteria.location && unit.location) {
    const normReq = criteria.location.toLowerCase().trim();
    const normUnit = unit.location.toLowerCase().trim();
    if (!normUnit.includes(normReq) && !normReq.includes(normUnit)) {
      score += 40; // Location penalty
      reasons.push(`in nearby ${unit.location}`);
    } else {
      reasons.push("location match");
    }
  }

  return {
    score: Math.round(score * 100) / 100,
    reason: reasons.join(", "),
  };
}

/**
 * Evaluates candidate units against criteria and returns closest matches
 * when exact criteria yield 0 results.
 */
export function findClosestOptions<T extends UnitCandidate>(
  units: T[],
  criteria: SearchCriteria,
  limit = 3,
): ClosestMatchResult<T> {
  if (!units || units.length === 0) {
    return {
      has_exact_match: false,
      total_candidates: 0,
      closest_units: [],
      explanation: "No property units available in the system matching or close to the requested criteria.",
    };
  }

  // Check if any unit is an exact match
  const exactMatches = units.filter((u) => {
    if (criteria.max_price && u.price_aed > criteria.max_price) return false;
    if (criteria.min_price && u.price_aed < criteria.min_price) return false;
    if (criteria.bedrooms !== undefined && u.bedrooms !== criteria.bedrooms) return false;
    if (
      criteria.location &&
      u.location &&
      !u.location.toLowerCase().includes(criteria.location.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  if (exactMatches.length > 0) {
    return {
      has_exact_match: true,
      total_candidates: exactMatches.length,
      closest_units: exactMatches.slice(0, limit).map((u) => ({
        ...u,
        score: 0,
        match_reason: "Exact criteria match",
      })),
      explanation: `Found ${exactMatches.length} exact matching unit(s).`,
    };
  }

  // No exact matches: rank all candidates by distance score
  const scored = units.map((unit) => {
    const { score, reason } = calculateDistance(unit, criteria);
    return {
      ...unit,
      score,
      match_reason: reason,
    };
  });

  scored.sort((a, b) => a.score - b.score);
  const topClosest = scored.slice(0, limit);

  const criteriaDesc = [
    criteria.bedrooms !== undefined ? `${criteria.bedrooms}-bedroom` : null,
    criteria.location ? `in ${criteria.location}` : null,
    criteria.max_price ? `up to AED ${criteria.max_price.toLocaleString()}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const explanation =
    `No exact inventory matches found for ${criteriaDesc || "specified criteria"}. ` +
    `Showing the ${topClosest.length} closest available alternatives based on budget proximity and bedroom count.`;

  return {
    has_exact_match: false,
    total_candidates: units.length,
    closest_units: topClosest,
    explanation,
  };
}
