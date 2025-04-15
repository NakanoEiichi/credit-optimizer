import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Wallet from "@/pages/Wallet";
import Withdrawal from "@/pages/Withdrawal";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import Navbar from "@/components/layout/Navbar";
import { useState, useEffect } from "react";

function AuthWrapper({ children }: { children: React.ReactNode }) {
  // 実際のアプリでは、ここでログイン状態を確認する
  // 仮のログイン状態チェック
  const [isLoggedIn, setIsLoggedIn] = useState(true); // デモ用にtrueにしておく
  const [, setLocation] = useLocation();

  // ログイン状態の確認
  useEffect(() => {
    // APIリクエストでログイン状態を確認するコードをここに実装
    // 今回はデモのためスキップ
  }, []);

  // ログインが必要なページ向けの処理
  // 実際のアプリではログイン状態に応じてリダイレクトするロジックを実装
  
  return <>{children}</>;
}

function Router() {
  const [location] = useLocation();
  const isAuthRoute = location.startsWith("/auth");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-neutral-800">
      {!isAuthRoute && <Navbar />}
      <main className={`flex-1 ${!isAuthRoute ? "pt-16" : ""}`}>
        <div className={`mx-auto ${!isAuthRoute ? "max-w-7xl py-6 sm:px-6 lg:px-8" : ""}`}>
          <AuthWrapper>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/shop" component={Shop} />
              <Route path="/wallet" component={Wallet} />
              <Route path="/withdrawal" component={Withdrawal} />
              <Route path="/auth/login" component={LoginPage} />
              <Route path="/auth/signup" component={SignupPage} />
              <Route component={NotFound} />
            </Switch>
          </AuthWrapper>
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
