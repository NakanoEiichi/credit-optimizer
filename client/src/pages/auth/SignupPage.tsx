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

// サインアップフォームのスキーマ
const signupFormSchema = z.object({
  username: z.string().min(3, { message: "ユーザー名は3文字以上で入力してください" }),
  email: z.string().email({ message: "有効なメールアドレスを入力してください" }),
  password: z.string().min(8, { message: "パスワードは8文字以上で入力してください" }),
  confirmPassword: z.string().min(1, { message: "パスワード（確認）を入力してください" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "パスワードが一致しません",
  path: ["confirmPassword"],
});

// 二段階認証のスキーマ
const verificationSchema = z.object({
  verificationCode: z.string().min(6, { message: "6桁の認証コードを入力してください" }).max(6),
});

type SignupFormValues = z.infer<typeof signupFormSchema>;
type VerificationFormValues = z.infer<typeof verificationSchema>;

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const { toast } = useToast();

  // サインアップフォーム
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 認証コードフォーム
  const verificationForm = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  // サインアップ処理
  const onSignupSubmit = async (values: SignupFormValues) => {
    try {
      // 実際にはAPIリクエストでユーザー登録します
      console.log("Signing up with:", values);
      
      // 登録成功の場合、認証コード確認ステップへ移動
      toast({
        title: "認証コードをメールで送信しました",
        description: `${values.email}に6桁の認証コードを送信しました。確認してください。`,
      });
      
      setIsVerificationStep(true);
    } catch (error) {
      toast({
        title: "登録に失敗しました",
        description: "ユーザー名またはメールアドレスが既に使用されています",
        variant: "destructive",
      });
    }
  };

  // 認証コード確認処理
  const onVerificationSubmit = async (values: VerificationFormValues) => {
    try {
      // 実際にはAPIリクエストで認証コードを検証します
      console.log("Verifying code:", values);
      
      // 検証成功の場合、ログインページへリダイレクト
      toast({
        title: "登録完了",
        description: "アカウントの登録が完了しました。ログインしてください。",
      });
      
      // ログインページへ移動
      setLocation("/auth/login");
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
        {!isVerificationStep ? (
          // サインアップフォーム
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">アカウント登録</CardTitle>
              <CardDescription>
                必要な情報を入力してアカウントを作成してください
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                  <FormField
                    control={signupForm.control}
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
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>メールアドレス</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="メールアドレスを入力" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
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
                  <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>パスワード（確認）</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="同じパスワードを再入力" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">登録する</Button>
                </form>
              </Form>
              <div className="mt-4 text-center text-sm">
                <a href="/auth/login" className="text-primary hover:underline">
                  すでにアカウントをお持ちの方はこちら
                </a>
              </div>
            </CardContent>
          </Card>
        ) : (
          // 認証コードフォーム
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
                  <Button type="submit" className="w-full">認証する</Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsVerificationStep(false)}
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