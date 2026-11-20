import { FormEvent, useState } from 'react';
import { Pencil, Trash2, Eye, X } from 'lucide-react';
import { ALL_CATEGORIES, AdminStats, Order, OrderStatus, Product, ProductCategory } from '../types';

const IMAGE_PRESETS = [
  {
    label: 'Wash Basin & Faucet',
    url: '/src/assets/images/product_wash_basin_1795185639305.jpg',
  },
  {
    label: 'Rain Shower',
    url: '/src/assets/images/product_rain_shower_1795185639224.jpg',
  },
  {
    label: 'Bathroom Accessories',
    url: '/src/assets/images/product_bath_accessories_1795185639508.jpg',
  },
  {
    label: 'Kitchen Accessories',
    url: '/src/assets/images/product_kitchen_accessories_1795185639840.jpg',
  },
  {
    label: 'Home Decor Vases',
    url: '/src/assets/images/product_home_decor_1795185639304.jpg',
  },
  {
    label: 'Storage & Cleaning',
    url: '/src/assets/images/product_storage_cleaning_1795185639914.jpg',
  },
];

interface AdminPanelViewProps {
  adminName: string | null;
  stats: AdminStats | null;
  products: Product[];
  orders: Order[];
  onAdminLogin: (username: string, password: string) => Promise<void>;
  onAdminLogout: () => Promise<void>;
  onCreateProduct: (payload: {
    productName: string;
    category: ProductCategory;
    price: number;
    description: string;
    imageUrl: string;
    featured: boolean;
  }) => Promise<void>;
  onUpdateProduct: (
    productId: number,
    payload: {
      productName: string;
      category: ProductCategory;
      price: number;
      description: string;
      imageUrl: string;
      featured: boolean;
    }
  ) => Promise<void>;
  onDeleteProduct: (productId: number) => Promise<void>;
  onUpdateOrderStatus: (orderId: number, status: OrderStatus) => Promise<void>;
}

