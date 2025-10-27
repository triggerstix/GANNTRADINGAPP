
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Link } from "wouter";
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { POPULAR_SYMBOLS } from "@/lib/const";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function MarketData() {
  const [symbol, setSymbol] = useState("AAPL");
  const [customSymbol, setCustomSymbol] = useState("");

  // Fetch current market data
  const { data: marketData, isLoading: marketLoading, refetch: refetchMarket } = 
    trpc.market.getMarketData.useQuery({ symbol });

  // Fetch historical data (90 days)
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);
  
  const { data: historicalData, isLoading: historyLoading } = 
    trpc.market.getHistoricalData.useQuery({
      symbol,
      period1: startDate.toISOString().split("T")[0],
      interval: "1d",
    });

  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol);
    setCustomSymbol("");
  };

  const handleCustomSymbolSubmit = () => {
    if (customSymbol.trim()) {
      setSymbol(customSymbol.toUpperCase().trim());
    }
  };

  const isPositive = marketData ? marketData.change >= 0 : true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <TrendingUp className="h-6 w-6 text-green-500" />
          <h1 className="text-2xl font-bold text-white">Market Data</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Symbol Selection */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Select Symbol</CardTitle>
            <CardDescription className="text-slate-400">
              Choose from popular symbols or enter a custom ticker
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300 mb-2 block">Quick Select</Label>
                <Select
                  value={symbol}
                  onChange={(e) => handleSymbolChange(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                >
                  {POPULAR_SYMBOLS.map((s) => (
                    <option key={s.symbol} value={s.symbol}>
                      {s.symbol} - {s.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label className="text-slate-300 mb-2 block">Custom Symbol</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter ticker (e.g., NVDA)"
                    value={customSymbol}
                    onChange={(e) => setCustomSymbol(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCustomSymbolSubmit()}
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                  <Button onClick={handleCustomSymbolSubmit}>Go</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Price */}
        {marketLoading ? (
          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardContent className="py-12 text-center text-slate-400">
              Loading market data...
            </CardContent>
          </Card>
        ) : marketData ? (
          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-3xl">{marketData.symbol}</CardTitle>
                  <CardDescription className="text-slate-400 mt-1">
                    Last updated: {new Date(marketData.timestamp).toLocaleString()}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchMarket()}
                  className="border-slate-600 text-slate-300"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Current Price</p>
                  <p className="text-white text-3xl font-bold">
                    ${marketData.price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Change</p>
                  <div className="flex items-center gap-2">
                    {isPositive ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    )}
                    <p className={`text-2xl font-bold ${isPositive ? "text-green-500" : "text-red-500"}`}>
                      {isPositive ? "+" : ""}
                      {marketData.change.toFixed(2)} ({marketData.changePercent.toFixed(2)}%)
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Day Range</p>
                  <p className="text-white text-lg">
                    ${marketData.low?.toFixed(2)} - ${marketData.high?.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Volume</p>
                  <p className="text-white text-lg">
                    {marketData.volume ? (marketData.volume / 1000000).toFixed(2) + "M" : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Historical Chart */}
        {historyLoading ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="py-12 text-center text-slate-400">
              Loading historical data...
            </CardContent>
          </Card>
        ) : historicalData && historicalData.length > 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">90-Day Price History</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(value) => `$${value.toFixed(0)}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #475569',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="close" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
