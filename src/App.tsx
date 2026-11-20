import { useCallback, useEffect, useState } from 'react';
import { Header, ActivePage } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ProductsView } from './components/ProductsView';
import { CartView } from './components/CartView';
import { AuthProfileView } from './components/AuthProfileView';
import { AdminPanelView } from './components/AdminPanelView';
import { JavaSourceView } from './components/JavaSourceView';
import { AdminStats, CartItem, Order, OrderStatus, Product, ProductCategory, User } from './types';

const USER_TOKEN_KEY = 'klara_user_token';
const ADMIN_TOKEN_KEY = 'klara_admin_token';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [userToken, setUserToken] = useState<string | null>(() =>
    localStorage.getItem(USER_TOKEN_KEY)
  );
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);

  const [adminToken, setAdminToken] = useState<string | null>(() =>
    localStorage.getItem(ADMIN_TOKEN_KEY)
  );
  const [adminName, setAdminName] = useState<string | null>(() =>
    localStorage.getItem('klara_admin_name')
  );
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((curr) => (curr === msg ? null : curr)), 2600);
  }, []);

  const fetchProducts = useCallback(async () => {
    const res = await fetch('/api/products');
    if (res.ok) {
      setProducts(await res.json());
    }
  }, []);

  const fetchUserContext = useCallback(async (token: string | null) => {
    if (!token) {
      setUser(null);
      setCartItems([]);
      setMyOrders([]);
      return;
    }
    const headers = { 'x-session-token': token };
    const meRes = await fetch('/api/auth/me', { headers });
    if (!meRes.ok) {
      localStorage.removeItem(USER_TOKEN_KEY);
      setUserToken(null);
      setUser(null);
      setCartItems([]);
      setMyOrders([]);
      return;
    }
    const { user: fetchedUser } = await meRes.json();
    setUser(fetchedUser);

    const [cartRes, ordersRes] = await Promise.all([
      fetch('/api/cart', { headers }),
      fetch('/api/orders/my', { headers }),
    ]);
    if (cartRes.ok) setCartItems(await cartRes.json());
    if (ordersRes.ok) setMyOrders(await ordersRes.json());
  }, []);

  const fetchAdminContext = useCallback(async (token: string | null) => {
    if (!token) {
      setAdminStats(null);
      setAdminOrders([]);
      return;
    }
    const headers = { 'x-admin-token': token };
    const [statsRes, ordersRes] = await Promise.all([
      fetch('/api/admin/stats', { headers }),
      fetch('/api/admin/orders', { headers }),
    ]);
    if (!statsRes.ok) {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem('klara_admin_name');
      setAdminToken(null);
      setAdminName(null);
      return;
    }
    if (statsRes.ok) setAdminStats(await statsRes.json());
    if (ordersRes.ok) setAdminOrders(await ordersRes.json());
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchUserContext(userToken);
  }, [userToken, fetchUserContext]);

  useEffect(() => {
    fetchAdminContext(adminToken);
  }, [adminToken, fetchAdminContext]);

  const handleNavigate = (page: ActivePage, category?: string) => {
    setActivePage(page);
    if (category !== undefined) {
      setSelectedCategory(category);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProductFromHome = (product: Product) => {
    setSelectedProduct(product);
    setActivePage('products');
  };

  // --- Customer Auth & Cart Handlers ---
  const handleLogin = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    localStorage.setItem(USER_TOKEN_KEY, data.token);
    setUserToken(data.token);
    setUser(data.user);
    showToast(`Welcome back, ${data.user.fullName}`);
  };

  const handleRegister = async (payload: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  }) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    localStorage.setItem(USER_TOKEN_KEY, data.token);
    setUserToken(data.token);
    setUser(data.user);
    showToast('Account created and signed in');
  };

  const handleUpdateProfile = async (payload: {
    fullName: string;
    phone: string;
    address: string;
  }) => {
    if (!userToken) return;
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-session-token': userToken,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Update failed');
    setUser(data.user);
  };

  const handleLogout = async () => {
    if (userToken) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'x-session-token': userToken },
      });
    }
    localStorage.removeItem(USER_TOKEN_KEY);
    setUserToken(null);
    setUser(null);
    setCartItems([]);
    setMyOrders([]);
    showToast('Signed out');
  };

  const handleAddToCart = async (productId: number, quantity = 1) => {
    if (!userToken) {
      showToast('Please sign in to add items to your cart');
      setActivePage('profile');
      return;
    }
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-token': userToken,
      },
      body: JSON.stringify({ productId, quantity }),
    });
    if (res.ok) {
      await fetchUserContext(userToken);
      showToast('Added to shopping cart');
    }
  };

  const handleUpdateCartQuantity = async (cartId: number, quantity: number) => {
    if (!userToken) return;
    await fetch(`/api/cart/${cartId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-session-token': userToken,
      },
      body: JSON.stringify({ quantity }),
    });
    await fetchUserContext(userToken);
  };

  const handleRemoveCartItem = async (cartId: number) => {
    if (!userToken) return;
    await fetch(`/api/cart/${cartId}`, {
      method: 'DELETE',
      headers: { 'x-session-token': userToken },
    });
    await fetchUserContext(userToken);
  };

  const handlePlaceOrder = async (phone: string, shippingAddress: string): Promise<Order | null> => {
    if (!userToken) return null;
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-token': userToken,
      },
      body: JSON.stringify({ phone, shippingAddress }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Could not place order');
    await Promise.all([fetchUserContext(userToken), fetchAdminContext(adminToken)]);
    return data as Order;
  };

  // --- Admin Handlers ---
  const handleAdminLogin = async (username: string, password: string) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Admin login failed');
    localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
    localStorage.setItem('klara_admin_name', data.adminName);
    setAdminToken(data.token);
    setAdminName(data.adminName);
  };

  const handleAdminLogout = async () => {
    if (adminToken) {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'x-admin-token': adminToken },
      });
    }
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem('klara_admin_name');
    setAdminToken(null);
    setAdminName(null);
  };

  const handleCreateProduct = async (payload: {
    productName: string;
    category: ProductCategory;
    price: number;
    description: string;
    imageUrl: string;
    featured: boolean;
  }) => {
    if (!adminToken) return;
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken,
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      await Promise.all([fetchProducts(), fetchAdminContext(adminToken)]);
      showToast('Product added to catalog');
    }
  };

  const handleUpdateProduct = async (
    productId: number,
    payload: {
      productName: string;
      category: ProductCategory;
      price: number;
      description: string;
      imageUrl: string;
      featured: boolean;
    }
  ) => {
    if (!adminToken) return;
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken,
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      await fetchProducts();
      showToast(`Product #${productId} updated`);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!adminToken) return;
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': adminToken },
    });
    if (res.ok) {
      await Promise.all([fetchProducts(), fetchAdminContext(adminToken)]);
      showToast(`Product #${productId} deleted`);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: OrderStatus) => {
    if (!adminToken) return;
    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken,
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      await Promise.all([fetchAdminContext(adminToken), fetchUserContext(userToken)]);
      showToast(`Order #${orderId} marked ${status}`);
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1F1E1C]">
      <Header activePage={activePage} onNavigate={handleNavigate} cartCount={cartCount} />

      <main className="flex-1">
        {activePage === 'home' && (
          <HomeView
            products={products}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProductFromHome}
            onAddToCart={(id) => handleAddToCart(id, 1)}
          />
        )}

        {activePage === 'products' && (
          <ProductsView
            products={products}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedProduct={selectedProduct}
            onSelectProduct={setSelectedProduct}
            onAddToCart={handleAddToCart}
          />
        )}

        {activePage === 'cart' && (
          <CartView
            user={user}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onPlaceOrder={handlePlaceOrder}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'profile' && (
          <AuthProfileView
            user={user}
            orders={myOrders}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
          />
        )}

        {activePage === 'admin' && (
          <AdminPanelView
            adminName={adminName}
            stats={adminStats}
            products={products}
            orders={adminOrders}
            onAdminLogin={handleAdminLogin}
            onAdminLogout={handleAdminLogout}
            onCreateProduct={handleCreateProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {activePage === 'java' && <JavaSourceView />}
      </main>

      <Footer onNavigate={handleNavigate} />

      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 px-4 py-3 text-xs font-semibold text-white bg-[#1F1E1C] rounded-md shadow-lg"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
