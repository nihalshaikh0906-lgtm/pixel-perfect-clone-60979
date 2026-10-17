/**
 * Response Shaping & Attribution Formatting for DealOS Mastermind
 */

export type SourceType = "dealos" | "ejari_median" | "ejari_building";

export interface SourceOptions {
  contractCount?: number;
  communityName?: string;
  buildingName?: string;
}

/**
 * Returns the exact mandatory RERA/DealOS source label.
 */
export function formatSourceLabel(type: SourceType, options: SourceOptions = {}): string {
  switch (type) {
    case "dealos":
      return "Source: DealOS Database (as provided by developer)";
    case "ejari_median":
      if (options.contractCount && options.contractCount >= 5) {
        return `Source: DLD Ejari rental contracts (community median, n = ${options.contractCount})`;
      }
      return "Source: DLD Ejari (insufficient contracts for reliable median)";
    case "ejari_building":
      return `Source: DLD Ejari rental contracts (building data, n = ${options.contractCount ?? "N/A"})`;
    default:
      return "Source: DealOS Database";
  }
}

/**
 * Standard legal and regulatory disclaimers.
 */
export const DISCLAIMERS = {
  investment:
    "\n\n*Disclaimer: DealOS provides historical and market transaction data for informative purposes only. Not intended as financial, tax, or investment advice. Yields and projections are indicative and not guaranteed.*",
  outlier:
    "⚠️ **Outlier Notice**: This unit is flagged in the system for atypical pricing or square footage. Please verify the live developer inventory before presenting to a client.\n\n",
  goldenVisa:
    "\n\n*Note: Golden Visa qualification is indicative and subject to official approval by the Dubai Land Department (DLD) and ICP.*",
};

/**
 * Inspects response text for investment guarantees or missing disclaimers,
 * ensuring regulatory compliance.
 */
export function shapeResponse(
  rawText: string,
  options: {
    hasOutlier?: boolean;
    hasInvestmentQuestion?: boolean;
    sourceType?: SourceType;
    contractCount?: number;
  } = {},
): string {
  let shaped = (rawText || "").trim();

  // If outlier flag is set and not already present in text
  if (options.hasOutlier && !shaped.toLowerCase().includes("outlier")) {
    shaped = DISCLAIMERS.outlier + shaped;
  }

  // If investment advice or ROI was discussed and disclaimer is missing
  const mentionsRoi = /roi|yield|investment|return|appreciation|capital gain/i.test(shaped);
  if ((options.hasInvestmentQuestion || mentionsRoi) && !shaped.toLowerCase().includes("disclaimer")) {
    shaped += DISCLAIMERS.investment;
  }

  return shaped;
}
