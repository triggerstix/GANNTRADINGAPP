
import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { MarketDataSchema, HistoricalDataPointSchema } from "@shared/types";
import yahooFinance from "yahoo-finance2";

export const marketRouter = router({
  /**
   * Get current market data for a symbol
   */
  getMarketData: publicProcedure
    .input(z.object({ symbol: z.string() }))
    .output(MarketDataSchema)
    .query(async ({ input }) => {
      const { symbol } = input;
      
      try {
        const quote = await yahooFinance.quote(symbol);
        
        return {
          symbol: quote.symbol,
          price: quote.regularMarketPrice || 0,
          change: quote.regularMarketChange || 0,
          changePercent: quote.regularMarketChangePercent || 0,
          volume: quote.regularMarketVolume,
          marketCap: quote.marketCap,
          high: quote.regularMarketDayHigh,
          low: quote.regularMarketDayLow,
          open: quote.regularMarketOpen,
          previousClose: quote.regularMarketPreviousClose,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.error(`Error fetching market data for ${symbol}:`, error);
        throw new Error(`Failed to fetch market data for ${symbol}`);
      }
    }),

  /**
   * Get historical data for a symbol
   */
  getHistoricalData: publicProcedure
    .input(
      z.object({
        symbol: z.string(),
        period1: z.string(),
        period2: z.string().optional(),
        interval: z.enum(["1d", "1wk", "1mo"]).default("1d"),
      })
    )
    .output(z.array(HistoricalDataPointSchema))
    .query(async ({ input }) => {
      const { symbol, period1, period2, interval } = input;
      
      try {
        const queryOptions = {
          period1: period1,
          period2: period2 || new Date().toISOString().split("T")[0],
          interval: interval as "1d" | "1wk" | "1mo",
        };
        
        const result = await yahooFinance.historical(symbol, queryOptions);
        
        return result.map((point) => ({
          date: point.date.toISOString().split("T")[0],
          open: point.open,
          high: point.high,
          low: point.low,
          close: point.close,
          volume: point.volume,
        }));
      } catch (error) {
        console.error(`Error fetching historical data for ${symbol}:`, error);
        throw new Error(`Failed to fetch historical data for ${symbol}`);
      }
    }),

  /**
   * Search for symbols
   */
  searchSymbols: publicProcedure
    .input(z.object({ query: z.string() }))
    .output(
      z.array(
        z.object({
          symbol: z.string(),
          name: z.string(),
          type: z.string(),
          exchange: z.string().optional(),
        })
      )
    )
    .query(async ({ input }) => {
      const { query } = input;
      
      try {
        const results = await yahooFinance.search(query);
        
        return results.quotes.slice(0, 10).map((quote) => ({
          symbol: quote.symbol,
          name: quote.longname || quote.shortname || quote.symbol,
          type: quote.quoteType || "Unknown",
          exchange: quote.exchange,
        }));
      } catch (error) {
        console.error(`Error searching symbols for ${query}:`, error);
        return [];
      }
    }),
});
