-- =====================================================================
-- database/database.sql   (Restaurant Management System)
-- Web Development Lab (Part 2)  -  Section 5: Introduction to MySQL
--
-- 5e - THIS FILE IS THE database.sql THAT INTEGRATES THE DATABASE INTO THE API.
--      The backend (backend/db.js) connects to the database created here.
--      Import it with:   mysql -u root -p < database/database.sql
--      or inside the MySQL Command Line Client:   SOURCE database/database.sql;
--
-- 5d - THIS IS A SCRIPT FILE FOR MYSQL WORKBENCH.
--      In Workbench: File > Open SQL Script > pick this file > run it with the
--      lightning-bolt button (Execute). Saving it as a .sql script = 5d.
--
-- Demo passwords are stored as salted scrypt hashes (see backend/password.js).
-- =====================================================================


-- =====================================================================
-- 5a - CREATE A DATABASE AND A TABLE INSIDE IT (MySQL Command Line Client)
-- In the MySQL Command Line Client you would type exactly these lines:
--     CREATE DATABASE restaurant_db;
--     USE restaurant_db;
--     CREATE TABLE users ( ... );
-- NOTE: the script starts with DROP DATABASE IF EXISTS, so re-running it resets the demo data.
-- =====================================================================
DROP DATABASE IF EXISTS restaurant_db;
CREATE DATABASE restaurant_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE restaurant_db;

-- Users table: one row for every login (Customer, Manager, Counter, Cashier, Waiter, Kitchen)
CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(80)  NOT NULL,
  username      VARCHAR(40)  NOT NULL UNIQUE,
  password_hash VARCHAR(200) NOT NULL,
  role          ENUM('Customer','Manager','Counter','Cashier','Waiter','Kitchen') NOT NULL,
  phone         VARCHAR(20)  NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =====================================================================
-- 5b - QUERIES TO CREATE TABLES, INSERT DATA AND UPDATE DATA
-- (CREATE TABLE below, INSERT INTO further down, UPDATE statements at the end)
-- =====================================================================

-- Menu items (CRUD target for the Manager dashboard)
CREATE TABLE menu_items (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  category    VARCHAR(40)   NOT NULL,
  description VARCHAR(255)  NULL,
  price       DECIMAL(8,2)  NOT NULL,
  available   TINYINT(1)    NOT NULL DEFAULT 1
);

