
import { z } from "zod";

// Market Data Types
export const MarketDataSchema = z.object({
  symbol: z.string(),
  price: z.number(),
  change: z.number(),
  changePercent: z.number(),
  volume: z.number().optional(),
  marketCap: z.number().optional(),
  high: z.number().optional(),
  low: z.number().optional(),
  open: z.number().optional(),
  previousClose: z.number().optional(),
  timestamp: z.string(),
});

export type MarketData = z.infer<typeof MarketDataSchema>;

// Historical Data Types
export const HistoricalDataPointSchema = z.object({
  date: z.string(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number(),
});

export type HistoricalDataPoint = z.infer<typeof HistoricalDataPointSchema>;

// Gann Angle Types
export const GannAngleSchema = z.object({
  name: z.string(),
  angle: z.number(),
  price: z.number(),
  description: z.string(),
});

export type GannAngle = z.infer<typeof GannAngleSchema>;

// Square of Nine Types
export const SquareOfNineResultSchema = z.object({
  centerValue: z.number(),
  gridSize: z.number(),
  grid: z.array(z.array(z.number())),
  cardinalLevels: z.array(
    z.object({
      angle: z.number(),
      name: z.string(),
      value: z.number(),
    })
  ),
  diagonalLevels: z.array(
    z.object({
      angle: z.number(),
      name: z.string(),
      value: z.number(),
    })
  ),
});

export type SquareOfNineResult = z.infer<typeof SquareOfNineResultSchema>;

// Time Cycle Types
export const TimeCycleSchema = z.object({
  name: z.string(),
  days: z.number(),
  description: z.string(),
  targetDate: z.string(),
  daysUntil: z.number(),
});

export type TimeCycle = z.infer<typeof TimeCycleSchema>;

// User Types (for auth)
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  name: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;
