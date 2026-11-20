import { useState } from 'react';
import { Search, X, Minus, Plus } from 'lucide-react';
import { ALL_CATEGORIES, Product } from '../types';
import { ProductImage } from './ProductImage';

interface ProductsViewProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedProduct: Product | null;
  onSelectProduct: (product: Product | null) => void;
  onAddToCart: (productId: number, quantity?: number) => void;
}

export function ProductsView({
  products,
  selectedCategory,
  onSelectCategory,
  selectedProduct,
  onSelectProduct,
  onAddToCart,
}: ProductsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [detailQty, setDetailQty] = useState(1);

  const filtered = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      p.category === selectedCategory ||
      p.categoryGroup === selectedCategory;

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.productName.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  const openDetails = (p: Product) => {
    setDetailQty(1);
    onSelectProduct(p);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E5E2DC]">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#1F1E1C]">
            Product Catalog
          </h1>
          <p className="text-sm text-[#66635E] mt-1">
            {filtered.length} {filtered.length === 1 ? 'item' : 'items'} in {selectedCategory}
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#66635E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search basins, faucets, decor..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#DDD2C1] rounded-md focus:outline-none focus:border-[#1F1E1C]"
          />
        </div>
      </div>

      {/* Category Filter Toolbar */}
      <div className="py-5 space-y-3">
        <div className="inline-flex items-center gap-1 p-1 bg-[#F3F2EF] border border-[#E5E2DC] rounded-md">
          {['All', 'Bathroom Ware', 'Homeware'].map((group) => (
            <button
              key={group}
              type="button"
              onClick={() => onSelectCategory(group)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === group
                  ? 'bg-white text-[#1F1E1C] shadow-xs'
                  : 'text-[#66635E] hover:text-[#1F1E1C]'
              }`}
            >
              {group}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1F1E1C] text-white border-[#1F1E1C]'
                  : 'bg-white text-[#66635E] border-[#E5E2DC] hover:border-[#1F1E1C] hover:text-[#1F1E1C]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-[#E5E2DC] rounded-lg p-12 text-center">
          <p className="text-sm text-[#66635E]">No products match your current filter.</p>
          <button
            type="button"
            onClick={() => {
              onSelectCategory('All');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#1F1E1C] rounded-md cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
          {filtered.map((product) => (
            <article
              key={product.productId}
              className="bg-white border border-[#E5E2DC] rounded-lg overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => openDetails(product)}
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

                <h2 className="text-base font-semibold text-[#1F1E1C] mt-1.5">
                  <button
                    type="button"
                    onClick={() => openDetails(product)}
                    className="text-left hover:underline cursor-pointer"
                  >
                    {product.productName}
                  </button>
                </h2>

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
                      onClick={() => openDetails(product)}
                      className="px-3 py-2 text-xs font-medium text-[#1F1E1C] border border-[#DDD2C1] rounded-md hover:bg-[#F5F1EB] transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => onAddToCart(product.productId, 1)}
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
      )}

      {/* Product Details Modal (Contiguous Purchase Module) */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-[#E5E2DC] rounded-lg max-w-3xl w-full overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E2DC] bg-[#FAF9F6]">
              <span className="text-xs font-medium text-[#66635E]">
                {selectedProduct.categoryGroup} · {selectedProduct.category} · ID #{selectedProduct.productId}
              </span>
              <button
                type="button"
                onClick={() => onSelectProduct(null)}
                className="p-1.5 text-[#66635E] hover:text-[#1F1E1C] rounded cursor-pointer"
                aria-label="Close product details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-6 bg-[#F5F1EB] aspect-[4/3] md:aspect-auto">
                <ProductImage
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.productName}
                  className="w-full h-full object-cover min-h-[260px]"
                />
              </div>

              <div className="md:col-span-6 p-6 flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <h2 className="font-serif text-2xl font-semibold text-[#1F1E1C]">
                    {selectedProduct.productName}
                  </h2>
                  <p className="text-2xl font-semibold text-[#1F1E1C] tabular-nums">
                    &#8377;{selectedProduct.price.toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-[#66635E] leading-relaxed">
                    {selectedProduct.description}
                  </p>
                  <div className="pt-2 text-xs text-[#66635E] space-y-1 border-t border-[#E5E2DC]">
                    <div>Availability: In Stock</div>
                    <div>Delivery: Standard 3–5 business days</div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center border border-[#DDD2C1] rounded-md">
                      <button
                        type="button"
                        onClick={() => setDetailQty((q) => Math.max(1, q - 1))}
                        className="p-2.5 text-[#1F1E1C] hover:bg-[#F5F1EB] cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 text-sm font-semibold tabular-nums">{detailQty}</span>
                      <button
                        type="button"
                        onClick={() => setDetailQty((q) => Math.min(20, q + 1))}
                        className="p-2.5 text-[#1F1E1C] hover:bg-[#F5F1EB] cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onAddToCart(selectedProduct.productId, detailQty);
                        onSelectProduct(null);
                      }}
                      className="flex-1 py-2.5 px-5 text-sm font-semibold text-white bg-[#1F1E1C] rounded-md hover:bg-[#353330] transition-colors cursor-pointer min-h-[42px]"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
