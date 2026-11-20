-- =====================================================
-- Bathroom Ware & Homeware E-Commerce Database Schema
-- MySQL 8.0+ | College Mini Project
-- =====================================================

CREATE DATABASE IF NOT EXISTS bathware_homeware_db;
USE bathware_homeware_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Admin Table
CREATE TABLE IF NOT EXISTS admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(60) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    full_name VARCHAR(100) NOT NULL
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    category_group ENUM('Bathroom Ware', 'Homeware') NOT NULL,
    category VARCHAR(80) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Cart Table
CREATE TABLE IF NOT EXISTS cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 6. Order Details Table
CREATE TABLE IF NOT EXISTS order_details (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- =====================================================
-- Seed Default Admin, Demo Customer & Sample Products
-- =====================================================

INSERT INTO admin (username, password, full_name)
VALUES ('admin', 'admin123', 'Store Administrator');

INSERT INTO users (full_name, email, password, phone, address)
VALUES ('Aarav Mehta', 'aarav@example.com', '123456', '9876543210', '24 Stonebridge Road, Ahmedabad, Gujarat 380015');

INSERT INTO products (product_name, category_group, category, price, description, image_url, is_featured) VALUES
('Travertine Ceramic Vessel Basin', 'Bathroom Ware', 'Wash Basins', 4850.00, 'Hand-glazed matte white ceramic countertop vessel wash basin with smooth rounded edges and easy-clean finish.', 'images/wash-basin.jpg', TRUE),
('Brushed Nickel Tall Mixer Faucet', 'Bathroom Ware', 'Faucets', 3290.00, 'Solid brass single-lever tall basin mixer tap in warm brushed nickel finish with ceramic disc cartridge.', 'images/faucet.jpg', TRUE),
('Architectural Square Rain Shower', 'Bathroom Ware', 'Showers', 5400.00, '250mm ultra-slim stainless steel overhead rainfall shower head with thermostatic wall mixer control.', 'images/rain-shower.jpg', TRUE),
('Matte Beige 4-Piece Bath Set', 'Bathroom Ware', 'Bathroom Accessories', 1490.00, 'Coordinated stoneware soap dispenser, ribbed tumbler, soap dish, and stone vanity tray.', 'images/bath-accessories.jpg', TRUE),
('Stoneware Olive Oil Cruet & Salt Box', 'Homeware', 'Kitchen Accessories', 1250.00, 'Matte cream ceramic oil bottle paired with a turned ash-wood salt cellar and ribbed utensil crock.', 'images/kitchen-accessories.jpg', TRUE),
('Sculptural Ceramic Vase & Candle Duo', 'Homeware', 'Home Decor', 1890.00, 'Two organic matte off-white stoneware vases paired with a hand-carved travertine candle vessel.', 'images/home-decor.jpg', TRUE),
('Woven Cotton & Glass Storage Set', 'Homeware', 'Storage Products', 1650.00, 'Breathable braided cotton utility basket with three airtight glass jars and solid oak lids.', 'images/storage-cleaning.jpg', FALSE),
('Natural Beechwood Cleaning Brush Kit', 'Homeware', 'Cleaning Products', 890.00, 'Four-piece sustainable beechwood and tampico-bristle scrub brush set for kitchen and bath surfaces.', 'images/storage-cleaning.jpg', FALSE);
