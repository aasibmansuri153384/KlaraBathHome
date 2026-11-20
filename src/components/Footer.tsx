import { ActivePage } from './Header';

interface FooterProps {
  onNavigate: (page: ActivePage, category?: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#F3F2EF] border-t border-[#E5E2DC] mt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-3">
            <h3 className="font-serif text-lg font-semibold text-[#1F1E1C]">
              Klara Bath &amp; Home
            </h3>
            <p className="text-sm text-[#66635E] leading-relaxed max-w-sm">
              Architectural bathroom fixtures and calm everyday homeware in matte ceramic, natural travertine, and brushed brass.
            </p>
          </div>

          <div className="md:col-span-2 space-y-2.5">
            <p className="text-xs font-semibold text-[#66635E] tracking-wide">Catalog</p>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('products', 'Bathroom Ware')}
                  className="text-[#1F1E1C] hover:underline cursor-pointer"
                >
                  Bathroom Ware
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('products', 'Homeware')}
                  className="text-[#1F1E1C] hover:underline cursor-pointer"
                >
                  Homeware
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('products', 'All')}
                  className="text-[#1F1E1C] hover:underline cursor-pointer"
                >
                  All Products
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-2.5">
            <p className="text-xs font-semibold text-[#66635E] tracking-wide">Customer</p>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('profile')}
                  className="text-[#1F1E1C] hover:underline cursor-pointer"
                >
                  Sign In / Register
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('cart')}
                  className="text-[#1F1E1C] hover:underline cursor-pointer"
                >
                  Shopping Cart
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <p className="text-xs font-semibold text-[#66635E] tracking-wide">Project Resources</p>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="text-[#1F1E1C] hover:underline cursor-pointer"
                >
                  Admin Panel
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('java')}
                  className="text-[#1F1E1C] hover:underline cursor-pointer"
                >
                  Java Servlet, JSP &amp; MySQL Code
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#E5E2DC] mt-10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#66635E]">
          <span>&copy; 2026 Klara Bath &amp; Home. College Mini Project Storefront.</span>
          <span>HTML · Bootstrap 5 · Java Servlet &amp; JSP · MySQL · Apache Tomcat</span>
        </div>
      </div>
    </footer>
  );
}
