import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { CreditCard } from "@shared/schema";

interface RecommendationData {
  isOpen: boolean;
  merchantName: string;
  optimalCard: OptimalCard;
  otherCards: OtherCard[];
}

interface OptimalCard extends CreditCard {
  rewardRate: number;
  estimatedPoints: number;
}

interface OtherCard extends CreditCard {
  rewardRate: number;
  estimatedPoints: number;
}

const RecommendationPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  const { data: recommendation } = useQuery<RecommendationData>({
    queryKey: ['/api/recommendation', currentUrl],
    enabled: !!currentUrl && isOpen,
  });

  useEffect(() => {
    // This would be handled by the browser extension to listen for URL changes
    // For demo purposes, we'll just set a mock URL
    const mockUrl = "https://www.amazon.co.jp/checkout";
    setCurrentUrl(mockUrl);
    
    // For demo purposes, show the popup after a delay
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleUseCard = () => {
    // This would be handled by the browser extension to fill in credit card details
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!recommendation) {
    return null;
  }

  const getCardIcon = (cardType: string) => {
    const lowercaseType = cardType.toLowerCase();
    if (lowercaseType.includes("visa")) return "fa-cc-visa text-blue-700";
    if (lowercaseType.includes("mastercard")) return "fa-cc-mastercard text-red-500";
    if (lowercaseType.includes("amex")) return "fa-cc-amex text-blue-500";
    return "fa-credit-card text-neutral-600";
  };

  // レコメンデーションデータが存在しない場合は何も表示しない
  if (!recommendation || !recommendation.optimalCard) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <div>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100">
            <i className="fas fa-credit-card text-primary-600"></i>
          </div>
          <DialogHeader className="mt-3 text-center">
            <DialogTitle className="text-lg leading-6 font-medium text-neutral-900">
              最適なクレジットカードが見つかりました
            </DialogTitle>
            <p className="mt-2 text-sm text-neutral-500">
              {recommendation.merchantName}でのお買い物には、以下のカードがおすすめです：
            </p>
          </DialogHeader>
        </div>
        
        <div className="mt-5">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`flex-shrink-0 h-10 w-14 bg-blue-100 rounded flex items-center justify-center`}>
                  <i className={`fas ${getCardIcon(recommendation.optimalCard.cardType)}`}></i>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-neutral-900">
                    {recommendation.optimalCard.cardType} **** {recommendation.optimalCard.lastFour}
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center">
                      <i className="fas fa-star text-amber-500 text-xs"></i>
                      <i className="fas fa-star text-amber-500 text-xs"></i>
                      <i className="fas fa-star text-amber-500 text-xs"></i>
                      <i className="fas fa-star text-amber-500 text-xs"></i>
                      <i className="fas fa-star-half-alt text-amber-500 text-xs"></i>
                    </div>
                    <div className="ml-2 text-xs text-secondary-600 font-medium">
                      {recommendation.merchantName}での還元率: {recommendation.optimalCard.rewardRate.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="ml-4 flex-shrink-0">
                おすすめ
              </Badge>
            </div>
            <div className="mt-3 text-xs text-neutral-500">
              このカードを使うと、今回の購入で 
              <span className="font-medium text-secondary-600">
                約{recommendation.optimalCard.estimatedPoints}ポイント
              </span> 
              獲得できます。
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="text-xs text-neutral-500 mb-4">
              他のカードと比較：
            </div>
            <div className="space-y-2">
              {recommendation.otherCards.map((card, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-12 bg-gray-100 rounded flex items-center justify-center">
                      <i className={`fas ${getCardIcon(card.cardType)}`}></i>
                    </div>
                    <div className="ml-3">
                      <div className="text-xs font-medium text-neutral-700">
                        {card.cardType} **** {card.lastFour}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-neutral-500">
                    還元率: {card.rewardRate.toFixed(1)}% (+{card.estimatedPoints}ポイント)
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
            <Button onClick={handleUseCard}>
              このカードを使う
            </Button>
            <Button variant="outline" onClick={handleClose}>
              閉じる
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecommendationPopup;
