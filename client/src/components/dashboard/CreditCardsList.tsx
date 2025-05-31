import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { CreditCard } from "@shared/schema";

const formSchema = z.object({
  cardType: z.string().min(1, { message: "カードタイプは必須です" }),
  lastFour: z.string().length(4, { message: "カード番号下4桁は4文字である必要があります" }).regex(/^\d{4}$/, { message: "数字のみを入力してください" }),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, { message: "有効期限はMM/YY形式で入力してください" }),
  baseRewardRate: z.string().min(1, { message: "基本還元率は必須です" }).transform(val => parseFloat(val)),
  nickname: z.string().optional(),
});

const CreditCardItem = ({ card }: { card: CreditCard }) => {
  let cardIcon = "fa-credit-card";
  let cardBgColor = "bg-gray-100";
  let cardTextColor = "text-neutral-600";
  
  if (card.cardType.toLowerCase().includes("visa")) {
    cardIcon = "fa-cc-visa";
    cardTextColor = "text-blue-700";
  } else if (card.cardType.toLowerCase().includes("mastercard")) {
    cardIcon = "fa-cc-mastercard";
    cardTextColor = "text-red-500";
  } else if (card.cardType.toLowerCase().includes("amex")) {
    cardIcon = "fa-cc-amex";
    cardTextColor = "text-blue-500";
  }

  return (
    <div className="px-4 py-4 sm:px-6 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-16 bg-gray-100 rounded flex items-center justify-center">
            <i className={`fas ${cardIcon} text-xl ${cardTextColor}`}></i>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-neutral-900">
              {card.cardType} **** {card.lastFour}
            </div>
            <div className="text-xs text-neutral-500">有効期限: {card.expiryDate}</div>
          </div>
        </div>
        <div className="text-sm text-right">
          <div className="font-medium text-secondary-600">基本還元率</div>
          <div className="text-neutral-900 font-bold">{card.baseRewardRate.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
};

const CreditCardsList = () => {
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardType: "",
      lastFour: "",
      expiryDate: "",
      baseRewardRate: "",
      nickname: "",
    },
  });

  const { data: cards, isLoading } = useQuery<CreditCard[]>({
    queryKey: ['/api/credit-cards'],
  });

  const addCardMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      return apiRequest("POST", "/api/credit-cards", {
        ...values,
        baseRewardRate: parseFloat(values.baseRewardRate as unknown as string)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/credit-cards'] });
      toast({
        title: "クレジットカードが追加されました",
        description: "新しいカードが正常に追加されました。",
      });
      setIsAddCardOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addCardMutation.mutate(values);
  };

  return (
    <>
      <Card className="shadow">
        <CardHeader className="px-4 py-5 sm:px-6 flex flex-row justify-between items-center">
          <h2 className="text-lg font-medium text-neutral-900">あなたのクレジットカード</h2>
          <Button 
            size="sm" 
            className="text-xs rounded-full"
            onClick={() => setIsAddCardOpen(true)}
          >
            <i className="fas fa-plus mr-1"></i> カードを追加
          </Button>
        </CardHeader>
        <CardContent className="p-0 border-t border-gray-200">
          {isLoading ? (
            <div className="animate-pulse p-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded mb-4 last:mb-0"></div>
              ))}
            </div>
          ) : cards && cards.length > 0 ? (
            cards.map((card) => (
              <CreditCardItem key={card.id} card={card} />
            ))
          ) : (
            <div className="p-4 text-center text-neutral-500">
              まだクレジットカードがありません。「カードを追加」ボタンからカードを追加してください。
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>クレジットカードを追加</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="cardType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>カードタイプ</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="カードタイプを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="VISA">VISA</SelectItem>
                        <SelectItem value="MasterCard">MasterCard</SelectItem>
                        <SelectItem value="Amex">American Express</SelectItem>
                        <SelectItem value="JCB">JCB</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastFour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>カード番号下4桁</FormLabel>
                    <FormControl>
                      <Input placeholder="1234" {...field} maxLength={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>有効期限 (MM/YY)</FormLabel>
                    <FormControl>
                      <Input placeholder="01/25" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="baseRewardRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>基本還元率 (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" min="0" max="10" placeholder="1.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ニックネーム (任意)</FormLabel>
                    <FormControl>
                      <Input placeholder="メインカード" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddCardOpen(false)}
                >
                  キャンセル
                </Button>
                <Button type="submit" disabled={addCardMutation.isPending}>
                  {addCardMutation.isPending ? "追加中..." : "追加する"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreditCardsList;
