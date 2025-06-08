const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <i className="fas fa-credit-card text-primary-400 text-3xl mr-3"></i>
              <span className="text-2xl font-bold text-white">Kudos</span>
            </div>
            <p className="text-gray-300 text-sm max-w-md leading-relaxed mb-6">
              金融テクノロジーでクレジットカード管理を革新。AIによる最適化とデータ分析で、
              あなたのポイント獲得を最大化します。
            </p>
            <div className="flex items-center text-xs text-gray-400">
              <i className="fas fa-shield-alt mr-2"></i>
              <span>金融庁登録済み（仮想通貨交換業者 関東財務局長 第00123号）</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              サービス
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  カード管理・分析
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  AI最適化システム
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  支出データ分析
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  個人向けAPI
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              企業情報
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  会社概要
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  投資家情報
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  採用情報
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  ニュース・お知らせ
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              サポート・法的情報
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  ヘルプセンター
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  セキュリティ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  利用規約
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  プライバシーポリシー
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                  特定商取引法表示
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © 2024 Kudos Financial Technologies, Inc. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>暗号化通信 SSL/TLS</span>
                <span>•</span>
                <span>ISO 27001認証</span>
                <span>•</span>
                <span>PCI DSS準拠</span>
              </div>
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <i className="fab fa-twitter text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <i className="fab fa-linkedin text-lg"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
                <i className="fab fa-github text-lg"></i>
              </a>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="text-xs text-gray-500 leading-relaxed">
              <p className="mb-2">
                <strong>リスクについて：</strong>
                本サービスは金融商品の推奨を行うものではありません。投資や金融商品の利用は自己責任で行ってください。
                過去の実績は将来の結果を保証するものではありません。
              </p>
              <p>
                <strong>免責事項：</strong>
                当社は提供する情報の正確性について最善を尽くしておりますが、
                情報の完全性や正確性を保証するものではありません。
                本サービスの利用により生じた損害について当社は責任を負いません。
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;