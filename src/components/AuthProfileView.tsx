import { FormEvent, useState } from 'react';
import { Order, User } from '../types';

interface AuthProfileViewProps {
  user: User | null;
  orders: Order[];
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (data: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  }) => Promise<void>;
  onUpdateProfile: (data: { fullName: string; phone: string; address: string }) => Promise<void>;
  onLogout: () => Promise<void>;
}

export function AuthProfileView({
  user,
  orders,
  onLogin,
  onRegister,
  onUpdateProfile,
  onLogout,
}: AuthProfileViewProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync local edit fields when user logs in
  const [syncedUserId, setSyncedUserId] = useState<number | null>(null);
  if (user && user.userId !== syncedUserId) {
    setSyncedUserId(user.userId);
    setFullName(user.fullName);
    setPhone(user.phone);
    setAddress(user.address);
  }

  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (authMode === 'register') {
      if (fullName.trim().length < 2) {
        setError('Please enter your full name.');
        return;
      }
      if (!email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    }

    setLoading(true);
    try {
      if (authMode === 'login') {
        await onLogin(email, password);
      } else {
        await onRegister({ fullName, email, password, phone, address });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!fullName.trim()) {
      setError('Full name cannot be empty.');
      return;
    }
    setLoading(true);
    try {
      await onUpdateProfile({ fullName, phone, address });
      setMessage('Profile information updated.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-md mx-auto bg-white border border-[#E5E2DC] rounded-lg p-8 space-y-6">
          <div className="flex items-center gap-1 p-1 bg-[#F3F2EF] border border-[#E5E2DC] rounded-md">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded transition-colors cursor-pointer ${
                authMode === 'login' ? 'bg-white text-[#1F1E1C] shadow-xs' : 'text-[#66635E]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded transition-colors cursor-pointer ${
                authMode === 'register' ? 'bg-white text-[#1F1E1C] shadow-xs' : 'text-[#66635E]'
              }`}
            >
              Create Account
            </button>
          </div>

          <div>
            <h1 className="font-serif text-2xl font-semibold text-[#1F1E1C]">
              {authMode === 'login' ? 'Customer Sign In' : 'Customer Registration'}
            </h1>
            <p className="text-xs text-[#66635E] mt-1">
              {authMode === 'login'
                ? 'Sign in to manage your cart, profile, and past orders.'
                : 'Register a new account to start shopping.'}
            </p>
          </div>

          {error && (
            <div className="p-3 text-xs text-red-800 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-[#1F1E1C] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm bg-white border border-[#DDD2C1] rounded-md focus:outline-none focus:border-[#1F1E1C]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#1F1E1C] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                minLength={6}
                required
                className="w-full px-3 py-2 text-sm bg-white border border-[#DDD2C1] rounded-md focus:outline-none focus:border-[#1F1E1C]"
              />
            </div>

            {authMode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#1F1E1C] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm bg-white border border-[#DDD2C1] rounded-md focus:outline-none focus:border-[#1F1E1C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1F1E1C] mb-1">
                    Address
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm bg-white border border-[#DDD2C1] rounded-md focus:outline-none focus:border-[#1F1E1C]"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold text-white bg-[#1F1E1C] rounded-md hover:bg-[#353330] disabled:opacity-60 cursor-pointer"
            >
              {loading
                ? 'Please wait...'
                : authMode === 'login'
                ? 'Sign In'
                : 'Register Account'}
            </button>
          </form>

          {authMode === 'login' && (
            <div className="pt-4 border-t border-[#E5E2DC] text-xs text-[#66635E] flex items-center justify-between gap-2">
              <span>Demo: aarav@example.com / 123456</span>
              <button
                type="button"
                onClick={() => {
                  setEmail('aarav@example.com');
                  setPassword('123456');
                }}
                className="font-semibold text-[#1F1E1C] hover:underline cursor-pointer"
              >
                Autofill
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E5E2DC] mb-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#1F1E1C]">
            My Account &amp; Orders
          </h1>
          <p className="text-sm text-[#66635E] mt-1">
            Signed in as {user.fullName} · {user.email}
          </p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="px-4 py-2 text-xs font-semibold text-[#1F1E1C] bg-white border border-[#DDD2C1] rounded-md hover:bg-[#F5F1EB] cursor-pointer"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile Form */}
        <div className="lg:col-span-5 bg-white border border-[#E5E2DC] rounded-lg p-6 space-y-4">
          <h2 className="font-serif text-xl font-semibold text-[#1F1E1C]">
            Profile Details
          </h2>

          {message && (
            <div className="p-3 text-xs text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-md">
              {message}
            </div>
          )}
          {error && (
            <div className="p-3 text-xs text-red-800 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1F1E1C] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-white border border-[#DDD2C1] rounded-md focus:outline-none focus:border-[#1F1E1C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1E1C] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-3 py-2 text-sm bg-[#F3F2EF] border border-[#E5E2DC] rounded-md text-[#66635E]"
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
                className="w-full px-3 py-2 text-sm bg-white border border-[#DDD2C1] rounded-md focus:outline-none focus:border-[#1F1E1C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1F1E1C] mb-1">
                Default Shipping Address
              </label>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#DDD2C1] rounded-md focus:outline-none focus:border-[#1F1E1C]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold text-white bg-[#1F1E1C] rounded-md hover:bg-[#353330] disabled:opacity-60 cursor-pointer"
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* Previous Orders */}
        <div className="lg:col-span-7 bg-white border border-[#E5E2DC] rounded-lg p-6 space-y-4">
          <h2 className="font-serif text-xl font-semibold text-[#1F1E1C]">
            Previous Orders
          </h2>

          {orders.length === 0 ? (
            <p className="text-sm text-[#66635E] py-6">
              You have not placed any orders yet.
            </p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-[#FAF9F6] border border-[#E5E2DC] rounded-md p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E5E2DC]">
                    <div className="text-sm font-semibold text-[#1F1E1C] tabular-nums">
                      Order #{order.orderId}
                    </div>
                    <div className="text-xs text-[#66635E] flex items-center gap-2">
                      <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-[#1F1E1C]">{order.status}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-sm">
                    {order.details.map((d) => (
                      <div key={d.detailId} className="flex justify-between text-[#1F1E1C]">
                        <span>
                          {d.productName} &times; {d.quantity}
                        </span>
                        <span className="tabular-nums text-[#66635E]">
                          &#8377;{(d.price * d.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#E5E2DC] flex items-center justify-between text-sm font-semibold">
                    <span>Order Total</span>
                    <span className="tabular-nums">
                      &#8377;{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
