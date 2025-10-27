import yahooFinance from 'yahoo-finance2';

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export async function getMarketData(symbol: string): Promise<MarketData> {
  try {
    const quote: any = await (yahooFinance as any).quoteSummary(symbol, {
      modules: ['price'],
    });
    
    const priceData = quote.price;
    if (!priceData) {
      throw new Error('No price data available');
    }

    return {
      symbol: symbol,
      price: priceData.regularMarketPrice || 0,
      change: priceData.regularMarketChange || 0,
      changePercent: priceData.regularMarketChangePercent || 0,
      high: priceData.regularMarketDayHigh || 0,
      low: priceData.regularMarketDayLow || 0,
      volume: priceData.regularMarketVolume || 0,
    };
  } catch (error) {
    console.error(`Error fetching market data for ${symbol}:`, error);
    throw new Error(`Failed to fetch market data for ${symbol}`);
  }
}

export async function getHistoricalData(
  symbol: string,
  days: number = 90
): Promise<HistoricalData[]> {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result: any = await (yahooFinance as any).chart(symbol, {
      period1: startDate,
      period2: endDate,
      interval: '1d',
    });

    if (!result.quotes || result.quotes.length === 0) {
      throw new Error('No historical data available');
    }

    return result.quotes.map((item: any) => ({
      date: item.date.toISOString().split('T')[0],
      open: item.open || 0,
      high: item.high || 0,
      low: item.low || 0,
      close: item.close || 0,
      volume: item.volume || 0,
    }));
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    throw new Error(`Failed to fetch historical data for ${symbol}`);
  }
}
