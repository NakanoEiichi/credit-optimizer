import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

interface RewardSummaryItemProps {
  icon: string;
  iconBgColor: string;
  iconTextColor: string;
  title: string;
  amount: number;
  percentChange?: number;
  isSpecial?: boolean;
}

const RewardSummaryItem = ({ 
  icon, 
  iconBgColor, 
  iconTextColor, 
  title, 
  amount, 
  percentChange, 
  isSpecial 
}: RewardSummaryItemProps) => {
  return (
    <Card>
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${iconBgColor} rounded-md p-3`}>
            <i className={`fas ${icon} ${iconTextColor}`}></i>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-neutral-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-neutral-900">{(amount || 0).toLocaleString()}</div>
                {percentChange && (
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <i className="fas fa-arrow-up mr-0.5"></i>
                    <span>{percentChange}%</span>
                  </div>
                )}
                {isSpecial && (
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                    <i className="fas fa-star mr-0.5"></i>
                    <span>獲得可能</span>
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RewardsSummary = () => {
  const { data: rewardsSummary, isLoading } = useQuery({
    queryKey: ['/api/rewards/summary'],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="px-4 py-5 sm:p-6">
              <div className="animate-pulse h-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const summary = rewardsSummary || {
    companyPoints: 14324,
    companyPointsPercentChange: 12.5,
    cardPoints: 23658,
    cardPointsPercentChange: 8.2,
    potentialExtraPoints: 8471
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
      <RewardSummaryItem 
        icon="fa-coins" 
        iconBgColor="bg-primary-100" 
        iconTextColor="text-primary-600" 
        title="弊社ポイント還元額" 
        amount={summary.companyPoints} 
        percentChange={summary.companyPointsPercentChange} 
      />
      
      <RewardSummaryItem 
        icon="fa-credit-card" 
        iconBgColor="bg-amber-100" 
        iconTextColor="text-amber-500" 
        title="クレジットカード還元額" 
        amount={summary.cardPoints} 
        percentChange={summary.cardPointsPercentChange} 
      />
      
      <RewardSummaryItem 
        icon="fa-chart-line" 
        iconBgColor="bg-secondary-100" 
        iconTextColor="text-secondary-500" 
        title="獲得可能と想定される追加還元額" 
        amount={summary.potentialExtraPoints} 
        isSpecial={true}
      />
    </div>
  );
};

export default RewardsSummary;
