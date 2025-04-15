import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ExtensionPopup, { RecommendationDetails } from "@/components/extension/ExtensionPopup";

// 拡張機能のシミュレーションページ
// これは実際の拡張機能がどのように機能するかをデモするためのものです
export default function Extension() {
  const [url, setUrl] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationDetails | null>(null);
  const { toast } = useToast();

  // URLからマーチャント名を抽出する簡易関数
  const extractMerchantFromUrl = (url: string): string => {
    try {
      const hostname = new URL(url).hostname;
      const parts = hostname.split('.');
      // www.amazon.co.jp → amazon
      const merchant = parts.length > 1 ? parts[parts.length - 2] : parts[0];
      return merchant.charAt(0).toUpperCase() + merchant.slice(1);
    } catch (error) {
      return "Unknown";
    }
  };

  // 仮想的なレコメンデーションデータを生成
  const generateRecommendation = (url: string, amount: string): RecommendationDetails => {
    const amountValue = parseFloat(amount) || 5000;
    const merchantName = extractMerchantFromUrl(url);
    
    // 最適なカードのポイント還元率（ここでは単純にマーチャント名の長さに応じて変化）
    const optimalRate = 0.02 + (merchantName.length % 5) * 0.005;
    
    // 他のカードの還元率（最適なカードよりも低い）
    const otherRates = [
      optimalRate - 0.005,
      optimalRate - 0.01,
      optimalRate - 0.015
    ].filter(rate => rate > 0);
    
    return {
      merchantName,
      purchaseAmount: amountValue,
      optimalCard: {
        id: 1,
        name: "楽天カード",
        type: "Visa",
        lastFour: "4242",
        rewardRate: optimalRate,
        estimatedPoints: Math.round(amountValue * optimalRate)
      },
      otherCards: [
        {
          id: 2,
          name: "Amazonカード",
          type: "Mastercard",
          lastFour: "8765",
          rewardRate: otherRates[0] || 0.01,
          estimatedPoints: Math.round(amountValue * (otherRates[0] || 0.01))
        },
        {
          id: 3,
          name: "JALカード",
          type: "JCB",
          lastFour: "3456",
          rewardRate: otherRates[1] || 0.008,
          estimatedPoints: Math.round(amountValue * (otherRates[1] || 0.008))
        }
      ]
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "URLを入力してください",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // 実際の実装ではAPIリクエストになりますが、ここではシミュレーション
    setTimeout(() => {
      try {
        const recommendationData = generateRecommendation(url, amount);
        setRecommendation(recommendationData);
        setIsLoading(false);
      } catch (error) {
        toast({
          title: "エラーが発生しました",
          description: "レコメンデーションの取得に失敗しました",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleClose = () => {
    setRecommendation(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">ブラウザ拡張機能シミュレーター</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>オンラインショッピングのシミュレーション</CardTitle>
            <CardDescription>
              実際のショッピングサイトをシミュレートします。URLと購入金額を入力してください。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium mb-1">ショッピングサイトURL</label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.amazon.co.jp"
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium mb-1">購入金額（円）</label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="5000"
                  className="w-full"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "処理中..." : "チェックアウトシミュレーション"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {recommendation && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">チェックアウト時のレコメンデーション</h2>
            <p className="text-sm text-neutral-500 mb-4">
              以下は、チェックアウト時に表示されるポップアップです
            </p>
            <ExtensionPopup recommendation={recommendation} onClose={handleClose} />
          </div>
        )}
      </div>
    </div>
  );
}