export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export interface RollCalculation {
  areaSqFt: number;
  rollsNeeded: number;
  coveragePerRoll: number;
  wasteMarginPercent: number;
  materialCostMin: number;
  materialCostMax: number;
  laborCostMin: number;
  laborCostMax: number;
  totalCostMin: number;
  totalCostMax: number;
}

export function calculateWallpaperEstimate(
  widthFt: number,
  heightFt: number,
  tier: 'standard' | 'luxury' | 'custom' = 'luxury'
): RollCalculation {
  const areaSqFt = Math.max(10, widthFt * heightFt);
  // Standard Indian wallpaper roll is 0.53m x 10m ~ 57 sq. ft.
  // With pattern repeats and trimming, effective coverage is ~50 sq. ft.
  const coveragePerRoll = 50;
  const wasteMarginPercent = 15;
  const rollsNeeded = Math.ceil(areaSqFt / coveragePerRoll);

  let rollRateMin = 1400;
  let rollRateMax = 2200;
  if (tier === 'luxury') {
    rollRateMin = 2500;
    rollRateMax = 4800;
  } else if (tier === 'custom') {
    rollRateMin = 4500;
    rollRateMax = 8500;
  }

  const laborPerRollMin = 350;
  const laborPerRollMax = 500;

  const materialCostMin = rollsNeeded * rollRateMin;
  const materialCostMax = rollsNeeded * rollRateMax;
  const laborCostMin = rollsNeeded * laborPerRollMin;
  const laborCostMax = rollsNeeded * laborPerRollMax;

  return {
    areaSqFt,
    rollsNeeded,
    coveragePerRoll,
    wasteMarginPercent,
    materialCostMin,
    materialCostMax,
    laborCostMin,
    laborCostMax,
    totalCostMin: materialCostMin + laborCostMin,
    totalCostMax: materialCostMax + laborCostMax,
  };
}

export function calculatePaintingEstimate(
  areaSqFt: number,
  type: 'emulsion' | 'texture' | 'metallic'
): { min: number; max: number; perSqFtMin: number; perSqFtMax: number } {
  let rateMin = 18;
  let rateMax = 28;
  if (type === 'texture') {
    rateMin = 38;
    rateMax = 65;
  } else if (type === 'metallic') {
    rateMin = 75;
    rateMax = 140;
  }

  return {
    min: Math.round(areaSqFt * rateMin),
    max: Math.round(areaSqFt * rateMax),
    perSqFtMin: rateMin,
    perSqFtMax: rateMax,
  };
}
