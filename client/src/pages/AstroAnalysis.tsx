import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Moon } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AstroAnalysis() {
  const [analysisDate, setAnalysisDate] = useState(new Date().toISOString().split('T')[0]);

  const astroDataQuery = trpc.gann.getAstrologicalData.useQuery({ date: analysisDate });

  const getMoonEmoji = (phase?: string) => {
    if (!phase) return "🌑";
    const phases: { [key: string]: string } = {
      "New Moon": "🌑",
      "Waxing Crescent": "🌒",
      "First Quarter": "🌓",
      "Waxing Gibbous": "🌔",
      "Full Moon": "🌕",
      "Waning Gibbous": "🌖",
      "Last Quarter": "🌗",
      "Waning Crescent": "🌘",
    };
    return phases[phase] || "🌑";
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
          <Moon className="h-6 w-6 text-indigo-500" />
          <h1 className="text-2xl font-bold text-white">Astrological Analysis</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Select Analysis Date</CardTitle>
            <CardDescription className="text-slate-400">
              Choose a date to analyze lunar phases and planetary positions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md flex gap-2">
              <div className="flex-1">
                <Label className="text-slate-300 mb-2 block">Date</Label>
                <Input
                  type="date"
                  value={analysisDate}
                  onChange={(e) => setAnalysisDate(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => astroDataQuery.refetch()}
                  className="bg-indigo-600"
                >
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {astroDataQuery.isLoading ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-8 text-center text-slate-400">
              Loading astrological data...
            </CardContent>
          </Card>
        ) : astroDataQuery.error ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-8 text-center text-red-400">
              Error loading data: {astroDataQuery.error.message}
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <CardHeader>
                <CardTitle className="text-white">Lunar Phase</CardTitle>
                <CardDescription className="text-slate-400">
                  Current moon phase and market implications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="text-6xl">{getMoonEmoji(astroDataQuery.data?.lunarPhase?.phase)}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {astroDataQuery.data?.lunarPhase?.phase || "Unknown"}
                    </h3>
                    <p className="text-slate-300 text-lg mb-2">
                      Illumination: {astroDataQuery.data?.lunarPhase?.illumination?.toFixed(1) || "0"}%
                    </p>
                    <p className="text-slate-400">
                      {astroDataQuery.data?.lunarPhase?.interpretation || "No interpretation available"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {astroDataQuery.data?.planetaryPositions && (
              <Card className="bg-slate-800/50 border-slate-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-white">Planetary Positions</CardTitle>
                  <CardDescription className="text-slate-400">
                    Current zodiac placements of major planets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {astroDataQuery.data.planetaryPositions.map((planet: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700"
                      >
                        <div>
                          <div className="text-white font-semibold">{planet.name}</div>
                          <div className="text-slate-400 text-sm">{planet.sign}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white">{planet.degree?.toFixed(1) || "0"}°</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">About Astrological Market Analysis</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-3">
            <p>
              W.D. Gann believed that planetary movements and lunar cycles had a significant impact on market behavior.
              He used astrological data to time market entries and exits.
            </p>
            <p><strong className="text-white">Key astrological factors:</strong></p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong className="text-white">Lunar Phases:</strong> New and Full Moons often mark turning points</li>
              <li><strong className="text-white">Planetary Positions:</strong> Planet locations in the zodiac affect market energy</li>
              <li><strong className="text-white">Aspects:</strong> Angular relationships between planets create market pressure</li>
              <li><strong className="text-white">Retrogrades:</strong> Backward planetary motion can signal reversals</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
