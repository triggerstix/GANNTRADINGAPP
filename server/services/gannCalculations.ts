interface GannAngle {
  name: string;
  angle: number;
  price: number;
  percentChange: number;
}

interface GannAngles {
  upward: GannAngle[];
  downward: GannAngle[];
}

export function calculateGannAngles(
  pivotPrice: number,
  pivotDate: string,
  targetDate: string
): GannAngles {
  // Calculate number of days between dates
  const pivot = new Date(pivotDate);
  const target = new Date(targetDate);
  const daysDiff = Math.abs((target.getTime() - pivot.getTime()) / (1000 * 60 * 60 * 24));
  
  // Gann angle ratios
  const angles = [
    { name: "1x8", ratio: 1/8, angle: 7.5 },
    { name: "1x4", ratio: 1/4, angle: 15 },
    { name: "1x2", ratio: 1/2, angle: 26.25 },
    { name: "1x1", ratio: 1, angle: 45 },
    { name: "2x1", ratio: 2, angle: 63.75 },
    { name: "4x1", ratio: 4, angle: 75 },
    { name: "8x1", ratio: 8, angle: 82.5 },
  ];

  // Calculate upward angles (support levels)
  const upward: GannAngle[] = angles.map(a => {
    const priceChange = (daysDiff * a.ratio);
    const targetPrice = pivotPrice + priceChange;
    const percentChange = ((targetPrice - pivotPrice) / pivotPrice) * 100;
    
    return {
      name: a.name,
      angle: a.angle,
      price: targetPrice,
      percentChange: percentChange,
    };
  });

  // Calculate downward angles (resistance levels)
  const downward: GannAngle[] = angles.map(a => {
    const priceChange = (daysDiff * a.ratio);
    const targetPrice = pivotPrice - priceChange;
    const percentChange = ((targetPrice - pivotPrice) / pivotPrice) * 100;
    
    return {
      name: a.name,
      angle: a.angle,
      price: targetPrice,
      percentChange: percentChange,
    };
  });

  return { upward, downward };
}
