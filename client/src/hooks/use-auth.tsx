import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

// 認証情報の型
interface User {
  id: number;
  username: string;
  email: string;
}

// ログイン・登録データの型
interface LoginCredentials {
  username: string;
  password: string;
}

interface VerifyLoginCredentials {
  username: string;
  verificationCode: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

interface VerifyRegisterCredentials {
  username: string;
  email: string;
  password: string;
  verificationCode: string;
}

// 認証コンテキストの型
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isVerifyingLogin: boolean;
  isVerifyingRegister: boolean;
  pendingUsername: string | null;
  pendingEmail: string | null;
  pendingPassword: string | null;
  
  // ログイン関連
  login: (credentials: LoginCredentials) => Promise<void>;
  verifyLogin: (credentials: VerifyLoginCredentials) => Promise<void>;
  
  // 登録関連
  sendVerification: (credentials: RegisterCredentials) => Promise<void>;
  register: (credentials: VerifyRegisterCredentials) => Promise<void>;
  
  // ログアウト
  logout: () => void;
  
  // 状態リセット
  resetAuthState: () => void;
}

// 認証コンテキストの作成
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 認証プロバイダーコンポーネント
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isVerifyingLogin, setIsVerifyingLogin] = useState(false);
  const [isVerifyingRegister, setIsVerifyingRegister] = useState(false);
  const [pendingUsername, setPendingUsername] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingPassword, setPendingPassword] = useState<string | null>(null);
  
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
  
  // ログイン処理（第1段階）
  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      const data = await response.json();
      
      if (data.success) {
        setPendingUsername(credentials.username);
        setPendingPassword(credentials.password);
        setIsVerifyingLogin(true);
        
        toast({
          title: "認証コードの入力",
          description: "メールに送信された認証コードを入力してください",
        });
      } else {
        throw new Error(data.error || "ログインに失敗しました");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "ログイン失敗",
        description: error instanceof Error ? error.message : "ログイン処理中にエラーが発生しました",
        variant: "destructive",
      });
    }
  };
  
  // ログイン処理（第2段階: 認証コード検証）
  const verifyLogin = async (credentials: VerifyLoginCredentials) => {
    try {
      const response = await apiRequest("POST", "/api/auth/verify-login", credentials);
      const data = await response.json();
      
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // 認証状態をリセット
        setIsVerifyingLogin(false);
        setPendingUsername(null);
        setPendingPassword(null);
        
        toast({
          title: "ログイン成功",
          description: "ようこそ、" + data.user.username + "さん",
        });
        
        // ホームページにリダイレクト
        setLocation("/");
      } else {
        throw new Error(data.error || "認証に失敗しました");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "認証失敗",
        description: error instanceof Error ? error.message : "認証処理中にエラーが発生しました",
        variant: "destructive",
      });
    }
  };
  
  // 登録処理（第1段階: 認証コード送信）
  const sendVerification = async (credentials: RegisterCredentials) => {
    try {
      const response = await apiRequest("POST", "/api/auth/send-verification", {
        username: credentials.username,
        email: credentials.email,
      });
      const data = await response.json();
      
      if (data.success) {
        setPendingUsername(credentials.username);
        setPendingEmail(credentials.email);
        setPendingPassword(credentials.password);
        setIsVerifyingRegister(true);
        
        toast({
          title: "認証コードの入力",
          description: `${credentials.email}に送信された認証コードを入力してください`,
        });
      } else {
        throw new Error(data.error || "認証コードの送信に失敗しました");
      }
    } catch (error) {
      console.error("Send verification error:", error);
      toast({
        title: "認証コード送信失敗",
        description: error instanceof Error ? error.message : "認証コード送信中にエラーが発生しました",
        variant: "destructive",
      });
    }
  };
  
  // 登録処理（第2段階: ユーザー登録）
  const register = async (credentials: VerifyRegisterCredentials) => {
    try {
      const response = await apiRequest("POST", "/api/auth/register", credentials);
      const data = await response.json();
      
      if (data.success && data.user) {
        // 認証状態をリセット
        setIsVerifyingRegister(false);
        setPendingUsername(null);
        setPendingEmail(null);
        setPendingPassword(null);
        
        toast({
          title: "登録成功",
          description: "アカウントが正常に作成されました。ログインしてください。",
        });
        
        // ログインページにリダイレクト
        setLocation("/auth/login");
      } else {
        throw new Error(data.error || "登録に失敗しました");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "登録失敗",
        description: error instanceof Error ? error.message : "登録処理中にエラーが発生しました",
        variant: "destructive",
      });
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
  
  // 認証状態のリセット
  const resetAuthState = () => {
    setIsVerifyingLogin(false);
    setIsVerifyingRegister(false);
    setPendingUsername(null);
    setPendingEmail(null);
    setPendingPassword(null);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: false,
        isAuthenticated: !!user,
        isVerifyingLogin,
        isVerifyingRegister,
        pendingUsername,
        pendingEmail,
        pendingPassword,
        login,
        verifyLogin,
        sendVerification,
        register,
        logout,
        resetAuthState,
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