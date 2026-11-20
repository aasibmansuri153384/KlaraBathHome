import { ArrowRight } from 'lucide-react';
import { BATHROOM_CATEGORIES, HOMEWARE_CATEGORIES, Product } from '../types';
import { ProductImage } from './ProductImage';
import { ActivePage } from './Header';

interface HomeViewProps {
  products: Product[];
  onNavigate: (page: ActivePage, category?: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (productId: number) => void;
}

export function HomeView({
  products,
  onNavigate,
  onSelectProduct,
  onAddToCart,
}: HomeViewProps) {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);

  return (
    <div>
      {/* 1. Storefront Hero */}
      <section className="bg-[#F5F1EB] border-b border-[#E5E2DC]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
              <p className="text-xs font-medium text-[#66635E] tracking-wide">
                Bathroom Ware &amp; Homeware Collection
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#1F1E1C] leading-[1.12]">
                Quiet Architecture for Bath &amp; Home
              </h1>
              <p className="text-base text-[#66635E] leading-relaxed max-w-md">
                Sculpted ceramic wash basins, brushed nickel faucets, overhead rain showers, and tactile stoneware essentials designed for everyday calm.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('products', 'All')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#1F1E1C] rounded-md hover:bg-[#353330] transition-colors cursor-pointer min-h-[44px]"
                >
                  <span>Shop All Products</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('java')}
                  className="inline-flex items-center px-5 py-3 text-sm font-medium text-[#1F1E1C] bg-white border border-[#DDD2C1] rounded-md hover:bg-[#FAF9F6] transition-colors cursor-pointer min-h-[44px]"
                >
                  View Java &amp; JSP Code
                </button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="h-full rounded-lg overflow-hidden border border-[#E5E2DC] bg-[#EAE3D7]">
                <ProductImage
                  src="/src/assets/images/hero_bathroom_sanctuary_1795185636405.jpg"
                  alt="Minimalist architectural bathroom with white ceramic vessel basin and travertine counter"
                  className="w-full h-full min-h-[280px] lg:min-h-[400px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Product Categories (Bathroom Ware + Homeware) */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1F1E1C]">
              Shop by Category
            </h2>
            <p className="text-sm text-[#66635E] mt-1">
              Browse four Bathroom Ware lines and four Homeware lines.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('products', 'All')}
            className="text-sm font-medium text-[#1F1E1C] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            Browse Full Catalog
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bathroom Ware Group */}
          <div className="bg-white border border-[#E5E2DC] rounded-lg p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5E2DC]">
              <h3 className="font-serif text-xl font-semibold text-[#1F1E1C]">Bathroom Ware</h3>
              <button
                type="button"
                onClick={() => onNavigate('products', 'Bathroom Ware')}
                className="text-xs font-semibold text-[#66635E] hover:text-[#1F1E1C] cursor-pointer"
              >
                View all &rarr;
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {BATHROOM_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onNavigate('products', cat)}
                  className="text-left p-4 bg-[#FAF9F6] hover:bg-[#F5F1EB] border border-[#E5E2DC] rounded-md transition-colors cursor-pointer"
                >
                  <span className="block text-xs text-[#66635E]">Bathroom Ware</span>
                  <span className="block text-sm font-semibold text-[#1F1E1C] mt-1">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Homeware Group */}
          <div className="bg-white border border-[#E5E2DC] rounded-lg p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5E2DC]">
              <h3 className="font-serif text-xl font-semibold text-[#1F1E1C]">Homeware</h3>
              <button
                type="button"
                onClick={() => onNavigate('products', 'Homeware')}
                className="text-xs font-semibold text-[#66635E] hover:text-[#1F1E1C] cursor-pointer"
              >
                View all &rarr;
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {HOMEWARE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onNavigate('products', cat)}
                  className="text-left p-4 bg-[#FAF9F6] hover:bg-[#F5F1EB] border border-[#E5E2DC] rounded-md transition-colors cursor-pointer"
                >
                  <span className="block text-xs text-[#66635E]">Homeware</span>
                  <span className="block text-sm font-semibold text-[#1F1E1C] mt-1">{cat}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Products Grid */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1F1E1C]">
              Featured Collection
            </h2>
            <p className="text-sm text-[#66635E] mt-1">
              Signature fixtures and stoneware selected for modern interiors.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('products', 'All')}
            className="text-sm font-medium text-[#1F1E1C] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            All Products &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <article
              key={product.productId}
              className="bg-white border border-[#E5E2DC] rounded-lg overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => onSelectProduct(product)}
                className="aspect-[4/3] w-full bg-[#F5F1EB] overflow-hidden cursor-pointer block"
              >
                <ProductImage
                  src={product.imageUrl}
                  alt={product.productName}
                  className="w-full h-full object-cover"
                />
              </button>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs text-[#66635E]">
                  <span>{product.categoryGroup}</span>
                  <span aria-hidden="true">·</span>
                  <span>{product.category}</span>
                </div>

                <h3 className="text-base font-semibold text-[#1F1E1C] mt-1.5">
                  <button
                    type="button"
                    onClick={() => onSelectProduct(product)}
                    className="text-left hover:underline cursor-pointer"
                  >
                    {product.productName}
                  </button>
                </h3>

                <p className="text-sm text-[#66635E] mt-2 line-clamp-2 flex-1">
                  {product.description}
                </p>

                <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-[#E5E2DC]">
                  <span className="text-base font-semibold text-[#1F1E1C] tabular-nums">
                    &#8377;{product.price.toLocaleString('en-IN')}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="px-3 py-2 text-xs font-medium text-[#1F1E1C] border border-[#DDD2C1] rounded-md hover:bg-[#F5F1EB] transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => onAddToCart(product.productId)}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-[#1F1E1C] rounded-md hover:bg-[#353330] transition-colors cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
