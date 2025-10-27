
import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { 
  GannAngleSchema, 
  SquareOfNineResultSchema, 
  TimeCycleSchema 
} from "@shared/types";
import { addDays, formatDate } from "@shared/utils";

export const gannRouter = router({
  /**
   * Calculate Gann Angles from a pivot point
   */
  calculateGannAngles: publicProcedure
    .input(
      z.object({
        pivotPrice: z.number(),
        pivotDate: z.string(),
        targetDate: z.string(),
      })
    )
    .output(
      z.object({
        upwardAngles: z.array(GannAngleSchema),
        downwardAngles: z.array(GannAngleSchema),
      })
    )
    .query(({ input }) => {
      const { pivotPrice, pivotDate, targetDate } = input;
      
      // Calculate days between pivot and target
      const days = Math.abs(
        (new Date(targetDate).getTime() - new Date(pivotDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      // Gann angle ratios
      const angles = [
        { name: "1x8", ratio: 1 / 8, angle: 7.5 },
        { name: "1x4", ratio: 1 / 4, angle: 15 },
        { name: "1x3", ratio: 1 / 3, angle: 18.75 },
        { name: "1x2", ratio: 1 / 2, angle: 26.25 },
        { name: "1x1", ratio: 1, angle: 45 },
        { name: "2x1", ratio: 2, angle: 63.75 },
        { name: "3x1", ratio: 3, angle: 71.25 },
        { name: "4x1", ratio: 4, angle: 75 },
        { name: "8x1", ratio: 8, angle: 82.5 },
      ];

      const upwardAngles = angles.map((a) => ({
        name: a.name,
        angle: a.angle,
        price: pivotPrice + pivotPrice * a.ratio * (days / 360),
        description: `Upward ${a.name} angle (${a.angle}°)`,
      }));

      const downwardAngles = angles.map((a) => ({
        name: a.name,
        angle: a.angle,
        price: pivotPrice - pivotPrice * a.ratio * (days / 360),
        description: `Downward ${a.name} angle (${a.angle}°)`,
      }));

      return { upwardAngles, downwardAngles };
    }),

  /**
   * Calculate Square of Nine grid and key levels
   */
  calculateSquareOfNine: publicProcedure
    .input(
      z.object({
        centerValue: z.number(),
        gridSize: z.number().min(7).max(21),
      })
    )
    .output(SquareOfNineResultSchema)
    .query(({ input }) => {
      const { centerValue, gridSize } = input;
      
      // Generate Square of Nine grid
      const grid: number[][] = [];
      const middle = Math.floor(gridSize / 2);
      
      // Initialize grid
      for (let i = 0; i < gridSize; i++) {
        grid[i] = new Array(gridSize).fill(0);
      }
      
      // Start from center and spiral outward
      let x = middle;
      let y = middle;
      let num = centerValue;
      grid[y][x] = num;
      
      // Spiral algorithm
      let steps = 1;
      while (steps < gridSize) {
        // Right
        for (let i = 0; i < steps && x < gridSize - 1; i++) {
          x++;
          num++;
          if (x < gridSize && y >= 0 && y < gridSize) grid[y][x] = num;
        }
        // Down
        for (let i = 0; i < steps && y < gridSize - 1; i++) {
          y++;
          num++;
          if (x >= 0 && x < gridSize && y < gridSize) grid[y][x] = num;
        }
        steps++;
        // Left
        for (let i = 0; i < steps && x > 0; i++) {
          x--;
          num++;
          if (x >= 0 && y >= 0 && y < gridSize) grid[y][x] = num;
        }
        // Up
        for (let i = 0; i < steps && y > 0; i++) {
          y--;
          num++;
          if (x >= 0 && x < gridSize && y >= 0) grid[y][x] = num;
        }
        steps++;
      }

      // Calculate key levels using square roots
      const sqrt = Math.sqrt(centerValue);
      
      const cardinalLevels = [
        { angle: 0, name: "0° (East)", value: Math.pow(sqrt + 1, 2) },
        { angle: 90, name: "90° (North)", value: Math.pow(sqrt + 0.5, 2) },
        { angle: 180, name: "180° (West)", value: Math.pow(sqrt - 1, 2) },
        { angle: 270, name: "270° (South)", value: Math.pow(sqrt - 0.5, 2) },
      ];

      const diagonalLevels = [
        { angle: 45, name: "45° (NE)", value: Math.pow(sqrt + 0.707, 2) },
        { angle: 135, name: "135° (NW)", value: Math.pow(sqrt + 0.293, 2) },
        { angle: 225, name: "225° (SW)", value: Math.pow(sqrt - 0.707, 2) },
        { angle: 315, name: "315° (SE)", value: Math.pow(sqrt - 0.293, 2) },
      ];

      return {
        centerValue,
        gridSize,
        grid,
        cardinalLevels,
        diagonalLevels,
      };
    }),

  /**
   * Calculate Time Cycles from a pivot date
   */
  calculateTimeCycles: publicProcedure
    .input(
      z.object({
        startDate: z.string(),
      })
    )
    .output(
      z.object({
        gannCycles: z.array(TimeCycleSchema),
        naturalCycles: z.array(TimeCycleSchema),
      })
    )
    .query(({ input }) => {
      const { startDate } = input;
      const start = new Date(startDate);
      const now = new Date();

      const gannCyclesData = [
        { name: "7 Days", days: 7, description: "Weekly cycle" },
        { name: "14 Days", days: 14, description: "Two weeks" },
        { name: "21 Days", days: 21, description: "Three weeks" },
        { name: "30 Days", days: 30, description: "Monthly cycle" },
        { name: "45 Days", days: 45, description: "1.5 months" },
        { name: "60 Days", days: 60, description: "Two months" },
        { name: "90 Days", days: 90, description: "Quarterly cycle" },
        { name: "120 Days", days: 120, description: "Four months" },
        { name: "144 Days", days: 144, description: "Gann's square of 12" },
        { name: "180 Days", days: 180, description: "Half year" },
        { name: "360 Days", days: 360, description: "Full year cycle" },
      ];

      const naturalCyclesData = [
        { name: "Lunar Month", days: 29.53, description: "Moon's orbital period" },
        { name: "Mercury Cycle", days: 88, description: "Mercury's orbital period" },
        { name: "Venus Cycle", days: 225, description: "Venus's orbital period" },
        { name: "Mars Cycle", days: 687, description: "Mars's orbital period" },
      ];

      const calculateCycle = (cycle: { name: string; days: number; description: string }) => {
        const targetDate = addDays(start, Math.round(cycle.days));
        const daysUntil = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
          name: cycle.name,
          days: cycle.days,
          description: cycle.description,
          targetDate: formatDate(targetDate),
          daysUntil,
        };
      };

      return {
        gannCycles: gannCyclesData.map(calculateCycle),
        naturalCycles: naturalCyclesData.map(calculateCycle),
      };
    }),
});
