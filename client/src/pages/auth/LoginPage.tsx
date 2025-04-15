import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

// ログインフォームのスキーマ
const loginFormSchema = z.object({
  username: z.string().min(1, { message: "ユーザー名を入力してください" }),
  password: z.string().min(1, { message: "パスワードを入力してください" }),
});

// 二段階認証のスキーマ
const verificationSchema = z.object({
  verificationCode: z.string().min(6, { message: "6桁の認証コードを入力してください" }).max(6),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;
type VerificationFormValues = z.infer<typeof verificationSchema>;

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { 
    isAuthenticated, 
    isVerifyingLogin,
    pendingUsername,
    login, 
    verifyLogin,
    resetAuthState
  } = useAuth();

  // 認証済みの場合はホームページにリダイレクト
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  // ページを離れる際に認証状態をリセット
  useEffect(() => {
    return () => {
      if (isVerifyingLogin) {
        resetAuthState();
      }
    };
  }, [isVerifyingLogin, resetAuthState]);

  // ログインフォーム
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 二段階認証フォーム
  const verificationForm = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  // ログイン処理（第1段階）
  const onLoginSubmit = async (values: LoginFormValues) => {
    await login(values);
  };

  // 二段階認証処理
  const onVerificationSubmit = async (values: VerificationFormValues) => {
    if (!pendingUsername) return;
    
    await verifyLogin({
      username: pendingUsername,
      verificationCode: values.verificationCode,
    });
  };

  // ローディング状態
  if (loginForm.formState.isSubmitting || verificationForm.formState.isSubmitting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6">
        {!isVerifyingLogin ? (
          // ログインフォーム
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">ログイン</CardTitle>
              <CardDescription>
                アカウント情報を入力してください
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ユーザー名</FormLabel>
                        <FormControl>
                          <Input placeholder="ユーザー名を入力" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>パスワード</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="パスワードを入力" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loginForm.formState.isSubmitting}
                  >
                    {loginForm.formState.isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    ログイン
                  </Button>
                </form>
              </Form>
              <div className="mt-4 text-center text-sm">
                <Link href="/auth/signup">
                  <span className="text-primary hover:underline cursor-pointer">
                    アカウントをお持ちでない方はこちら
                  </span>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          // 二段階認証フォーム
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">認証コードを入力</CardTitle>
              <CardDescription>
                メールで送信された6桁のコードを入力してください
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...verificationForm}>
                <form onSubmit={verificationForm.handleSubmit(onVerificationSubmit)} className="space-y-4">
                  <FormField
                    control={verificationForm.control}
                    name="verificationCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>認証コード</FormLabel>
                        <FormControl>
                          <Input placeholder="6桁のコードを入力" maxLength={6} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={verificationForm.formState.isSubmitting}
                  >
                    {verificationForm.formState.isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    認証する
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={resetAuthState}
                  >
                    戻る
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}