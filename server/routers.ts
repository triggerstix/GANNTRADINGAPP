
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
// Use mock data for now - replace with real yahoo-finance2 implementation when API is fixed
import * as marketDataService from './services/marketDataMock.js';
import * as gannService from './services/gannCalculations.js';
import * as astroService from './services/astroData.js';

const t = initTRPC.create();

export const appRouter = t.router({
  gann: t.router({
    // Market Data
    getMarketData: t.procedure
      .input(z.object({ symbol: z.string() }))
      .query(async ({ input }) => {
        return await marketDataService.getMarketData(input.symbol);
      }),

    getHistoricalData: t.procedure
      .input(z.object({ symbol: z.string(), days: z.number().default(90) }))
      .query(async ({ input }) => {
        return await marketDataService.getHistoricalData(input.symbol, input.days);
      }),

    // Gann Angles
    calculateGannAngles: t.procedure
      .input(z.object({
        pivotPrice: z.number(),
        pivotDate: z.string(),
        targetDate: z.string(),
      }))
      .query(({ input }) => {
        return gannService.calculateGannAngles(
          input.pivotPrice,
          input.pivotDate,
          input.targetDate
        );
      }),

    // Astrological Data
    getAstrologicalData: t.procedure
      .input(z.object({ date: z.string() }))
      .query(({ input }) => {
        return astroService.getAstrologicalData(input.date);
      }),
  }),
});

export type AppRouter = typeof appRouter;
