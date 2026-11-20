import crypto from 'crypto';
import express from 'express';
import fs from 'fs';
import JSZip from 'jszip';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const PORT = 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');
const JAVA_PROJECT_DIR = path.resolve(process.cwd(), 'java-project');

interface StoredUser {
  userId: number;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

interface StoredAdmin {
  adminId: number;
  username: string;
  password: string;
  fullName: string;
}

interface StoredProduct {
  productId: number;
  productName: string;
  categoryGroup: 'Bathroom Ware' | 'Homeware';
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  featured: boolean;
}

interface StoredCartRow {
  cartId: number;
  userId: number;
  productId: number;
  quantity: number;
}

interface StoredOrderDetail {
  detailId: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface StoredOrder {
  orderId: number;
  userId: number;
  customerName: string;
  phone: string;
  shippingAddress: string;
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: string;
}

interface StoreData {
  users: StoredUser[];
  admin: StoredAdmin[];
  products: StoredProduct[];
  cart: StoredCartRow[];
  orders: StoredOrder[];
  order_details: StoredOrderDetail[];
  nextIds: {
    user: number;
    product: number;
    cart: number;
    order: number;
    detail: number;
  };
}

const DEFAULT_DATA: StoreData = {
  users: [
    {
      userId: 1,
      fullName: 'Aarav Mehta',
      email: 'aarav@example.com',
      password: '123456',
      phone: '9876543210',
      address: '24 Stonebridge Road, Satellite, Ahmedabad, Gujarat 380015',
    },
    {
      userId: 2,
      fullName: 'Meera Kapoor',
      email: 'meera@example.com',
      password: '123456',
      phone: '9820145678',
      address: '14B Parkview Residency, Bandra West, Mumbai 400050',
    },
  ],
  admin: [
    {
      adminId: 1,
      username: 'admin',
      password: 'admin123',
      fullName: 'Store Administrator',
    },
  ],
  products: [
    {
      productId: 1,
      productName: 'Travertine Ceramic Vessel Basin',
      categoryGroup: 'Bathroom Ware',
      category: 'Wash Basins',
      price: 4850,
      description:
        'Hand-glazed matte white ceramic countertop vessel wash basin with soft rounded walls, anti-stain glaze, and standard 45mm waste opening.',
      imageUrl: '/src/assets/images/product_wash_basin_1795185639305.jpg',
      featured: true,
    },
    {
      productId: 2,
      productName: 'Brushed Nickel Tall Mixer Faucet',
      categoryGroup: 'Bathroom Ware',
      category: 'Faucets',
      price: 3290,
      description:
        'Solid lead-free brass single-lever tall basin mixer faucet in warm brushed nickel with 35mm European ceramic disc cartridge.',
      imageUrl: '/src/assets/images/product_wash_basin_1795185639305.jpg',
      featured: true,
    },
    {
      productId: 3,
      productName: 'Architectural Square Rain Shower',
      categoryGroup: 'Bathroom Ware',
      category: 'Showers',
      price: 5400,
      description:
        '250mm ultra-slim 304 stainless steel overhead rainfall shower head with precision thermostatic wall mixer valve and silicone nozzles.',
      imageUrl: '/src/assets/images/product_rain_shower_1795185639224.jpg',
      featured: true,
    },
    {
      productId: 4,
      productName: 'Matte Beige 4-Piece Bath Set',
      categoryGroup: 'Bathroom Ware',
      category: 'Bathroom Accessories',
      price: 1490,
      description:
        'Coordinated stoneware soap dispenser with brushed steel pump, ribbed tumbler, ceramic soap dish, and limestone vanity tray.',
      imageUrl: '/src/assets/images/product_bath_accessories_1795185639508.jpg',
      featured: true,
    },
    {
      productId: 5,
      productName: 'Stoneware Olive Oil Cruet & Salt Box',
      categoryGroup: 'Homeware',
      category: 'Kitchen Accessories',
      price: 1250,
      description:
        'Matte cream ceramic pouring cruet paired with an oiled ash-wood salt keeper and fluted stoneware utensil crock.',
      imageUrl: '/src/assets/images/product_kitchen_accessories_1795185639840.jpg',
      featured: true,
    },
    {
      productId: 6,
      productName: 'Sculptural Vase & Travertine Candle',
      categoryGroup: 'Homeware',
      category: 'Home Decor',
      price: 1890,
      description:
        'Two organic matte off-white stoneware vessels paired with a hand-turned natural travertine soy candle holder.',
      imageUrl: '/src/assets/images/product_home_decor_1795185639304.jpg',
      featured: true,
    },
    {
      productId: 7,
      productName: 'Braided Cotton & Glass Jar Set',
      categoryGroup: 'Homeware',
      category: 'Storage Products',
      price: 1650,
      description:
        'Heavyweight natural cotton rope storage basket bundled with three airtight borosilicate apothecary jars and oak lids.',
      imageUrl: '/src/assets/images/product_storage_cleaning_1795185639914.jpg',
      featured: false,
    },
    {
      productId: 8,
      productName: 'Beechwood Counter & Dish Brush Kit',
      categoryGroup: 'Homeware',
      category: 'Cleaning Products',
      price: 890,
      description:
        'Four-piece sustainable beechwood and natural tampico-fiber scrub brush set designed for ceramic basins and stone counters.',
      imageUrl: '/src/assets/images/product_storage_cleaning_1795185639914.jpg',
      featured: false,
    },
    {
      productId: 9,
      productName: 'Wall-Mounted Brushed Spout Faucet',
      categoryGroup: 'Bathroom Ware',
      category: 'Faucets',
      price: 3850,
      description:
        'Concealed wall-mounted bathroom spout and independent lever mixer crafted for architectural vessel wash basins.',
      imageUrl: '/src/assets/images/hero_bathroom_sanctuary_1795185636405.jpg',
      featured: false,
    },
    {
      productId: 10,
      productName: 'Fluted Limestone Vanity Organizer',
      categoryGroup: 'Bathroom Ware',
      category: 'Bathroom Accessories',
      price: 1120,
      description:
        'Water-sealed carved travertine vanity tray and minimalist brush cup sized for compact bathroom ledges.',
      imageUrl: '/src/assets/images/product_bath_accessories_1795185639508.jpg',
      featured: false,
    },
    {
      productId: 11,
      productName: 'Oval Minimalist Under-Counter Basin',
      categoryGroup: 'Bathroom Ware',
      category: 'Wash Basins',
      price: 4200,
      description:
        'Seamless vitreous china under-mount wash basin with thin rim geometry and high-durability satin white glaze.',
      imageUrl: '/src/assets/images/product_wash_basin_1795185639305.jpg',
      featured: false,
    },
    {
      productId: 12,
      productName: 'Hand-Thrown Ceramic Utensil Crock',
      categoryGroup: 'Homeware',
      category: 'Kitchen Accessories',
      price: 960,
      description:
        'Weighted pale grey stoneware countertop crock with horizontal ribbing, sized for wooden spoons and spatulas.',
      imageUrl: '/src/assets/images/product_kitchen_accessories_1795185639840.jpg',
      featured: false,
    },
  ],
  cart: [],
  orders: [
    {
      orderId: 1001,
      userId: 1,
      customerName: 'Aarav Mehta',
      phone: '9876543210',
      shippingAddress: '24 Stonebridge Road, Satellite, Ahmedabad, Gujarat 380015',
      totalAmount: 6340,
      status: 'Confirmed',
      orderDate: '2026-11-18T10:25:00.000Z',
    },
    {
      orderId: 1002,
      userId: 2,
      customerName: 'Meera Kapoor',
      phone: '9820145678',
      shippingAddress: '14B Parkview Residency, Bandra West, Mumbai 400050',
      totalAmount: 3140,
      status: 'Shipped',
      orderDate: '2026-11-19T14:10:00.000Z',
    },
  ],
  order_details: [
    {
      detailId: 1,
      orderId: 1001,
      productId: 1,
      productName: 'Travertine Ceramic Vessel Basin',
      quantity: 1,
      price: 4850,
    },
    {
      detailId: 2,
      orderId: 1001,
      productId: 4,
      productName: 'Matte Beige 4-Piece Bath Set',
      quantity: 1,
      price: 1490,
    },
    {
      detailId: 3,
      orderId: 1002,
      productId: 5,
      productName: 'Stoneware Olive Oil Cruet & Salt Box',
      quantity: 1,
      price: 1250,
    },
    {
      detailId: 4,
      orderId: 1002,
      productId: 6,
      productName: 'Sculptural Vase & Travertine Candle',
      quantity: 1,
      price: 1890,
    },
  ],
  nextIds: {
    user: 3,
    product: 13,
    cart: 1,
    order: 1003,
    detail: 5,
  },
};

function loadStore(): StoreData {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(DEFAULT_DATA, null, 2), 'utf-8');
    return structuredClone(DEFAULT_DATA);
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    return JSON.parse(raw) as StoreData;
  } catch {
    return structuredClone(DEFAULT_DATA);
  }
}

