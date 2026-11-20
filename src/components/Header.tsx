import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';

export type ActivePage = 'home' | 'products' | 'cart' | 'profile' | 'admin' | 'java';

interface HeaderProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  cartCount: number;
}

export function Header({ activePage, onNavigate, cartCount }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { id: ActivePage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'profile', label: 'Account' },
    { id: 'admin', label: 'Admin' },
    { id: 'java', label: 'Java Source' },
  ];

  const handleNav = (id: ActivePage) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E5E2DC]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="font-serif text-xl font-semibold tracking-tight text-[#1F1E1C] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F1E1C]"
        >
          Klara Bath &amp; Home
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Primary Navigation">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`text-sm font-medium whitespace-nowrap shrink-0 pb-0.5 transition-colors cursor-pointer border-b-2 ${
                  isActive
                    ? 'text-[#1F1E1C] border-[#1F1E1C]'
                    : 'text-[#66635E] border-transparent hover:text-[#1F1E1C] hover:border-[#DDD2C1]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('cart')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1F1E1C] rounded-md hover:bg-[#353330] transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[40px]"
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={1.75} />
            <span className="tabular-nums">Cart ({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden p-2 text-[#1F1E1C] border border-[#E5E2DC] rounded-md min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#E5E2DC] px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              className={`block w-full text-left px-3 py-2.5 text-sm font-medium rounded-md ${
                activePage === item.id
                  ? 'bg-[#F5F1EB] text-[#1F1E1C]'
                  : 'text-[#66635E] hover:bg-[#FAF9F6]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
