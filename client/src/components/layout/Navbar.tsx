import { Link, useLocation } from "wouter";

const Navbar = () => {
  const [location] = useLocation();

  // wouter のLinkコンポーネントで正しく使用するための関数
  const NavLink = ({ href, label }: { href: string; label: string }) => {
    return (
      <Link href={href}>
        <span 
          className={`${
            location === href 
              ? 'border-primary-500 text-neutral-900' 
              : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700'
          } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}
        >
          {label}
        </span>
      </Link>
    );
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <i className="fas fa-credit-card text-primary-600 text-2xl"></i>
              <span className="ml-2 text-xl font-semibold text-primary-600">Kudos</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink href="/" label="ホーム" />
              <NavLink href="/shop" label="ショップ" />
              <NavLink href="/wallet" label="ウォレット" />
              <NavLink href="/withdrawal" label="出金" />
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button type="button" className="bg-white p-1 rounded-full text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <span className="sr-only">通知を見る</span>
              <i className="fas fa-bell"></i>
            </button>

            {/* Profile dropdown */}
            <div className="ml-3 relative">
              <div>
                <Link href="/auth/login">
                  <button type="button" className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500" id="user-menu-button">
                    <span className="sr-only">メニューを開く</span>
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <i className="fas fa-user text-primary-600"></i>
                    </div>
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500" aria-expanded="false">
              <span className="sr-only">メニューを開く</span>
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
