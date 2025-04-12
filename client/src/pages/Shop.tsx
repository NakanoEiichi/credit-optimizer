import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Merchant } from "@shared/schema";
import MerchantLogo from "@/components/ui/merchant-logo";

interface MerchantWithReward extends Merchant {
  rewardRate: number;
  isFavorite: boolean;
}

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: merchants, isLoading } = useQuery<MerchantWithReward[]>({
    queryKey: ['/api/merchants'],
  });

  const filteredMerchants = merchants?.filter(merchant => 
    merchant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFavorite = async (merchantId: number, isFavorite: boolean) => {
    // Implementation for toggling favorite status
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 font-heading">ショップ</h1>
        <p className="mt-1 text-sm text-neutral-500">お買い物で獲得できるポイント率をチェックしましょう</p>
      </div>

      {/* Flash Boost (Featured Promotion) */}
      <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white mb-8">
        <CardContent className="px-4 py-6 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">フラッシュブースト！</h3>
              <p className="mt-2">今週末限定：Amazonでのお買い物がポイント5倍！</p>
              <Badge className="mt-4 bg-white text-amber-600">
                5月20日〜22日限定
              </Badge>
            </div>
            <div className="hidden sm:block">
              <i className="fas fa-bolt text-6xl text-white opacity-80"></i>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Merchant List */}
      <Card className="shadow">
        <CardHeader className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h2 className="text-lg font-medium text-neutral-900 mb-4 sm:mb-0">加盟店リスト</h2>
          <Input 
            type="search" 
            placeholder="加盟店を検索" 
            className="max-w-xs" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardHeader>
        <CardContent className="p-0 border-t border-gray-200">
          {isLoading ? (
            <div className="animate-pulse p-4 space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded"></div>
              ))}
            </div>
          ) : filteredMerchants && filteredMerchants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {filteredMerchants.map((merchant) => (
                <div 
                  key={merchant.id} 
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <MerchantLogo name={merchant.name} />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-neutral-900">{merchant.name}</div>
                      <div className="text-xs text-neutral-500">{merchant.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-3">
                      {merchant.rewardRate.toFixed(1)}%
                    </Badge>
                    <button 
                      className="text-gray-400 hover:text-amber-500 focus:outline-none"
                      onClick={() => toggleFavorite(merchant.id, merchant.isFavorite)}
                      aria-label={merchant.isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
                    >
                      <i className={`fas fa-heart ${merchant.isFavorite ? 'text-amber-500' : ''}`}></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-neutral-500">
              {searchTerm ? (
                <>
                  <i className="fas fa-search text-3xl mb-4 block mx-auto text-neutral-400"></i>
                  <p>「{searchTerm}」に一致する加盟店は見つかりませんでした。</p>
                </>
              ) : (
                <p>加盟店が見つかりませんでした。</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Shop;
