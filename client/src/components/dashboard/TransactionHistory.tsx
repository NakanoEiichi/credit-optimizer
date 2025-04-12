import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Transaction, CreditCard, Merchant } from "@shared/schema";
import { format } from "date-fns";

type Period = "week" | "month" | "year";

interface TransactionWithDetails extends Transaction {
  card?: CreditCard;
  merchant?: Merchant;
}

const MerchantLogo = ({ merchant }: { merchant?: Merchant }) => {
  const merchantName = merchant?.name || "Unknown";
  const iconMap: Record<string, string> = {
    "Amazon": "fa-shopping-bag",
    "星野珈琲": "fa-utensils",
    "ENEOS": "fa-gas-pump",
    "楽天": "fa-shopping-cart",
    "セブンイレブン": "fa-store",
  };

  const icon = merchant ? (iconMap[merchant.name] || "fa-building") : "fa-building";

  return (
    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
      <i className={`fas ${icon} text-neutral-600`}></i>
    </div>
  );
};

const TransactionItem = ({ transaction }: { transaction: TransactionWithDetails }) => {
  const formattedDate = transaction.date 
    ? format(new Date(transaction.date), "yyyy/MM/dd HH:mm") 
    : "Unknown date";
  
  const isOptimal = transaction.isOptimal !== false;

  return (
    <div className="px-4 py-4 sm:px-6 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center">
            <MerchantLogo merchant={transaction.merchant} />
            <div className="ml-4">
              <div className="text-sm font-medium text-neutral-900">
                {transaction.merchant?.name || "Unknown Merchant"}
              </div>
              <div className="text-xs text-neutral-500">{formattedDate}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center">
            <span className="text-xs text-neutral-500 mr-2">
              {transaction.card ? `${transaction.card.cardType} **** ${transaction.card.lastFour}` : "Unknown Card"}
            </span>
            <span className={`text-xs ${isOptimal ? "text-secondary-600" : "text-red-500"} font-medium`}>
              {transaction.card?.baseRewardRate.toFixed(1)}%
              {!isOptimal && <i className="fas fa-exclamation-circle ml-0.5" title="より高い還元率のカードがあります"></i>}
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="text-sm font-medium text-neutral-900">
              ¥{transaction.amount.toLocaleString()}
            </span>
            <span className="ml-2 text-xs text-secondary-600">
              +{transaction.rewardPoints?.toFixed(0) || 0}pt
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TransactionHistory = () => {
  const [period, setPeriod] = useState<Period>("week");
  
  const { data: transactions, isLoading } = useQuery<TransactionWithDetails[]>({
    queryKey: ['/api/transactions', period],
  });

  return (
    <Card className="shadow">
      <CardHeader className="px-4 py-5 sm:px-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-neutral-900">最近の利用履歴</h2>
          <div className="inline-flex shadow-sm rounded-md">
            <Button
              variant={period === "week" ? "default" : "outline"}
              size="sm"
              className={`rounded-l-md ${period !== "week" ? "hover:text-neutral-700" : ""}`}
              onClick={() => setPeriod("week")}
            >
              今週
            </Button>
            <Button
              variant={period === "month" ? "default" : "outline"}
              size="sm"
              className={`-ml-px ${period !== "month" ? "hover:text-neutral-700" : ""}`}
              onClick={() => setPeriod("month")}
            >
              今月
            </Button>
            <Button
              variant={period === "year" ? "default" : "outline"}
              size="sm"
              className={`-ml-px rounded-r-md ${period !== "year" ? "hover:text-neutral-700" : ""}`}
              onClick={() => setPeriod("year")}
            >
              今年
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 border-t border-gray-200">
        {isLoading ? (
          <div className="animate-pulse p-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded mb-4 last:mb-0"></div>
            ))}
          </div>
        ) : transactions && transactions.length > 0 ? (
          transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <div className="p-4 text-center text-neutral-500">
            該当期間の取引履歴はありません。
          </div>
        )}
        {transactions && transactions.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 text-center">
            <Button variant="outline" size="sm" className="inline-flex items-center">
              すべての履歴を表示
              <i className="fas fa-chevron-right ml-1.5 text-xs"></i>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