-- Dining tables inside the restaurant (assigned to waiters)
CREATE TABLE restaurant_tables (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  table_number INT NOT NULL UNIQUE,
  seats        INT NOT NULL DEFAULT 4,
  status       ENUM('Free','Occupied') NOT NULL DEFAULT 'Free',
  waiter_id    INT NULL,
  CONSTRAINT fk_table_waiter FOREIGN KEY (waiter_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Orders: status flows Placed -> Preparing -> Ready -> Served -> Paid
CREATE TABLE orders (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  customer_id    INT NULL,                      -- NULL for walk-in orders taken by Counter/Waiter
  customer_name  VARCHAR(80) NULL,              -- name for walk-in customers
  order_type     ENUM('Dine-in','Takeaway','Parcel','Home Delivery') NOT NULL,
  table_id       INT NULL,                      -- required for Dine-in
  address        VARCHAR(255) NULL,             -- required for Home Delivery
  status         ENUM('Placed','Preparing','Ready','Served','Paid') NOT NULL DEFAULT 'Placed',
  total          DECIMAL(10,2) NOT NULL DEFAULT 0,
  placed_by      INT NULL,                      -- the staff/customer user who placed it
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_order_table    FOREIGN KEY (table_id)    REFERENCES restaurant_tables(id) ON DELETE SET NULL,
  CONSTRAINT fk_order_placedby FOREIGN KEY (placed_by)   REFERENCES users(id) ON DELETE SET NULL
);

-- Items inside each order
CREATE TABLE order_items (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  order_id     INT NOT NULL,
  menu_item_id INT NOT NULL,
  quantity     INT NOT NULL DEFAULT 1,
  unit_price   DECIMAL(8,2) NOT NULL,
  CONSTRAINT fk_oi_order FOREIGN KEY (order_id)     REFERENCES orders(id)     ON DELETE CASCADE,
  CONSTRAINT fk_oi_menu  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- Payments made by the Cashier
CREATE TABLE payments (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  order_id   INT NOT NULL UNIQUE,
  amount     DECIMAL(10,2) NOT NULL,
  method     ENUM('Cash','Card','UPI') NOT NULL,
  cashier_id INT NULL,
  paid_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pay_order   FOREIGN KEY (order_id)   REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_pay_cashier FOREIGN KEY (cashier_id) REFERENCES users(id)  ON DELETE SET NULL
);

-- ---------- 5b: INSERT the demo data ----------
-- Demo logins (passwords are listed in README.md)
INSERT INTO users (name, username, password_hash, role, phone) VALUES
 ('Meera Manager',   'manager',   'f79f18ad586503f152f03fc86834eadb:3ff242655a4a747eae924bb2338f2a51a23d8d90c3faee14fbc1abecae503c91', 'Manager',  '9000000001'),
 ('Chandu Counter',  'counter',   '7843fa7c53d49119a429b0ca7a154c50:5d5284d0aa0ef88c70c092a08cf1c3b63014ab0b1d5a20136783660feaa0b678', 'Counter',  '9000000002'),
 ('Kavya Cashier',   'cashier',   '6a66a45058176de184a2934ff4efb556:3178b3b56be763469103eb766ba88aa3cbea8e552f3269b91c90136021ad5a51', 'Cashier',  '9000000003'),
 ('Wasim Waiter',    'waiter1',   'd054ae164ba632446339091799b2e0d6:8ed2372e82802ca7c2f2f88fefa40d282b76cc82d3b279776e3f2d2508462d6b', 'Waiter',   '9000000004'),
 ('Wilma Waiter',    'waiter2',   'f3b61da0098862a399d08b5416e3305f:fd20b918a3e5ffd49d80fc89ce3c5377ed99dab3bb92100ec12d49732a30ecf2', 'Waiter',   '9000000005'),
 ('Kiran Kitchen',   'kitchen',   '5865d8bf5feeb5be96ec78590ea8a30d:dbaf40a067bcf3f027c5443bfb56ebd97be0ac7cc7e99a3386791a5d285f0c95', 'Kitchen',  '9000000006'),
 ('Charan Customer', 'customer',  'b30f548670f7ed33195c971b190dab37:12632fca467d7a265a9a64f64fdf514f583968df740e7532d844c0f8b3e1daea', 'Customer', '9000000007'),
 ('Chitra Customer', 'customer2', 'b3b9ba7ed1bf1530ca558e7d128a8be0:7cff4bca31206192ef92795b26b7bd3bd8033b3a996e46141983450c1458e872', 'Customer', '9000000008');

INSERT INTO menu_items (name, category, description, price, available) VALUES
 ('Paneer Butter Masala', 'Main Course', 'Creamy tomato gravy with paneer cubes',      220.00, 1),
 ('Chicken Biryani',      'Main Course', 'Hyderabadi style dum biryani',               250.00, 1),
 ('Veg Fried Rice',       'Main Course', 'Wok tossed rice with vegetables',            160.00, 1),
 ('Butter Naan',          'Breads',      'Soft tandoor naan with butter',               40.00, 1),
 ('Garlic Naan',          'Breads',      'Naan topped with garlic and coriander',       50.00, 1),
 ('Gobi Manchurian',      'Starters',    'Crispy cauliflower in spicy sauce',          140.00, 1),
 ('Chicken 65',           'Starters',    'Spicy deep fried chicken bites',             180.00, 1),
 ('Tomato Soup',          'Starters',    'Hot tomato soup with croutons',               90.00, 1),
 ('Gulab Jamun',          'Desserts',    'Two pieces with warm sugar syrup',            70.00, 1),
 ('Ice Cream Sundae',     'Desserts',    'Vanilla ice cream with chocolate sauce',     110.00, 1),
 ('Masala Chai',          'Beverages',   'Indian spiced tea',                           30.00, 1),
 ('Fresh Lime Soda',      'Beverages',   'Sweet or salted lime soda',                   50.00, 1),
 ('Cold Coffee',          'Beverages',   'Chilled coffee with ice cream',               90.00, 0);

-- 6 tables; waiter1 (id 4) gets tables 1-3, waiter2 (id 5) gets tables 4-6
INSERT INTO restaurant_tables (table_number, seats, status, waiter_id) VALUES
 (1, 2, 'Free', 4), (2, 4, 'Occupied', 4), (3, 4, 'Free', 4),
 (4, 4, 'Free', 5), (5, 6, 'Free', 5), (6, 8, 'Free', 5);

-- Sample orders so every dashboard has something to show
INSERT INTO orders (customer_id, customer_name, order_type, table_id, address, status, total, placed_by) VALUES
 (7,    'Charan Customer', 'Dine-in',       2,    NULL,                         'Preparing', 530.00, 4),
 (7,    'Charan Customer', 'Takeaway',      NULL, NULL,                         'Ready',     270.00, 7),
 (8,    'Chitra Customer', 'Home Delivery', NULL, '12-3, Gandhi Nagar, Ananthapur', 'Placed',  400.00, 8),
 (NULL, 'Walk-in Guest',   'Parcel',        NULL, NULL,                         'Served',    340.00, 2),
 (8,    'Chitra Customer', 'Dine-in',       3,    NULL,                         'Paid',      250.00, 5);

INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price) VALUES
 (1, 1, 1, 220.00), (1, 2, 1, 250.00), (1, 4, 1, 40.00),  (1, 11, 1, 30.00),
 (2, 3, 1, 160.00), (2, 6, 1, 140.00),
 (3, 2, 1, 250.00), (3, 7, 1, 180.00),
 (4, 1, 1, 220.00), (4, 5, 1, 50.00),  (4, 8, 1, 90.00),
 (5, 2, 1, 250.00);

-- Fix the sample totals so they match their items (this is also an UPDATE example for 5b)
UPDATE orders o
   SET o.total = (SELECT SUM(oi.quantity * oi.unit_price) FROM order_items oi WHERE oi.order_id = o.id);

INSERT INTO payments (order_id, amount, method, cashier_id) VALUES
 (5, 250.00, 'UPI', 3);

-- ---------- 5b: UPDATE the data in the table ----------
-- Example: raise the price of Masala Chai, and mark Cold Coffee as available.
UPDATE menu_items SET price = 35.00 WHERE name = 'Masala Chai';
UPDATE menu_items SET available = 1 WHERE name = 'Cold Coffee';


-- =====================================================================
-- 5c - SUBQUERIES (run these in the MySQL Command Line Client)
-- Each query below uses a subquery (a SELECT inside another query).
-- =====================================================================

-- 5c.1  Menu items that cost MORE than the average menu price
SELECT name, price
FROM menu_items
WHERE price > (SELECT AVG(price) FROM menu_items);

-- 5c.2  Customers who have placed at least one order (subquery with IN)
SELECT name, username
FROM users
WHERE id IN (SELECT DISTINCT customer_id FROM orders WHERE customer_id IS NOT NULL);

-- 5c.3  Orders whose total is higher than the average order total
SELECT id, order_type, total
FROM orders
WHERE total > (SELECT AVG(total) FROM orders);

-- 5c.4  Menu items that have NEVER been ordered (NOT EXISTS)
SELECT m.name
FROM menu_items m
WHERE NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.menu_item_id = m.id);

-- 5c.5  Most ordered dish (subquery in FROM)
SELECT m.name, t.qty
FROM (SELECT menu_item_id, SUM(quantity) AS qty FROM order_items GROUP BY menu_item_id) t
JOIN menu_items m ON m.id = t.menu_item_id
ORDER BY t.qty DESC
LIMIT 1;

-- =====================================================================
-- Final check query: shows the tables that were created (5a)
-- =====================================================================
SHOW TABLES;
