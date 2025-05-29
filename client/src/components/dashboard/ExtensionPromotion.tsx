import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ExtensionPromotion = () => {
  return (
    <Card className="mt-8 bg-gray-50">
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <i className="fas fa-puzzle-piece text-4xl text-primary-600"></i>
          </div>
          <div className="ml-5">
            <h3 className="text-lg leading-6 font-medium text-neutral-900">拡張機能をインストール</h3>
            <div className="mt-2 max-w-xl text-sm text-neutral-500">
              <p>ショッピング中にリアルタイムで最適なクレジットカードを提案する拡張機能をインストールしましょう。</p>
            </div>
            <div className="mt-3">
              <div className="flex space-x-3">
                <Button className="inline-flex items-center">
                  <i className="fab fa-chrome mr-2"></i>
                  Chrome版をダウンロード
                </Button>
                <Button variant="outline" className="inline-flex items-center text-white bg-neutral-700 hover:bg-neutral-800 focus:ring-neutral-500 border-transparent">
                  <i className="fab fa-safari mr-2"></i>
                  Safari版をダウンロード
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExtensionPromotion;
