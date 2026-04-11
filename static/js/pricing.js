// ===================================================
// BUNNY PRICING ENGINE
// ===================================================

const PRICING = {

  // Base rates
  BASE_FEE:    180,    // flat booking fee (₹)
  DIST_RATE:   1.8,    // ₹ per km
  WEIGHT_RATE: 0.9,    // ₹ per kg
  AVG_SPEED:   55,     // km/h (for time estimate)

  // Tier multipliers on top of base price
  TIERS: {
    economy: { mult: 1.0,  label: "Economy",  days: "2–3 days"   },
    smart:   { mult: 1.55, label: "Smart",    days: "Next day"   },
    premium: { mult: 2.2,  label: "Premium",  days: "Same day"   },
  },

  // Surge multipliers by demand level
  SURGE: {
    low:    1.0,   // normal — no surge
    medium: 1.3,   // moderate demand — +30%
    high:   1.7,   // peak demand — +70%
  },

  // Approx road distances between major cities (km)
  DISTANCES: {
    "Hyderabad-Mumbai":   711,
    "Delhi-Mumbai":      1415,
    "Delhi-Bangalore":   2150,
    "Delhi-Chennai":     2180,
    "Delhi-Kolkata":     1474,
    "Delhi-Hyderabad":   1568,
    "Mumbai-Bangalore":   984,
    "Mumbai-Chennai":    1334,
    "Bangalore-Chennai":  346,
    "Hyderabad-Chennai":  626,
    "Hyderabad-Bangalore":570,
    "Mumbai-Pune":        148,
    "Delhi-Jaipur":       268,
    // Add more as needed — always store A→B, lookup handles reverse
  },
};


// ===================================================
// MAIN FUNCTION — call this from map.html
// ===================================================
function calculatePricing(fromCity, toCity, weightKg = 50, demandLevel = "low") {

  const key     = fromCity + "-" + toCity;
  const keyRev  = toCity   + "-" + fromCity;
  const distKm  = PRICING.DISTANCES[key] || PRICING.DISTANCES[keyRev] || 500;

  const distCost   = distKm   * PRICING.DIST_RATE;
  const weightCost = weightKg * PRICING.WEIGHT_RATE;
  const basePrice  = PRICING.BASE_FEE + distCost + weightCost;

  const surgeMult  = PRICING.SURGE[demandLevel] || 1.0;
  const timeHrs    = (distKm / PRICING.AVG_SPEED).toFixed(1);

  const result = {
    distKm,
    timeHrs,
    surgeMult,
    breakdown: {
      baseFee:     PRICING.BASE_FEE,
      distCost:    Math.round(distCost),
      weightCost:  Math.round(weightCost),
    },
    tiers: {},
  };

  // Calculate price for each tier
  for (const [key, tier] of Object.entries(PRICING.TIERS)) {
    const price = Math.round(basePrice * tier.mult * surgeMult);
    result.tiers[key] = {
      label:  tier.label,
      days:   tier.days,
      price,
      priceFormatted: "₹" + price.toLocaleString("en-IN"),
    };
  }

  return result;
}