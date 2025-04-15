import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard as CreditCardIcon, CheckCircle, Award } from "lucide-react";

// 拡張機能のポップアップコンポーネント
// これは実際のChrome/Safari拡張機能でチェックアウト時に表示されるUIです
export interface RecommendationDetails {
  merchantName: string;
  optimalCard: {
    id: number;
    name: string;
    type: string;
    lastFour: string;
    rewardRate: number;
    estimatedPoints: number;
  };
  otherCards: Array<{
    id: number;
    name: string;
    type: string;
    lastFour: string;
    rewardRate: number;
    estimatedPoints: number;
  }>;
  purchaseAmount: number;
}

interface ExtensionPopupProps {
  recommendation: RecommendationDetails;
  onClose?: () => void;
}

const ExtensionPopup = ({ recommendation, onClose }: ExtensionPopupProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const formatCardNumber = (type: string, lastFour: string) => {
    return `${type.toUpperCase()} •••• ${lastFour}`;
  };
  
  return (
    <Card className="w-full max-w-md border-2 border-primary-200 shadow-lg">
      <CardHeader className="bg-primary-50 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">おすすめのカード</CardTitle>
            <CardDescription>
              {recommendation.merchantName}での購入には以下のカードがお得です
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary-100 text-primary-700">
            {(recommendation.optimalCard.rewardRate * 100).toFixed(1)}% 還元
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-primary-100 p-3 rounded-full">
            <CreditCardIcon className="h-6 w-6 text-primary-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{recommendation.optimalCard.name}</h3>
            <p className="text-sm text-neutral-500">
              {formatCardNumber(recommendation.optimalCard.type, recommendation.optimalCard.lastFour)}
            </p>
          </div>
          <CheckCircle className="h-5 w-5 text-green-500" />
        </div>
        
        <div className="bg-neutral-50 p-3 rounded-lg mb-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-600">予想獲得ポイント</span>
            <span className="font-semibold text-primary-700">
              {recommendation.optimalCard.estimatedPoints.toLocaleString()} ポイント
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-neutral-600">購入金額</span>
            <span className="font-semibold">
              {recommendation.purchaseAmount.toLocaleString()} 円
            </span>
          </div>
        </div>
        
        {showDetails && recommendation.otherCards.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium text-sm mb-2">他のカード比較</h3>
            <div className="space-y-3">
              {recommendation.otherCards.map((card) => (
                <div key={card.id} className="flex items-center gap-3 border-b pb-2">
                  <div className="bg-neutral-100 p-2 rounded-full">
                    <CreditCardIcon className="h-4 w-4 text-neutral-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{card.name}</h4>
                    <p className="text-xs text-neutral-500">
                      {formatCardNumber(card.type, card.lastFour)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-neutral-500">
                      {(card.rewardRate * 100).toFixed(1)}%
                    </span>
                    <p className="text-xs font-medium">{card.estimatedPoints.toLocaleString()} pt</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between bg-neutral-50 pt-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "詳細を隠す" : "詳細を表示"}
        </Button>
        <Button 
          size="sm"
          onClick={onClose}
        >
          確認
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExtensionPopup;