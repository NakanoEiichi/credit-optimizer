import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Wallet from "@/pages/Wallet";
import Withdrawal from "@/pages/Withdrawal";
import Navbar from "@/components/layout/Navbar";

function Router() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-neutral-800">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/shop" component={Shop} />
            <Route path="/wallet" component={Wallet} />
            <Route path="/withdrawal" component={Withdrawal} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