function saveStore(data: StoreData) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

const userSessions = new Map<string, number>();
const adminSessions = new Map<string, string>();

const BATHROOM_SET = new Set([
  'Bathroom Accessories',
  'Wash Basins',
  'Faucets',
  'Showers',
]);

function inferCategoryGroup(category: string): 'Bathroom Ware' | 'Homeware' {
  return BATHROOM_SET.has(category) ? 'Bathroom Ware' : 'Homeware';
}

function sanitizeUser(u: StoredUser) {
  return {
    userId: u.userId,
    fullName: u.fullName,
    email: u.email,
    phone: u.phone,
    address: u.address,
  };
}

function collectJavaFiles(dir: string, baseDir: string): Array<{
  path: string;
  name: string;
  content: string;
  category: string;
}> {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results: Array<{ path: string; name: string; content: string; category: string }> = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectJavaFiles(full, baseDir));
    } else {
      const rel = path.relative(baseDir, full).replace(/\\/g, '/');
      if (/\.(jpg|jpeg|png|gif|webp|ico)$/i.test(rel)) {
        continue;
      }
      let category = 'Config & CSS';
      if (rel.endsWith('.sql')) category = 'SQL';
      else if (rel.includes('/model/')) category = 'Java Model';
      else if (rel.includes('/servlet/') || rel.includes('/util/')) category = 'Java Servlet';
      else if (rel.endsWith('.jsp')) category = 'JSP View';
      else if (rel.endsWith('.md')) category = 'Guide';

      results.push({
        path: rel,
        name: entry.name,
        content: fs.readFileSync(full, 'utf-8'),
        category,
      });
    }
  }
  return results;
}

