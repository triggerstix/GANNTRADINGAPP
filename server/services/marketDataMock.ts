// Mock market data service for testing
// Replace with real API integration in production

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

// Generate realistic mock data based on symbol
function generateMockPrice(symbol: string): number {
  const basePrices: { [key: string]: number } = {
    'AAPL': 250,
    'GOOGL': 150,
    'MSFT': 400,
    'TSLA': 250,
    'SPY': 450,
    'BTC-USD': 65000,
    'ETH-USD': 3500,
  };
  return basePrices[symbol] || 100;
}

export async function getMarketData(symbol: string): Promise<MarketData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const basePrice = generateMockPrice(symbol);
  const randomChange = (Math.random() - 0.5) * 10;
  const price = basePrice + randomChange;
  const change = randomChange;
  const changePercent = (change / basePrice) * 100;
  
  return {
    symbol,
    price,
    change,
    changePercent,
    high: price + Math.random() * 5,
    low: price - Math.random() * 5,
    volume: Math.floor(Math.random() * 50000000) + 10000000,
  };
}

export async function getHistoricalData(
  symbol: string,
  days: number = 90
): Promise<HistoricalData[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const data: HistoricalData[] = [];
  const basePrice = generateMockPrice(symbol);
  let currentPrice = basePrice;
  
  const endDate = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    
    // Generate realistic OHLC data with some volatility
    const volatility = basePrice * 0.02;
    const change = (Math.random() - 0.5) * volatility;
    currentPrice += change;
    
    const open = currentPrice;
    const close = currentPrice + (Math.random() - 0.5) * volatility;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 50000000) + 10000000,
    });
    
    currentPrice = close;
  }
  
  return data;
}
