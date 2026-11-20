export type CategoryGroup = 'Bathroom Ware' | 'Homeware';

export type ProductCategory =
  | 'Bathroom Accessories'
  | 'Wash Basins'
  | 'Faucets'
  | 'Showers'
  | 'Kitchen Accessories'
  | 'Home Decor'
  | 'Storage Products'
  | 'Cleaning Products';

export const BATHROOM_CATEGORIES: ProductCategory[] = [
  'Bathroom Accessories',
  'Wash Basins',
  'Faucets',
  'Showers',
];

export const HOMEWARE_CATEGORIES: ProductCategory[] = [
  'Kitchen Accessories',
  'Home Decor',
  'Storage Products',
  'Cleaning Products',
];

export const ALL_CATEGORIES: ProductCategory[] = [
  ...BATHROOM_CATEGORIES,
  ...HOMEWARE_CATEGORIES,
];

export interface Product {
  productId: number;
  productName: string;
  categoryGroup: CategoryGroup;
  category: ProductCategory;
  price: number;
  description: string;
  imageUrl: string;
  featured: boolean;
}

export interface User {
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

export interface CartItem {
  cartId: number;
  userId: number;
  productId: number;
  quantity: number;
  product?: Product;
}

export interface OrderDetail {
  detailId: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  orderId: number;
  userId: number;
  customerName: string;
  phone: string;
  shippingAddress: string;
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
  details: OrderDetail[];
}

export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
}

export interface JavaProjectFile {
  path: string;
  name: string;
  content: string;
  category: 'SQL' | 'Java Model' | 'Java Servlet' | 'JSP View' | 'Config & CSS' | 'Guide';
}
