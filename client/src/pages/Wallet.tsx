import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import WalletSummary from "@/components/wallet/WalletSummary";
import CreditCardsList from "@/components/dashboard/CreditCardsList";
import TransactionHistory from "@/components/dashboard/TransactionHistory";

const Wallet = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 font-heading">ウォレット</h1>
        <p className="mt-1 text-sm text-neutral-500">あなたのポイント獲得履歴やクレジットカードを管理します</p>
      </div>

      <Tabs defaultValue="company" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="company">弊社ポイント還元額</TabsTrigger>
          <TabsTrigger value="card">クレジットカード還元額</TabsTrigger>
          <TabsTrigger value="potential">獲得可能な追加還元額</TabsTrigger>
        </TabsList>
        
        <TabsContent value="company">
          <WalletSummary rewardType="company" />
        </TabsContent>
        
        <TabsContent value="card">
          <WalletSummary rewardType="card" />
        </TabsContent>
        
        <TabsContent value="potential">
          <WalletSummary rewardType="potential" />
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <CreditCardsList />
        <TransactionHistory />
      </div>
    </div>
  );
};

export default Wallet;
