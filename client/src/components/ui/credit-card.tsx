import { Card, CardContent } from "@/components/ui/card";
import { CreditCard as CreditCardType } from "@shared/schema";

interface CreditCardProps {
  card: CreditCardType;
  isSelected?: boolean;
  onClick?: () => void;
}

const CreditCard = ({ card, isSelected, onClick }: CreditCardProps) => {
  let cardIcon = "fa-credit-card";
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
  } else if (card.cardType.toLowerCase().includes("jcb")) {
    cardIcon = "fa-cc-jcb";
    cardTextColor = "text-green-600";
  }

  return (
    <Card 
      className={`cursor-pointer transition-shadow hover:shadow-md ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-12 w-16 bg-gray-100 rounded flex items-center justify-center">
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
      </CardContent>
    </Card>
  );
};

export default CreditCard;
