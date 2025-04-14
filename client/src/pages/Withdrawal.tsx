import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

interface BalanceData {
  availableBalance: number;
  pendingBalance: number;
  transactions: WithdrawalTransaction[];
}

interface WithdrawalTransaction {
  id: number;
  date: string;
  amount: number;
  status: "completed" | "pending";
  description: string;
}

// 受取方法タイプ
type PaymentMethod = "bankTransfer" | "amazonGift" | "paypay";

// Zodスキーマの定義
const withdrawFormSchema = z.object({
  amount: z.string()
    .min(1, { message: "金額は必須です" })
    .refine(val => !isNaN(parseFloat(val)), { message: "数値を入力してください" })
    .refine(val => parseFloat(val) > 0, { message: "0より大きい金額を入力してください" }),
  paymentMethod: z.enum(["bankTransfer", "amazonGift", "paypay"], {
    required_error: "受取方法を選択してください",
  }),
  // 銀行振込に必要な項目
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  // Amazon Giftに必要な項目
  email: z.string().email({ message: "有効なメールアドレスを入力してください" }).optional(),
  // PayPayは外部URLに遷移するため、追加項目なし
})
.refine(
  (data) => {
    if (data.paymentMethod === "bankTransfer") {
      return !!data.bankName && !!data.accountNumber;
    }
    return true;
  },
  {
    message: "銀行名と口座番号は必須です",
    path: ["bankName"],
  }
)
.refine(
  (data) => {
    if (data.paymentMethod === "amazonGift") {
      return !!data.email;
    }
    return true;
  },
  {
    message: "メールアドレスは必須です",
    path: ["email"],
  }
);

const Withdrawal = () => {
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof withdrawFormSchema>>({
    resolver: zodResolver(withdrawFormSchema),
    defaultValues: {
      amount: "",
      paymentMethod: "bankTransfer",
      bankName: "",
      accountNumber: "",
      email: "",
    },
  });
  
  // 選択された支払い方法を監視
  const watchPaymentMethod = form.watch("paymentMethod") as PaymentMethod;
  
  const { data: balanceData, isLoading } = useQuery<BalanceData>({
    queryKey: ['/api/wallet/balance'],
  });
  
  const onSubmit = (values: z.infer<typeof withdrawFormSchema>) => {
    // 受取方法によって処理を分岐
    if (values.paymentMethod === "paypay") {
      // PayPayの場合は外部URLに遷移する
      window.open("https://paypay.ne.jp/", "_blank");
    }
    
    // 通知メッセージの表示
    const methodText = {
      bankTransfer: "銀行振込",
      amazonGift: "Amazon Giftカード",
      paypay: "PayPay"
    }[values.paymentMethod];
    
    toast({
      title: "引き出しリクエストが送信されました",
      description: `${parseFloat(values.amount).toLocaleString()}円の${methodText}への引き出しリクエストを受け付けました。`,
    });
    
    setIsWithdrawDialogOpen(false);
    form.reset();
  };
  
  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 font-heading">出金</h1>
          <p className="mt-1 text-sm text-neutral-500">ポイントの引き出しや履歴の確認ができます</p>
        </div>
        <div className="animate-pulse space-y-6">
          <Card>
            <CardContent className="h-40"></CardContent>
          </Card>
          <Card>
            <CardContent className="h-40"></CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  const balanceInfo = balanceData || {
    availableBalance: 12500,
    pendingBalance: 3800,
    transactions: [
      {
        id: 1,
        date: "2023-11-15T10:00:00Z",
        amount: 5000,
        status: "completed",
        description: "ポイント引き出し"
      },
      {
        id: 2,
        date: "2023-11-01T14:30:00Z",
        amount: 3000,
        status: "completed",
        description: "ポイント引き出し"
      }
    ] as WithdrawalTransaction[]
  };
  
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 font-heading">出金</h1>
        <p className="mt-1 text-sm text-neutral-500">ポイントの引き出しや履歴の確認ができます</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Available Balance */}
        <Card className="shadow">
          <CardHeader className="px-6 py-5">
            <h2 className="text-lg font-medium text-neutral-900">引出し可能な残高</h2>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            <div className="mb-4">
              <div className="text-3xl font-bold text-neutral-900">
                ¥{balanceInfo.availableBalance.toLocaleString()}
              </div>
              <div className="mt-1 text-sm text-neutral-500">
                ご希望の金額を受取手段を選択して引き出しできます
              </div>
            </div>
            
            <Button 
              className="w-full sm:w-auto"
              onClick={() => setIsWithdrawDialogOpen(true)}
            >
              残高を引き出す
            </Button>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-neutral-900 mb-3">最近の引き出し履歴</h3>
              <div className="space-y-3">
                {balanceInfo.transactions.map(transaction => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <div className="text-sm font-medium">{transaction.description}</div>
                      <div className="text-xs text-neutral-500">
                        {format(new Date(transaction.date), "yyyy/MM/dd HH:mm")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">¥{transaction.amount.toLocaleString()}</div>
                      <div className={`text-xs ${transaction.status === "completed" ? "text-green-600" : "text-amber-600"}`}>
                        {transaction.status === "completed" ? "完了" : "処理中"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Pending Balance */}
        <Card className="shadow">
          <CardHeader className="px-6 py-5">
            <h2 className="text-lg font-medium text-neutral-900">獲得予定残高</h2>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            <div className="mb-6">
              <div className="text-3xl font-bold text-neutral-900">
                ¥{balanceInfo.pendingBalance.toLocaleString()}
              </div>
              <div className="mt-1 text-sm text-neutral-500">
                承認待ちの取引が確定するとご利用いただけます
              </div>
            </div>
            
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-start">
                <i className="fas fa-info-circle text-amber-500 mt-0.5 mr-3"></i>
                <div>
                  <h4 className="text-sm font-medium text-neutral-900">承認待ちの残高について</h4>
                  <p className="mt-1 text-xs text-neutral-600">
                    取引の承認には通常1〜5営業日かかります。確定後、引き出し可能な残高に反映されます。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Withdrawal Dialog */}
      <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>残高を引き出す</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 金額入力 */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>引き出し金額</FormLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">¥</span>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="0"
                          className="pl-7"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* 受取方法の選択 */}
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>受取方法</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="bankTransfer" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            <div className="flex items-center">
                              <i className="fas fa-university mr-2"></i>
                              銀行振込
                            </div>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="amazonGift" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            <div className="flex items-center">
                              <i className="fab fa-amazon mr-2"></i>
                              Amazon Giftカード
                            </div>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="paypay" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            <div className="flex items-center">
                              <i className="fas fa-mobile-alt mr-2"></i>
                              PayPay
                            </div>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* 銀行振込用フィールド */}
              {watchPaymentMethod === "bankTransfer" && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>銀行名</FormLabel>
                        <FormControl>
                          <Input placeholder="〇〇銀行" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>口座番号</FormLabel>
                        <FormControl>
                          <Input placeholder="1234567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              {/* Amazon Gift用フィールド */}
              {watchPaymentMethod === "amazonGift" && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>メールアドレス</FormLabel>
                      <FormDescription>
                        Amazonギフトカードのコードを送信します
                      </FormDescription>
                      <FormControl>
                        <Input type="email" placeholder="your-email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {/* PayPay用説明 */}
              {watchPaymentMethod === "paypay" && (
                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <i className="fas fa-info-circle text-blue-500"></i>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        送信後にPayPayアプリが起動します。アプリ内での操作で引き出しが完了します。
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsWithdrawDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button type="submit">
                  引き出しを確定
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Withdrawal;
