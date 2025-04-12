import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@shared/schema";
import { format } from "date-fns";

interface WalletSummaryProps {
  rewardType: "company" | "card" | "potential";
}

interface WalletTransaction extends Transaction {
  merchantName: string;
  cardType: string;
  lastFour: string;
  rewardRate: number;
  optimalCard?: boolean;
}

const WalletTransactionItem = ({ 
  transaction, 
  rewardType 
}: { 
  transaction: WalletTransaction; 
  rewardType: "company" | "card" | "potential";
}) => {
  const formattedDate = format(new Date(transaction.date), "yyyy/MM/dd");
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
          <i className="fas fa-building text-neutral-600"></i>
        </div>
        <div className="ml-3">
          <div className="text-sm font-medium text-neutral-900">{transaction.merchantName}</div>
          <div className="text-xs text-neutral-500">{formattedDate}</div>
        </div>
      </div>
      <div>
        {rewardType === "company" && (
          <div className="text-right">
            <div className="flex items-center text-xs text-neutral-500">
              <span>{transaction.rewardRate.toFixed(1)}%</span>
              {transaction.optimalCard ? (
                <i className="fas fa-check-circle ml-1 text-green-500"></i>
              ) : (
                <i className="fas fa-times-circle ml-1 text-red-500"></i>
              )}
            </div>
            <div className="text-sm font-medium text-secondary-600">
              +{transaction.companyRewardPoints?.toFixed(0) || 0}pt
            </div>
          </div>
        )}
        {rewardType === "card" && (
          <div className="text-right">
            <div className="text-xs text-neutral-500">{transaction.cardType} **** {transaction.lastFour}</div>
            <div className="text-xs text-neutral-500">{transaction.rewardRate.toFixed(1)}%</div>
            <div className="text-sm font-medium text-secondary-600">
              +{transaction.cardRewardPoints?.toFixed(0) || 0}pt
            </div>
          </div>
        )}
        {rewardType === "potential" && (
          <div className="text-right">
            <div className="text-xs text-neutral-500">最適率: {transaction.rewardRate.toFixed(1)}%</div>
            <div className="text-sm font-medium text-red-600">
              +{Math.round((transaction.amount * transaction.rewardRate / 100) - (transaction.cardRewardPoints || 0))}pt
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const WalletSummary = ({ rewardType }: WalletSummaryProps) => {
  const { data: transactions, isLoading } = useQuery<WalletTransaction[]>({
    queryKey: ['/api/wallet/transactions', rewardType],
  });

  let title = "";
  if (rewardType === "company") {
    title = "弊社ポイント還元額";
  } else if (rewardType === "card") {
    title = "クレジットカード還元額";
  } else {
    title = "獲得可能と想定される追加還元額";
  }

  return (
    <Card className="shadow">
      <CardHeader className="px-6 py-4">
        <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-0">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded"></div>
            ))}
          </div>
        ) : transactions && transactions.length > 0 ? (
          <div className="space-y-1">
            {transactions.map((transaction) => (
              <WalletTransactionItem 
                key={transaction.id} 
                transaction={transaction} 
                rewardType={rewardType} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-neutral-500">
            利用履歴がありません。
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletSummary;
