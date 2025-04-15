import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Wallet from "@/pages/Wallet";
import Withdrawal from "@/pages/Withdrawal";
import Extension from "@/pages/Extension";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import Navbar from "@/components/layout/Navbar";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/hooks/use-auth";

// 認証が必要なルートを保護するためのコンポーネント
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // 認証されていない場合はログインページへリダイレクト
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/auth/login");
    }
  }, [isAuthenticated, setLocation]);

  // 認証されている場合のみ表示
  return isAuthenticated ? <>{children}</> : null;
}

function Router() {
  const [location] = useLocation();
  const isAuthRoute = location.startsWith("/auth");
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-neutral-800">
      {!isAuthRoute && <Navbar />}
      <main className={`flex-1 ${!isAuthRoute ? "pt-16" : ""}`}>
        <div className={`mx-auto ${!isAuthRoute ? "max-w-7xl py-6 sm:px-6 lg:px-8" : ""}`}>
          <Switch>
            <Route path="/auth/login" component={LoginPage} />
            <Route path="/auth/signup" component={SignupPage} />
            <Route path="/">
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            </Route>
            <Route path="/shop">
              <ProtectedRoute>
                <Shop />
              </ProtectedRoute>
            </Route>
            <Route path="/wallet">
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            </Route>
            <Route path="/withdrawal">
              <ProtectedRoute>
                <Withdrawal />
              </ProtectedRoute>
            </Route>
            <Route path="/extension">
              <ProtectedRoute>
                <Extension />
              </ProtectedRoute>
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
