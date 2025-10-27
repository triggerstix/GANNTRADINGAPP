
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Calculator,
  Clock,
  LineChart,
  Activity,
  Moon,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      title: "Market Data",
      description: "Real-time stock and crypto prices with historical charts",
      icon: TrendingUp,
      link: "/market-data",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Gann Angles & Charts",
      description: "Calculate Gann angles from pivot points for support/resistance",
      icon: LineChart,
      link: "/gann-chart",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Square of Nine",
      description: "Interactive Square of Nine calculator with key price levels",
      icon: Calculator,
      link: "/square-of-nine",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Time Cycles",
      description: "Analyze Gann time cycles and predict turning points",
      icon: Clock,
      link: "/time-cycles",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Advanced Charts",
      description: "Professional candlestick charts with technical indicators",
      icon: Activity,
      link: "/advanced-charts",
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur-lg opacity-50"></div>
              <div className="relative bg-slate-900 p-2 rounded-lg border border-slate-700">
                <LineChart className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                W.D. Gann Trading Platform
              </h1>
              <p className="text-slate-400 text-sm">
                Professional trading tools based on W.D. Gann's legendary methodologies
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Master the Markets with{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Gann Analysis
            </span>
          </h2>
          <p className="text-slate-300 text-lg">
            Access powerful tools for market analysis using W.D. Gann's time-tested methods.
            Calculate angles, cycles, and key price levels to identify high-probability trading opportunities.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.title} href={feature.link}>
                <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all cursor-pointer group h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                    <CardDescription className="text-slate-400">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="ghost"
                      className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    >
                      Open Tool →
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* About W.D. Gann */}
        <Card className="bg-slate-800/50 border-slate-700 mb-12">
          <CardHeader>
            <CardTitle className="text-white">About W.D. Gann</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-4">
            <p>
              <strong className="text-white">William Delbert Gann (1878-1955)</strong> was one of
              the most successful traders of all time. He developed unique methods for analyzing
              and predicting market movements using geometry, astronomy, and ancient mathematics.
            </p>
            <p>
              His techniques include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong className="text-white">Gann Angles:</strong> Geometric lines that show
                support and resistance at specific angles (45°, 63.75°, etc.)
              </li>
              <li>
                <strong className="text-white">Square of Nine:</strong> A mathematical tool based
                on the spiral of numbers, revealing key price levels
              </li>
              <li>
                <strong className="text-white">Time Cycles:</strong> Recurring patterns in time
                that signal potential market turning points
              </li>
              <li>
                <strong className="text-white">Price and Time Balance:</strong> The concept that
                markets move in harmony between price and time
              </li>
            </ul>
            <p>
              This platform brings Gann's powerful methods into the modern age, combining them
              with real-time market data and interactive visualizations.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm">
          <p>Built with React, TypeScript, and tRPC</p>
          <p className="mt-2">
            © 2025 W.D. Gann Trading Platform. For educational purposes only.
          </p>
        </div>
      </section>
    </div>
  );
}