export function AdminPanelView({
  adminName,
  stats,
  products,
  orders,
  onAdminLogin,
  onAdminLogout,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
}: AdminPanelViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');

  // Product Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Wash Basins');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(IMAGE_PRESETS[0].url);
  const [featured, setFeatured] = useState(true);
  const [savingProduct, setSavingProduct] = useState(false);

  // Order Details Modal
  const [inspectOrder, setInspectOrder] = useState<Order | null>(null);

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      await onAdminLogin(username, password);
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Invalid admin credentials.');
    }
  };

  const resetProductForm = () => {
    setEditingId(null);
    setProductName('');
    setCategory('Wash Basins');
    setPrice('');
    setDescription('');
    setImageUrl(IMAGE_PRESETS[0].url);
    setFeatured(true);
  };

  const startEdit = (p: Product) => {
    setEditingId(p.productId);
    setProductName(p.productName);
    setCategory(p.category);
    setPrice(String(p.price));
    setDescription(p.description);
    setImageUrl(p.imageUrl);
    setFeatured(p.featured);
    setActiveTab('products');
  };

  const handleProductSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !price || !description.trim()) return;
    setSavingProduct(true);
    try {
      const payload = {
        productName: productName.trim(),
        category,
        price: Number(price),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        featured,
      };
      if (editingId !== null) {
        await onUpdateProduct(editingId, payload);
      } else {
        await onCreateProduct(payload);
      }
      resetProductForm();
    } finally {
      setSavingProduct(false);
    }
  };

  if (!adminName) {
    return (
      <div className="bg-[#F3F2EF] min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white border border-[#E5E2DC] rounded-lg p-8 space-y-6">
          <div>
            <p className="text-xs font-medium text-[#66635E]">Administration Portal</p>
            <h1 className="font-serif text-2xl font-semibold text-[#1F1E1C] mt-1">
              Admin Sign In
            </h1>
          </div>

          {loginError && (
            <div className="p-3 text-xs text-red-800 bg-red-50 border border-red-200 rounded-md">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F1E1C] mb-1">
                Admin Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-white border border-[#DDD2C1] rounded-md focus:outline-none focus:border-[#1F1E1C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1E1C] mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-white border border-[#DDD2C1] rounded-md focus:outline-none focus:border-[#1F1E1C]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-sm font-semibold text-white bg-[#1F1E1C] rounded-md hover:bg-[#353330] cursor-pointer"
            >
              Sign In to Admin Panel
            </button>
          </form>

          <div className="pt-4 border-t border-[#E5E2DC] text-xs text-[#66635E] flex items-center justify-between">
            <span>Demo: admin / admin123</span>
            <button
              type="button"
              onClick={() => {
                setUsername('admin');
                setPassword('admin123');
              }}
              className="font-semibold text-[#1F1E1C] hover:underline cursor-pointer"
            >
              Autofill
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F3F2EF] min-h-[75vh] py-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-6">
        {/* Separate Admin Sub-Header */}
        <div className="bg-white border border-[#E5E2DC] rounded-lg px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="font-serif text-lg font-semibold text-[#1F1E1C]">
                Admin Workspace
              </span>
              <span className="block text-xs text-[#66635E]">{adminName}</span>
            </div>

            <div className="inline-flex items-center gap-1 p-1 bg-[#F3F2EF] border border-[#E5E2DC] rounded-md">
              {(
                [
                  { id: 'dashboard', label: 'Dashboard' },
                  { id: 'products', label: 'Products CRUD' },
                  { id: 'orders', label: 'Orders' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-white text-[#1F1E1C] shadow-xs'
                      : 'text-[#66635E] hover:text-[#1F1E1C]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onAdminLogout}
            className="px-4 py-2 text-xs font-semibold text-[#1F1E1C] border border-[#DDD2C1] rounded-md hover:bg-[#F5F1EB] cursor-pointer"
          >
            Admin Logout
          </button>
        </div>

        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-[#E5E2DC] rounded-lg p-6">
                <p className="text-xs font-medium text-[#66635E]">Total Products</p>
                <p className="text-3xl font-semibold text-[#1F1E1C] mt-2 tabular-nums">
                  {stats?.totalProducts ?? products.length}
                </p>
              </div>
              <div className="bg-white border border-[#E5E2DC] rounded-lg p-6">
                <p className="text-xs font-medium text-[#66635E]">Total Orders</p>
                <p className="text-3xl font-semibold text-[#1F1E1C] mt-2 tabular-nums">
                  {stats?.totalOrders ?? orders.length}
                </p>
              </div>
              <div className="bg-white border border-[#E5E2DC] rounded-lg p-6">
                <p className="text-xs font-medium text-[#66635E]">Total Customers</p>
                <p className="text-3xl font-semibold text-[#1F1E1C] mt-2 tabular-nums">
                  {stats?.totalCustomers ?? 0}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#F5F1EB] border border-[#E5E2DC] rounded-lg p-6 space-y-3">
                <h2 className="font-serif text-xl font-semibold text-[#1F1E1C]">
                  Product Management
                </h2>
                <p className="text-sm text-[#66635E]">
                  Add new bathroom ware or homeware items, update pricing, or remove discontinued fixtures.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1F1E1C] rounded-md cursor-pointer"
                >
                  Open Product Manager
                </button>
              </div>

              <div className="bg-[#F5F1EB] border border-[#E5E2DC] rounded-lg p-6 space-y-3">
                <h2 className="font-serif text-xl font-semibold text-[#1F1E1C]">
                  Order Management
                </h2>
                <p className="text-sm text-[#66635E]">
                  Review customer orders, inspect itemized order details, and update shipping statuses.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1F1E1C] rounded-md cursor-pointer"
                >
                  Open Order Manager
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Management CRUD */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 bg-white border border-[#E5E2DC] rounded-lg p-6 space-y-4">
              <h2 className="font-serif text-xl font-semibold text-[#1F1E1C]">
                {editingId !== null ? `Edit Product #${editingId}` : 'Add New Product'}
              </h2>

              <form onSubmit={handleProductSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#1F1E1C] mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm bg-white border border-[#DDD2C1] rounded-md focus:outline-none focus:border-[#1F1E1C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1E1C] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#DDD2C1] rounded-md focus:outline-none focus:border-[#1F1E1C]"
                  >
                    {ALL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1E1C] mb-1">
                    Price (&#8377;)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm bg-white border border-[#DDD2C1] rounded-md focus:outline-none focus:border-[#1F1E1C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1E1C] mb-1">
                    Studio Image Preset
                  </label>
                  <select
                    value={IMAGE_PRESETS.some((p) => p.url === imageUrl) ? imageUrl : ''}
                    onChange={(e) => {
                      if (e.target.value) setImageUrl(e.target.value);
                    }}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#DDD2C1] rounded-md focus:outline-none focus:border-[#1F1E1C]"
                  >
                    <option value="">Custom Image Path</option>
                    {IMAGE_PRESETS.map((preset) => (
                      <option key={preset.label} value={preset.url}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1E1C] mb-1">
                    Image Path / URL
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#DDD2C1] rounded-md focus:outline-none focus:border-[#1F1E1C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F1E1C] mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm bg-white border border-[#DDD2C1] rounded-md focus:outline-none focus:border-[#1F1E1C]"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs font-medium text-[#1F1E1C]">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded border-[#DDD2C1]"
                  />
                  <span>Show in Featured Products on Homepage</span>
                </label>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={savingProduct}
                    className="flex-1 py-2.5 text-xs font-semibold text-white bg-[#1F1E1C] rounded-md hover:bg-[#353330] cursor-pointer"
                  >
                    {editingId !== null ? 'Update Product' : 'Add Product'}
                  </button>
                  {editingId !== null && (
                    <button
                      type="button"
                      onClick={resetProductForm}
                      className="px-3 py-2.5 text-xs font-medium text-[#1F1E1C] border border-[#DDD2C1] rounded-md hover:bg-[#F5F1EB] cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:col-span-8 bg-white border border-[#E5E2DC] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAF9F6] border-b border-[#E5E2DC] text-xs font-semibold text-[#66635E]">
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E2DC] text-sm">
                    {products.map((p) => (
                      <tr key={p.productId} className="hover:bg-[#FAF9F6]">
                        <td className="py-3 px-4 font-mono text-xs text-[#66635E] tabular-nums">
                          #{p.productId}
                        </td>
                        <td className="py-3 px-4 font-medium text-[#1F1E1C]">{p.productName}</td>
                        <td className="py-3 px-4 text-xs text-[#66635E]">{p.category}</td>
                        <td className="py-3 px-4 font-semibold tabular-nums">
                          &#8377;{p.price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => startEdit(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#1F1E1C] border border-[#DDD2C1] rounded hover:bg-[#F5F1EB] mr-2 cursor-pointer"
                          >
                            <Pencil className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteProduct(p.productId)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-700 border border-red-200 rounded hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Order Management */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-[#E5E2DC] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF9F6] border-b border-[#E5E2DC] text-xs font-semibold text-[#66635E]">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E2DC] text-sm">
                  {orders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-[#FAF9F6]">
                      <td className="py-3 px-4 font-mono text-xs font-semibold tabular-nums">
                        #{order.orderId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#1F1E1C]">{order.customerName}</div>
                        <div className="text-xs text-[#66635E]">{order.phone}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold tabular-nums">
                        &#8377;{order.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            onUpdateOrderStatus(order.orderId, e.target.value as OrderStatus)
                          }
                          className="px-2.5 py-1 text-xs font-medium bg-white border border-[#DDD2C1] rounded focus:outline-none focus:border-[#1F1E1C]"
                        >
                          {(['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'] as const).map(
                            (s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            )
                          )}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setInspectOrder(order)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#1F1E1C] border border-[#DDD2C1] rounded hover:bg-[#F5F1EB] cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Items</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Inspect Order Details Modal */}
      {inspectOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-[#E5E2DC] rounded-lg max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DC]">
              <h3 className="font-serif text-xl font-semibold text-[#1F1E1C]">
                Order #{inspectOrder.orderId} Details
              </h3>
              <button
                type="button"
                onClick={() => setInspectOrder(null)}
                className="p-1 text-[#66635E] hover:text-[#1F1E1C] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-[#66635E] space-y-1">
              <div>
                Customer: <strong className="text-[#1F1E1C]">{inspectOrder.customerName}</strong> ({inspectOrder.phone})
              </div>
              <div>Address: {inspectOrder.shippingAddress}</div>
              <div>Date: {new Date(inspectOrder.orderDate).toLocaleString()}</div>
            </div>

            <div className="bg-[#FAF9F6] border border-[#E5E2DC] rounded-md p-4 space-y-2 text-sm">
              {inspectOrder.details.map((d) => (
                <div key={d.detailId} className="flex justify-between">
                  <span>
                    {d.productName} &times; {d.quantity}
                  </span>
                  <span className="font-medium tabular-nums">
                    &#8377;{(d.price * d.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-[#E5E2DC] flex justify-between font-semibold">
                <span>Total Amount</span>
                <span className="tabular-nums">
                  &#8377;{inspectOrder.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
