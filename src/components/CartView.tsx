import { FormEvent, useState } from 'react';
import { Minus, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { CartItem, Order, User } from '../types';
import { ProductImage } from './ProductImage';
import { ActivePage } from './Header';

interface CartViewProps {
  user: User | null;
  cartItems: CartItem[];
  onUpdateQuantity: (cartId: number, quantity: number) => Promise<void>;
  onRemoveItem: (cartId: number) => Promise<void>;
  onPlaceOrder: (phone: string, shippingAddress: string) => Promise<Order | null>;
  onNavigate: (page: ActivePage) => void;
}

export function CartView({
  user,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onNavigate,
}: CartViewProps) {
  const [phone, setPhone] = useState(user?.phone || '');
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  if (!user) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-md mx-auto bg-white border border-[#E5E2DC] rounded-lg p-8 text-center space-y-4">
          <h1 className="font-serif text-2xl font-semibold text-[#1F1E1C]">
            Sign In to View Cart
          </h1>
          <p className="text-sm text-[#66635E]">
            Your shopping cart is tied to your customer account so items stay saved across sessions.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1F1E1C] rounded-md hover:bg-[#353330] cursor-pointer"
          >
            Go to Customer Login
          </button>
        </div>
      </div>
    );
  }

  if (confirmedOrder) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-14">
        <div className="max-w-lg mx-auto bg-white border border-[#E5E2DC] rounded-lg p-8 space-y-5">
          <div className="flex items-center gap-3 text-[#1F1E1C]">
            <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />
            <div>
              <h1 className="font-serif text-2xl font-semibold">
                Order #{confirmedOrder.orderId} Confirmed
              </h1>
              <p className="text-xs text-[#66635E]">
                Status: {confirmedOrder.status} · Cash on Delivery
              </p>
            </div>
          </div>

          <div className="bg-[#FAF9F6] border border-[#E5E2DC] rounded-md p-4 space-y-2 text-sm">
            {confirmedOrder.details.map((d) => (
              <div key={d.detailId} className="flex justify-between gap-4">
                <span className="text-[#1F1E1C]">
                  {d.productName} &times; {d.quantity}
                </span>
                <span className="font-medium tabular-nums">
                  &#8377;{(d.price * d.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
            <div className="pt-2 mt-2 border-t border-[#E5E2DC] flex justify-between font-semibold">
              <span>Total Paid on Delivery</span>
              <span className="tabular-nums">
                &#8377;{confirmedOrder.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setConfirmedOrder(null);
                onNavigate('profile');
              }}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#1F1E1C] rounded-md hover:bg-[#353330] cursor-pointer"
            >
              View Order History
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmedOrder(null);
                onNavigate('products');
              }}
              className="flex-1 py-2.5 text-sm font-medium text-[#1F1E1C] border border-[#DDD2C1] rounded-md hover:bg-[#F5F1EB] cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!phone.trim() || !shippingAddress.trim()) {
      setError('Please enter both phone number and shipping address.');
      return;
    }
    setSubmitting(true);
    try {
      const order = await onPlaceOrder(phone.trim(), shippingAddress.trim());
      if (order) {
        setConfirmedOrder(order);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to place order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
      <div className="pb-6 border-b border-[#E5E2DC] mb-8">
        <h1 className="font-serif text-3xl font-semibold text-[#1F1E1C]">Shopping Cart</h1>
        <p className="text-sm text-[#66635E] mt-1">
          {cartItems.length} {cartItems.length === 1 ? 'product' : 'products'} selected
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white border border-[#E5E2DC] rounded-lg p-12 text-center space-y-4">
          <p className="text-sm text-[#66635E]">Your shopping cart is empty.</p>
          <button
            type="button"
            onClick={() => onNavigate('products')}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1F1E1C] rounded-md hover:bg-[#353330] cursor-pointer"
          >
            Browse Bathroom Ware &amp; Homeware
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items */}
          <div className="lg:col-span-8 bg-white border border-[#E5E2DC] rounded-lg divide-y divide-[#E5E2DC]">
            {cartItems.map((item) => {
              if (!item.product) return null;
              return (
                <div
                  key={item.cartId}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-24 aspect-[4/3] bg-[#F5F1EB] rounded overflow-hidden shrink-0 border border-[#E5E2DC]">
                      <ProductImage
                        src={item.product.imageUrl}
                        alt={item.product.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-[#66635E]">{item.product.category}</span>
                      <h3 className="text-sm font-semibold text-[#1F1E1C]">
                        {item.product.productName}
                      </h3>
                      <p className="text-xs text-[#66635E] mt-0.5 tabular-nums">
                        &#8377;{item.product.price.toLocaleString('en-IN')} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="inline-flex items-center border border-[#DDD2C1] rounded-md">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
                        className="p-2 text-[#1F1E1C] hover:bg-[#F5F1EB] cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-sm font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                        className="p-2 text-[#1F1E1C] hover:bg-[#F5F1EB] cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-sm font-semibold text-[#1F1E1C] tabular-nums w-24 text-right">
                      &#8377;{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.cartId)}
                      className="p-2 text-[#66635E] hover:text-red-700 cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout / Order Summary */}
          <div className="lg:col-span-4 bg-[#F5F1EB] border border-[#E5E2DC] rounded-lg p-6 space-y-5">
            <h2 className="font-serif text-xl font-semibold text-[#1F1E1C]">Order Summary</h2>

            <div className="space-y-2 text-sm border-b border-[#DDD2C1] pb-4">
              <div className="flex justify-between">
                <span className="text-[#66635E]">Subtotal</span>
                <span className="font-medium tabular-nums">
                  &#8377;{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66635E]">Shipping</span>
                <span className="font-medium text-[#1F1E1C]">Complimentary</span>
              </div>
              <div className="flex justify-between pt-2 text-base font-semibold text-[#1F1E1C]">
                <span>Total Amount</span>
                <span className="tabular-nums">&#8377;{subtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {error && (
              <div className="p-3 text-xs text-red-800 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F1E1C] mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={user.fullName}
                  disabled
                  className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#DDD2C1] rounded-md text-[#66635E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1E1C] mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  required
                  className="w-full px-3 py-2 text-sm bg-white border border-[#DDD2C1] rounded-md focus:outline-none focus:border-[#1F1E1C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1E1C] mb-1">
                  Shipping Address
                </label>
                <textarea
                  rows={3}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="House / Flat, Street, City, Pincode"
                  required
                  className="w-full px-3 py-2 text-sm bg-white border border-[#DDD2C1] rounded-md focus:outline-none focus:border-[#1F1E1C]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 text-sm font-semibold text-white bg-[#1F1E1C] rounded-md hover:bg-[#353330] disabled:opacity-60 transition-colors cursor-pointer"
              >
                {submitting ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
