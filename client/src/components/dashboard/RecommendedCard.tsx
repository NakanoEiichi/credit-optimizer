import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

interface RecommendedCardFeature {
  name: string;
}

interface RecommendedCardBenefit {
  description: string;
}

interface RecommendedCardProps {
  id: number;
  name: string;
  features: RecommendedCardFeature[];
  baseRewardRate: string;
  annualFee: string;
  brands: string;
  benefits: RecommendedCardBenefit[];
  cardType: string;
}

const RecommendedCard = () => {
  const { data: recommendedCard, isLoading } = useQuery<RecommendedCardProps>({
    queryKey: ['/api/recommended-card'],
  });

  if (isLoading) {
    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-neutral-900 font-heading">オススメのクレジットカード</h2>
          <div className="h-4 w-40 bg-gray-100 rounded animate-pulse"></div>
        </div>
        <Card className="shadow animate-pulse">
          <div className="h-40 bg-gray-100"></div>
        </Card>
      </div>
    );
  }

  if (!recommendedCard) {
    return null;
  }

  let cardIconClass = "fa-credit-card";
  let cardIconBgColor = "bg-red-100";
  let cardIconTextColor = "text-red-600";

  if (recommendedCard.cardType.toLowerCase().includes("visa")) {
    cardIconClass = "fa-cc-visa";
    cardIconBgColor = "bg-blue-100";
    cardIconTextColor = "text-blue-700";
  } else if (recommendedCard.cardType.toLowerCase().includes("mastercard")) {
    cardIconClass = "fa-cc-mastercard";
    cardIconBgColor = "bg-red-100";
    cardIconTextColor = "text-red-600";
  } else if (recommendedCard.cardType.toLowerCase().includes("amex")) {
    cardIconClass = "fa-cc-amex";
    cardIconBgColor = "bg-blue-100";
    cardIconTextColor = "text-blue-600";
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-neutral-900 font-heading">オススメのクレジットカード</h2>
        <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
          すべてのオススメカードを見る <i className="fas fa-chevron-right ml-1 text-xs"></i>
        </a>
      </div>
      <Card className="shadow">
        <CardHeader className="px-4 py-5 sm:px-6 bg-gradient-to-r from-primary-600 to-primary-700">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg leading-6 font-medium text-white">{recommendedCard.name}</h3>
              <div className="mt-2 flex space-x-2">
                {recommendedCard.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="bg-primary-200 text-primary-800">
                    {feature.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-md p-2 shadow">
              <div className={`h-10 w-16 ${cardIconBgColor} rounded flex items-center justify-center`}>
                <i className={`fas ${cardIconClass} ${cardIconTextColor}`}></i>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-neutral-500">基本還元率</dt>
              <dd className="mt-1 text-sm text-neutral-900 font-bold">{recommendedCard.baseRewardRate}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-neutral-500">年会費</dt>
              <dd className="mt-1 text-sm text-neutral-900">{recommendedCard.annualFee}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-neutral-500">国際ブランド</dt>
              <dd className="mt-1 text-sm text-neutral-900">{recommendedCard.brands}</dd>
            </div>
            <div className="sm:col-span-3 mt-2">
              <dt className="text-sm font-medium text-neutral-500">キーベネフィット</dt>
              <dd className="mt-1 text-sm text-neutral-900">
                <ul className="list-disc pl-5 space-y-1">
                  {recommendedCard.benefits.map((benefit, index) => (
                    <li key={index}>{benefit.description}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
          <div className="mt-5">
            <Button className="inline-flex items-center">
              詳細を見る
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendedCard;
