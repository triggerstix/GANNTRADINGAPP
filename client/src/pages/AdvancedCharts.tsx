import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Link } from "wouter";
import { ArrowLeft, Activity } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { POPULAR_SYMBOLS } from "@/lib/const";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdvancedCharts() {
  const [symbol, setSymbol] = useState("AAPL");
  const [customSymbol, setCustomSymbol] = useState("");
  const [indicators, setIndicators] = useState<string[]>([]);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90);

  const { data: historicalData, isLoading } = trpc.market.getHistoricalData.useQuery({
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

  const toggleIndicator = (indicator: string) => {
    setIndicators((prev) =>
      prev.includes(indicator) ? prev.filter((i) => i !== indicator) : [...prev, indicator]
    );
  };

  // Calculate SMA
  const calculateSMA = (data: any[], period: number) => {
    return data.map((item, idx, arr) => {
      if (idx < period - 1) return null;
      const sum = arr.slice(idx - period + 1, idx + 1).reduce((acc, val) => acc + val.close, 0);
      return sum / period;
    });
  };

  const displayData = historicalData
    ? historicalData.map((item, idx) => ({
        ...item,
        formattedDate: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        sma20: indicators.includes("SMA20") && historicalData.length >= 20
          ? calculateSMA(historicalData, 20)[idx]
          : null,
        sma50: indicators.includes("SMA50") && historicalData.length >= 50
          ? calculateSMA(historicalData, 50)[idx]
          : null,
      }))
    : [];

  // Custom candlestick shape
  const Candlestick = (props: any) => {
    const { x, y, width, height, payload } = props;
    if (!payload) return null;

    const isUp = payload.close >= payload.open;
    const color = isUp ? "#10b981" : "#ef4444";
    const wickX = x + width / 2;

    return (
      <g>
        <line x1={wickX} y1={y} x2={wickX} y2={y + height} stroke={color} strokeWidth={1} />
        <rect
          x={x}
          y={isUp ? y + (height * (payload.high - payload.close)) / (payload.high - payload.low) : y + (height * (payload.high - payload.open)) / (payload.high - payload.low)}
          width={width}
          height={Math.abs((height * (payload.close - payload.open)) / (payload.high - payload.low))}
          fill={color}
          stroke={color}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      const isUp = data.close >= data.open;
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold mb-2">{data.formattedDate}</p>
          <div className="space-y-1 text-sm">
            <p className="text-slate-300">Open: ${data.open.toFixed(2)}</p>
            <p className="text-slate-300">High: ${data.high.toFixed(2)}</p>
            <p className="text-slate-300">Low: ${data.low.toFixed(2)}</p>
            <p className={isUp ? "text-green-400" : "text-red-400"}>
              Close: ${data.close.toFixed(2)}
            </p>
            <p className="text-slate-400">Volume: {(data.volume / 1000000).toFixed(2)}M</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <Activity className="h-6 w-6 text-cyan-500" />
          <h1 className="text-2xl font-bold text-white">Advanced Charts</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Chart Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-slate-300 mb-2 block">Select Symbol</Label>
                <Select value={symbol} onChange={(e) => handleSymbolChange(e.target.value)} className="bg-slate-900 border-slate-700 text-white">
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
                    placeholder="Enter ticker"
                    value={customSymbol}
                    onChange={(e) => setCustomSymbol(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCustomSymbolSubmit()}
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                  <Button onClick={handleCustomSymbolSubmit}>Go</Button>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-slate-300 mb-2 block">Technical Indicators</Label>
              <div className="flex flex-wrap gap-2">
                {["SMA20", "SMA50"].map((indicator) => (
                  <Button
                    key={indicator}
                    variant={indicators.includes(indicator) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleIndicator(indicator)}
                    className={
                      indicators.includes(indicator)
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "border-slate-600 text-slate-300"
                    }
                  >
                    {indicator}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="py-12 text-center text-slate-400">
              Loading chart data...
            </CardContent>
          </Card>
        ) : displayData.length > 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">{symbol} - Candlestick Chart</CardTitle>
              <CardDescription className="text-slate-400">90-day price action with technical indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-900/50">
                <ResponsiveContainer width="100%" height={500}>
                  <ComposedChart data={displayData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="formattedDate" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(value) => `$${value.toFixed(0)}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="high" shape={<Candlestick />} isAnimationActive={false} />
                    {indicators.includes("SMA20") && (
                      <Line type="monotone" dataKey="sma20" stroke="#3b82f6" strokeWidth={2} dot={false} name="SMA 20" />
                    )}
                    {indicators.includes("SMA50") && (
                      <Line type="monotone" dataKey="sma50" stroke="#f59e0b" strokeWidth={2} dot={false} name="SMA 50" />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
