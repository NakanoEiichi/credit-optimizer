import RewardsSummary from "@/components/dashboard/RewardsSummary";
import CreditCardsList from "@/components/dashboard/CreditCardsList";
import TransactionHistory from "@/components/dashboard/TransactionHistory";
import RecommendedCard from "@/components/dashboard/RecommendedCard";
import ExtensionPromotion from "@/components/dashboard/ExtensionPromotion";
import RecommendationPopup from "@/components/checkout/RecommendationPopup";

const Home = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 font-heading">ダッシュボード</h1>
        <p className="mt-1 text-sm text-neutral-500">あなたのポイント獲得状況や最適なカード情報をチェックしましょう</p>
      </div>

      <RewardsSummary />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CreditCardsList />
        <TransactionHistory />
      </div>

      <RecommendedCard />
      <ExtensionPromotion />
      
      {/* This would normally be triggered by the browser extension */}
      <RecommendationPopup />
    </div>
  );
};

export default Home;
