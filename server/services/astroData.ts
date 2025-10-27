interface LunarPhase {
  phase: string;
  illumination: number;
  interpretation: string;
}

interface PlanetaryPosition {
  name: string;
  sign: string;
  degree: number;
}

interface AstrologicalData {
  lunarPhase: LunarPhase;
  planetaryPositions: PlanetaryPosition[];
}

// Calculate lunar phase for a given date
function calculateLunarPhase(date: Date): LunarPhase {
  // Simplified lunar phase calculation (days since known new moon)
  const knownNewMoon = new Date('2025-01-01').getTime(); // Reference new moon
  const synodicMonth = 29.53059; // Days in a lunar cycle
  const daysSinceNewMoon = (date.getTime() - knownNewMoon) / (1000 * 60 * 60 * 24);
  const phaseAge = daysSinceNewMoon % synodicMonth;
  const illumination = (1 - Math.cos((phaseAge / synodicMonth) * 2 * Math.PI)) * 50;

  let phase = "New Moon";
  let interpretation = "New beginnings. Time to plant seeds for future growth.";

  if (phaseAge < 3.69) {
    phase = "New Moon";
    interpretation = "New beginnings. Time to plant seeds for future growth.";
  } else if (phaseAge < 7.38) {
    phase = "Waxing Crescent";
    interpretation = "Building energy. Markets may show initial momentum.";
  } else if (phaseAge < 11.07) {
    phase = "First Quarter";
    interpretation = "Action and decision-making. Potential for breakouts.";
  } else if (phaseAge < 14.77) {
    phase = "Waxing Gibbous";
    interpretation = "Refinement and adjustment. Markets near peak energy.";
  } else if (phaseAge < 18.46) {
    phase = "Full Moon";
    interpretation = "Culmination and completion. Often marks major turning points.";
  } else if (phaseAge < 22.15) {
    phase = "Waning Gibbous";
    interpretation = "Disseminating wisdom. Markets may consolidate.";
  } else if (phaseAge < 25.84) {
    phase = "Last Quarter";
    interpretation = "Crisis and correction. Potential for trend changes.";
  } else {
    phase = "Waning Crescent";
    interpretation = "Release and rest. Prepare for the next cycle.";
  }

  return {
    phase,
    illumination: Math.round(illumination * 10) / 10,
    interpretation,
  };
}

// Calculate planetary positions (simplified zodiac positions)
function calculatePlanetaryPositions(date: Date): PlanetaryPosition[] {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  const zodiacSigns = [
    "Aries ♈", "Taurus ♉", "Gemini ♊", "Cancer ♋",
    "Leo ♌", "Virgo ♍", "Libra ♎", "Scorpio ♏",
    "Sagittarius ♐", "Capricorn ♑", "Aquarius ♒", "Pisces ♓"
  ];

  // Simplified planetary motion calculations
  const planets = [
    { name: "Sun ☉", period: 365, offset: 80 },
    { name: "Moon ☽", period: 27.3, offset: 10 },
    { name: "Mercury ☿", period: 88, offset: 150 },
    { name: "Venus ♀", period: 225, offset: 200 },
    { name: "Mars ♂", period: 687, offset: 50 },
    { name: "Jupiter ♃", period: 4333, offset: 120 },
    { name: "Saturn ♄", period: 10759, offset: 300 },
  ];

  return planets.map(planet => {
    const position = ((dayOfYear + planet.offset) / planet.period) * 12;
    const signIndex = Math.floor(position % 12);
    const degree = (position % 1) * 30;

    return {
      name: planet.name,
      sign: zodiacSigns[signIndex],
      degree: Math.round(degree * 10) / 10,
    };
  });
}

export function getAstrologicalData(dateString: string): AstrologicalData {
  const date = new Date(dateString);
  
  return {
    lunarPhase: calculateLunarPhase(date),
    planetaryPositions: calculatePlanetaryPositions(date),
  };
}
