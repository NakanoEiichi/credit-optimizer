import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

// 認証情報の型
interface User {
  id: number;
  username: string;
}

// ログイン・登録データの型
interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  password: string;
}

// 認証コンテキストの型
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // ログイン関連
  login: (credentials: LoginCredentials) => Promise<void>;
  
  // 登録関連
  register: (credentials: RegisterCredentials) => Promise<void>;
  
  // ログアウト
  logout: () => void;
}

// 認証コンテキストの作成
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 認証プロバイダーコンポーネント
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  
  // ローカルストレージからユーザー情報を取得
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  // 簡易ログイン処理（ID/パスワードのみ）
  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      
      // ユーザーIDを1、名前を入力したusernameに設定
      const mockUser: User = {
        id: 1,
        username: credentials.username
      };
      
      // ユーザー情報をセットしてローカルストレージに保存
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast({
        title: "ログイン成功",
        description: "ようこそ、" + mockUser.username + "さん",
      });
      
      // ホームページにリダイレクト
      setLocation("/");
      
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "ログイン失敗",
        description: "ログイン処理中にエラーが発生しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 簡易登録処理（ID/パスワードのみ）
  const register = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true);
      
      // 登録成功とみなし、自動的にログインした状態にする
      const mockUser: User = {
        id: 1,
        username: credentials.username
      };
      
      // ユーザー情報をセットしてローカルストレージに保存
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast({
        title: "登録&ログイン成功",
        description: "アカウントが作成され、自動的にログインしました",
      });
      
      // ホームページにリダイレクト
      setLocation("/");
      
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "登録失敗",
        description: "登録処理中にエラーが発生しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // ログアウト処理
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    queryClient.clear();
    
    toast({
      title: "ログアウト",
      description: "ログアウトしました",
    });
    
    // ログインページにリダイレクト
    setLocation("/auth/login");
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 認証フックの作成
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}