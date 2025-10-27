import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { ArrowLeft, LineChart } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function GannChart() {
  const [pivotPrice, setPivotPrice] = useState("100");
  const [pivotDate, setPivotDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetDate, setTargetDate] = useState(() => {
    const future = new Date();
    future.setDate(future.getDate() + 90);
    return future.toISOString().split('T')[0];
  });

  const { data: gannData, isLoading } = trpc.gann.calculateGannAngles.useQuery({
    pivotPrice: parseFloat(pivotPrice) || 100,
    pivotDate,
    targetDate,
  });

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
          <LineChart className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-white">Gann Angles & Charts</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Configure Gann Angles</CardTitle>
            <CardDescription className="text-slate-400">
              Enter a pivot point (significant high or low) to calculate Gann angles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-slate-300 mb-2 block">Pivot Price</Label>
                <Input
                  type="number"
                  value={pivotPrice}
                  onChange={(e) => setPivotPrice(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300 mb-2 block">Pivot Date</Label>
                <Input
                  type="date"
                  value={pivotDate}
                  onChange={(e) => setPivotDate(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300 mb-2 block">Target Date</Label>
                <Input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="py-12 text-center text-slate-400">
              Calculating Gann angles...
            </CardContent>
          </Card>
        ) : gannData ? (
          <>
            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <CardHeader>
                <CardTitle className="text-white">Upward Angles (Support Levels)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {gannData.upwardAngles.map((angle) => {
                    const percentChange = ((angle.price - parseFloat(pivotPrice)) / parseFloat(pivotPrice)) * 100;
                    return (
                      <div key={angle.name} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                        <div className="flex-1">
                          <p className="text-white font-semibold">{angle.name}</p>
                          <p className="text-slate-400 text-sm">{angle.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold text-xl">${angle.price.toFixed(2)}</p>
                          <p className="text-green-400 text-sm">+{percentChange.toFixed(2)}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 mb-6">
              <CardHeader>
                <CardTitle className="text-white">Downward Angles (Resistance Levels)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {gannData.downwardAngles.map((angle) => {
                    const percentChange = ((angle.price - parseFloat(pivotPrice)) / parseFloat(pivotPrice)) * 100;
                    return (
                      <div key={angle.name} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                        <div className="flex-1">
                          <p className="text-white font-semibold">{angle.name}</p>
                          <p className="text-slate-400 text-sm">{angle.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold text-xl">${angle.price.toFixed(2)}</p>
                          <p className="text-red-400 text-sm">{percentChange.toFixed(2)}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  );
}