function addDirectoryToZip(zip: JSZip, dir: string, baseDir: string) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      addDirectoryToZip(zip, full, baseDir);
    } else {
      const rel = path.relative(baseDir, full).replace(/\\/g, '/');
      zip.file(`KlaraBathHome/${rel}`, fs.readFileSync(full));
    }
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  let store = loadStore();

  const getAuthUser = (req: express.Request): StoredUser | null => {
    const token = req.header('x-session-token');
    if (!token) return null;
    const userId = userSessions.get(token);
    if (!userId) return null;
    return store.users.find((u) => u.userId === userId) || null;
  };

  const getAuthAdmin = (req: express.Request): string | null => {
    const token = req.header('x-admin-token');
    if (!token) return null;
    return adminSessions.get(token) || null;
  };

  // --- Products API (Mirrors ProductServlet) ---
  app.get('/api/products', (req, res) => {
    const category = (req.query.category as string) || '';
    const search = ((req.query.search as string) || '').toLowerCase().trim();
    let list = [...store.products];

    if (category && category !== 'All') {
      list = list.filter(
        (p) => p.category === category || p.categoryGroup === category
      );
    }
    if (search) {
      list = list.filter(
        (p) =>
          p.productName.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search)
      );
    }
    res.json(list);
  });

  app.get('/api/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const product = store.products.find((p) => p.productId === id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  // --- Auth API (Mirrors RegisterServlet, LoginServlet, LogoutServlet, ProfileServlet) ---
  app.post('/api/auth/register', (req, res) => {
    const { fullName, email, password, phone, address } = req.body || {};
    if (!fullName || !email || !password || String(password).length < 6) {
      return res.status(400).json({
        error: 'Full name, email, and a password of at least 6 characters are required.',
      });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    if (store.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }
    const newUser: StoredUser = {
      userId: store.nextIds.user++,
      fullName: String(fullName).trim(),
      email: cleanEmail,
      password: String(password),
      phone: String(phone || '').trim(),
      address: String(address || '').trim(),
    };
    store.users.push(newUser);
    saveStore(store);

    const token = crypto.randomUUID();
    userSessions.set(token, newUser.userId);
    res.status(201).json({ token, user: sanitizeUser(newUser) });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body || {};
    const cleanEmail = String(email || '').trim().toLowerCase();
    const user = store.users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === String(password || '')
    );
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const token = crypto.randomUUID();
    userSessions.set(token, user.userId);
    res.json({ token, user: sanitizeUser(user) });
  });

  app.post('/api/auth/logout', (req, res) => {
    const token = req.header('x-session-token');
    if (token) userSessions.delete(token);
    res.json({ ok: true });
  });

  app.get('/api/auth/me', (req, res) => {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Not authenticated' });
    res.json({ user: sanitizeUser(user) });
  });

  app.put('/api/auth/profile', (req, res) => {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Not authenticated' });
    const { fullName, phone, address } = req.body || {};
    if (!fullName || !String(fullName).trim()) {
      return res.status(400).json({ error: 'Full name cannot be empty.' });
    }
    user.fullName = String(fullName).trim();
    user.phone = String(phone || '').trim();
    user.address = String(address || '').trim();
    saveStore(store);
    res.json({ user: sanitizeUser(user) });
  });

  // --- Cart API (Mirrors CartServlet) ---
  app.get('/api/cart', (req, res) => {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Please sign in to view your cart.' });
    const items = store.cart
      .filter((c) => c.userId === user.userId)
      .map((c) => ({
        ...c,
        product: store.products.find((p) => p.productId === c.productId),
      }))
      .filter((c) => Boolean(c.product));
    res.json(items);
  });

  app.post('/api/cart', (req, res) => {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Please sign in to add items to your cart.' });
    const productId = Number(req.body?.productId);
    const quantity = Math.max(1, Number(req.body?.quantity || 1));

    const product = store.products.find((p) => p.productId === productId);
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    const existing = store.cart.find(
      (c) => c.userId === user.userId && c.productId === productId
    );
    if (existing) {
      existing.quantity += quantity;
    } else {
      store.cart.push({
        cartId: store.nextIds.cart++,
        userId: user.userId,
        productId,
        quantity,
      });
    }
    saveStore(store);
    res.status(201).json({ ok: true });
  });

  app.put('/api/cart/:cartId', (req, res) => {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Not authenticated.' });
    const cartId = Number(req.params.cartId);
    const quantity = Number(req.body?.quantity);
    const index = store.cart.findIndex(
      (c) => c.cartId === cartId && c.userId === user.userId
    );
    if (index === -1) return res.status(404).json({ error: 'Cart item not found.' });

    if (quantity <= 0) {
      store.cart.splice(index, 1);
    } else {
      store.cart[index].quantity = quantity;
    }
    saveStore(store);
    res.json({ ok: true });
  });

  app.delete('/api/cart/:cartId', (req, res) => {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Not authenticated.' });
    const cartId = Number(req.params.cartId);
    store.cart = store.cart.filter(
      (c) => !(c.cartId === cartId && c.userId === user.userId)
    );
    saveStore(store);
    res.json({ ok: true });
  });

  // --- Orders API (Mirrors OrderServlet) ---
  app.post('/api/orders', (req, res) => {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Please sign in to place an order.' });
    const { phone, shippingAddress } = req.body || {};
    if (!phone || !shippingAddress) {
      return res.status(400).json({ error: 'Phone number and delivery address are required.' });
    }

    const userCart = store.cart.filter((c) => c.userId === user.userId);
    if (userCart.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty.' });
    }

    let totalAmount = 0;
    const detailsToInsert: StoredOrderDetail[] = [];
    const orderId = store.nextIds.order++;

    for (const item of userCart) {
      const prod = store.products.find((p) => p.productId === item.productId);
      if (!prod) continue;
      totalAmount += prod.price * item.quantity;
      detailsToInsert.push({
        detailId: store.nextIds.detail++,
        orderId,
        productId: prod.productId,
        productName: prod.productName,
        quantity: item.quantity,
        price: prod.price,
      });
    }

    const newOrder: StoredOrder = {
      orderId,
      userId: user.userId,
      customerName: user.fullName,
      phone: String(phone).trim(),
      shippingAddress: String(shippingAddress).trim(),
      totalAmount,
      status: 'Pending',
      orderDate: new Date().toISOString(),
    };

    store.orders.unshift(newOrder);
    store.order_details.push(...detailsToInsert);
    store.cart = store.cart.filter((c) => c.userId !== user.userId);
    saveStore(store);

    res.status(201).json({ ...newOrder, details: detailsToInsert });
  });

  app.get('/api/orders/my', (req, res) => {
    const user = getAuthUser(req);
    if (!user) return res.status(401).json({ error: 'Not authenticated.' });
    const orders = store.orders
      .filter((o) => o.userId === user.userId)
      .map((o) => ({
        ...o,
        details: store.order_details.filter((d) => d.orderId === o.orderId),
      }));
    res.json(orders);
  });

  // --- Admin API (Mirrors AdminLoginServlet, AdminDashboardServlet, AdminProductServlet, AdminOrderServlet) ---
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body || {};
    const admin = store.admin.find(
      (a) => a.username === String(username || '').trim() && a.password === String(password || '')
    );
    if (!admin) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }
    const token = crypto.randomUUID();
    adminSessions.set(token, admin.fullName);
    res.json({ token, adminName: admin.fullName });
  });

  app.post('/api/admin/logout', (req, res) => {
    const token = req.header('x-admin-token');
    if (token) adminSessions.delete(token);
    res.json({ ok: true });
  });

  app.get('/api/admin/stats', (req, res) => {
    if (!getAuthAdmin(req)) return res.status(401).json({ error: 'Admin access required.' });
    res.json({
      totalProducts: store.products.length,
      totalOrders: store.orders.length,
      totalCustomers: store.users.length,
    });
  });

  app.post('/api/admin/products', (req, res) => {
    if (!getAuthAdmin(req)) return res.status(401).json({ error: 'Admin access required.' });
    const { productName, category, price, description, imageUrl, featured } = req.body || {};
    if (!productName || !category || !price || !description) {
      return res.status(400).json({ error: 'All product fields are required.' });
    }
    const created: StoredProduct = {
      productId: store.nextIds.product++,
      productName: String(productName).trim(),
      category: String(category).trim(),
      categoryGroup: inferCategoryGroup(String(category).trim()),
      price: Number(price),
      description: String(description).trim(),
      imageUrl: String(imageUrl || '/src/assets/images/product_wash_basin_1795185639305.jpg').trim(),
      featured: Boolean(featured),
    };
    store.products.unshift(created);
    saveStore(store);
    res.status(201).json(created);
  });

  app.put('/api/admin/products/:id', (req, res) => {
    if (!getAuthAdmin(req)) return res.status(401).json({ error: 'Admin access required.' });
    const id = Number(req.params.id);
    const prod = store.products.find((p) => p.productId === id);
    if (!prod) return res.status(404).json({ error: 'Product not found.' });

    const { productName, category, price, description, imageUrl, featured } = req.body || {};
    if (productName) prod.productName = String(productName).trim();
    if (category) {
      prod.category = String(category).trim();
      prod.categoryGroup = inferCategoryGroup(prod.category);
    }
    if (price !== undefined) prod.price = Number(price);
    if (description) prod.description = String(description).trim();
    if (imageUrl) prod.imageUrl = String(imageUrl).trim();
    if (featured !== undefined) prod.featured = Boolean(featured);

    saveStore(store);
    res.json(prod);
  });

  app.delete('/api/admin/products/:id', (req, res) => {
    if (!getAuthAdmin(req)) return res.status(401).json({ error: 'Admin access required.' });
    const id = Number(req.params.id);
    store.products = store.products.filter((p) => p.productId !== id);
    store.cart = store.cart.filter((c) => c.productId !== id);
    saveStore(store);
    res.json({ ok: true });
  });

  app.get('/api/admin/orders', (req, res) => {
    if (!getAuthAdmin(req)) return res.status(401).json({ error: 'Admin access required.' });
    const orders = store.orders.map((o) => ({
      ...o,
      details: store.order_details.filter((d) => d.orderId === o.orderId),
    }));
    res.json(orders);
  });

  app.put('/api/admin/orders/:orderId/status', (req, res) => {
    if (!getAuthAdmin(req)) return res.status(401).json({ error: 'Admin access required.' });
    const orderId = Number(req.params.orderId);
    const { status } = req.body || {};
    const order = store.orders.find((o) => o.orderId === orderId);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    order.status = status;
    saveStore(store);
    res.json(order);
  });

  // --- Java Source Files & Zip Download API ---
  app.get('/api/java-project/files', (_req, res) => {
    const files = collectJavaFiles(JAVA_PROJECT_DIR, JAVA_PROJECT_DIR);
    res.json(files);
  });

  app.get('/api/java-project/download', async (_req, res) => {
    try {
      const zip = new JSZip();
      addDirectoryToZip(zip, JAVA_PROJECT_DIR, JAVA_PROJECT_DIR);
      const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="KlaraBathHome-Java-Servlet-JSP.zip"'
      );
      res.send(buffer);
    } catch (err) {
      res.status(500).json({ error: 'Failed to generate project zip archive.' });
    }
  });

  // --- Vite / Static Serving ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Klara Bath & Home server running on http://localhost:${PORT}`);
  });
}

startServer();
