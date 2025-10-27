
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { Router, Route } from "wouter";
import { trpc } from "./lib/trpc";
import superjson from "superjson";

// Pages
import Home from "./pages/Home";
import MarketData from "./pages/MarketData";
import GannChart from "./pages/GannChart";
import SquareOfNinePage from "./pages/SquareOfNinePage";
import TimeCyclesPage from "./pages/TimeCyclesPage";
import AdvancedCharts from "./pages/AdvancedCharts";

function App() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Route path="/" component={Home} />
          <Route path="/market-data" component={MarketData} />
          <Route path="/gann-chart" component={GannChart} />
          <Route path="/square-of-nine" component={SquareOfNinePage} />
          <Route path="/time-cycles" component={TimeCyclesPage} />
          <Route path="/advanced-charts" component={AdvancedCharts} />
        </Router>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
