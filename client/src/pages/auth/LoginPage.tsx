import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// ログインフォームのスキーマ
const loginFormSchema = z.object({
  username: z.string().min(1, { message: "ユーザー名を入力してください" }),
  password: z.string().min(1, { message: "パスワードを入力してください" }),
});

// 二段階認証のスキーマ
const twoFactorSchema = z.object({
  verificationCode: z.string().min(6, { message: "6桁の認証コードを入力してください" }).max(6),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;
type TwoFactorFormValues = z.infer<typeof twoFactorSchema>;

export default function LoginPage() {
  const [location, setLocation] = useState<string>();
  const [isTwoFactorStep, setIsTwoFactorStep] = useState(false);
  const { toast } = useToast();

  // ログインフォーム
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 二段階認証フォーム
  const twoFactorForm = useForm<TwoFactorFormValues>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  // ログイン処理
  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      // 実際にはAPIリクエストで認証します
      // ダミーの認証処理を実装
      console.log("Logging in with:", values);
      
      // 認証成功の場合、二段階認証ステップへ移動
      toast({
        title: "認証コードをメールで送信しました",
        description: "メールに記載された6桁のコードを入力してください",
      });
      
      setIsTwoFactorStep(true);
    } catch (error) {
      toast({
        title: "ログインに失敗しました",
        description: "ユーザー名またはパスワードが間違っています",
        variant: "destructive",
      });
    }
  };

  // 二段階認証処理
  const onTwoFactorSubmit = async (values: TwoFactorFormValues) => {
    try {
      // 実際にはAPIリクエストで認証コードを検証します
      console.log("Verifying code:", values);
      
      // 認証成功の場合、ダッシュボードへリダイレクト
      toast({
        title: "認証成功",
        description: "ログインに成功しました",
      });
      
      // ダッシュボードへ移動
      window.location.href = "/";
    } catch (error) {
      toast({
        title: "認証に失敗しました",
        description: "認証コードが間違っています",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6">
        {!isTwoFactorStep ? (
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
                  <Button type="submit" className="w-full">ログイン</Button>
                </form>
              </Form>
              <div className="mt-4 text-center text-sm">
                <a href="/auth/signup" className="text-primary hover:underline">
                  アカウントをお持ちでない方はこちら
                </a>
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
              <Form {...twoFactorForm}>
                <form onSubmit={twoFactorForm.handleSubmit(onTwoFactorSubmit)} className="space-y-4">
                  <FormField
                    control={twoFactorForm.control}
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
                  <Button type="submit" className="w-full">認証する</Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsTwoFactorStep(false)}
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