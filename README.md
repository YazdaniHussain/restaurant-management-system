# Spice Garden - Restaurant Management System
**Web Development Lab (Part 2) - one full-stack project covering all 25 items, 1a to 5e**

## 1. Tech stack (versions chosen for this project)

| Part | Technology | Version |
|---|---|---|
| Runtime | Node.js | 22 LTS (22.x) |
| Frontend | React / React DOM | 18.3.1 |
| Frontend routing | react-router-dom | 6.28.0 |
| Frontend tooling | Vite + @vitejs/plugin-react | 5.4.11 + 4.3.4 |
| Backend | Express.js | 4.21.2 |
| DB driver | mysql2 | 3.11.5 |
| Other backend packages | cors 2.8.5, dotenv 16.4.7 | - |
| Database | MySQL Community Server | 8.4 LTS (8.0 also works) |
| Languages | HTML, CSS, JavaScript (ES2022) | - |

Passwords are hashed with Node's built-in `crypto.scrypt` (no extra package).

## 2. Where each syllabus item appears

| Item | What it is | File / page / component |
|---|---|---|
| **1a** | Link JS file with HTML | `frontend/index.html` (script tag -> `src/main.jsx`) and `frontend/public/lab/index.html` (script tag -> `script.js`) |
| **1b** | Select elements with selectors | `frontend/public/lab/script.js` (section 1b: getElementById, getElementsByClassName, querySelector, querySelectorAll) |
| **1c** | Event listeners | `frontend/public/lab/script.js` (section 1c: input, keydown, mouseover, mouseout) |
| **1d** | Button click events | `frontend/public/lab/script.js` (section 1d: inline onclick, property onclick, addEventListener) |
| **1e** | Declaration / definition / arrow functions | `frontend/public/lab/script.js` (section 1e) |
| **2a** | Counter, class component | `src/components/GuestCounter.jsx` (guests on Dine-in order form) and `src/lab/ClassCounter.jsx` |
| **2b** | Counter, functional component | `src/components/QuantityCounter.jsx` (menu cards) and `src/lab/FunctionalCounter.jsx` |
| **2c** | Button click events in functional component | `QuantityCounter.jsx`, `Navbar.jsx` (logout), dashboards (serve / prepare buttons), `lab/FunctionalCounter.jsx` |
| **2d** | Conditional rendering | `ProtectedRoute.jsx`, `LoginPage.jsx` (error), `OrderForm.jsx` (table / address fields), dashboards, `lab/ConditionalDemo.jsx` |
| **2e** | String literals | `Navbar.jsx` (welcome text), `OrderCard.jsx`, `OrderForm.jsx`, `lab/StringLiteralDemo.jsx` |
| **3a** | Counter with useState | `src/components/MenuCard.jsx` (quantity state), `src/lab/HooksCounter.jsx` |
| **3b** | useEffect API fetch | `MenuList.jsx`, `OrdersPanel.jsx`, `AuthContext.jsx`, `WaiterDashboard.jsx`, `lab/ApiFetchDemo.jsx` |
| **3c** | Two components sharing data with Props | `MenuList -> MenuCard -> QuantityCounter`, `OrderCard`, `StatusBadge`, `lab/PropsDemo.jsx` |
| **3d** | Forms in React | `LoginPage.jsx`, `OrderForm.jsx`, Manager menu/staff forms, `lab/FormDemo.jsx` |
| **3e** | Iterative rendering with map() | `MenuList.jsx`, `Cart.jsx`, `OrderCard.jsx`, `OrdersPanel.jsx`, manager tables, `lab/MapDemo.jsx` |
| **4a** | Express hello world route | `backend/routes/helloRoutes.js` -> `GET /hello` |
| **4b** | Small website, multiple routes | `backend/routes/helloRoutes.js` -> `/site`, `/site/about`, `/site/menu`, `/site/contact` |
| **4c** | hello world in browser console | `backend/routes/helloRoutes.js` -> `GET /hello-console` (open, press F12) |
| **4d** | CRUD with Express | `routes/menuRoutes.js`, `staffRoutes.js`, `tableRoutes.js`, `orderRoutes.js`, `paymentRoutes.js` |
| **4e** | API <-> MySQL connection | `backend/db.js` (mysql2 pool) used by every route |
| **5a** | Create database + table (CLI) | `database/database.sql` section 5a (`CREATE DATABASE`, `CREATE TABLE users`) |
| **5b** | Create table, insert, update | `database/database.sql` section 5b (other tables, `INSERT INTO`, `UPDATE`) |
| **5c** | Subqueries | `database/database.sql` section 5c (5 queries) and `backend/routes/reportRoutes.js` |
| **5d** | Script file in MySQL Workbench | `database/database.sql` (open with File > Open SQL Script, then Execute) |
| **5e** | database folder + database.sql for the API | `database/database.sql` + `backend/db.js` |

The **Lab Demo page** (`http://localhost:5173/lab`, no login) shows 1a-5e working on their own.

## 3. Folder structure

```
restaurant-lab/
  README.md
  database/database.sql
  backend/
    package.json  .env.example  server.js  db.js  auth.js  password.js  labels.js
    routes/ authRoutes.js helloRoutes.js menuRoutes.js staffRoutes.js tableRoutes.js
            orderRoutes.js paymentRoutes.js reportRoutes.js
  frontend/
    package.json  vite.config.js  index.html
    public/lab/ index.html  script.js  lab-labels.js         (1a-1e standalone)
    src/
      main.jsx  App.jsx  api.js  styles.css
      labels/labels.js
      context/AuthContext.jsx
      components/ Navbar ProtectedRoute StatusBadge QuantityCounter GuestCounter MenuCard
                  MenuList Cart OrderCard OrdersPanel OrderForm   (.jsx)
      pages/ LoginPage Customer/Manager/Counter/Cashier/Waiter/Kitchen Dashboard LabDemoPage (.jsx)
      lab/ ClassCounter FunctionalCounter ConditionalDemo StringLiteralDemo HooksCounter
           ApiFetchDemo PropsDemo FormDemo MapDemo (.jsx)
```

## 4. Run it

Install Node.js 22 and MySQL 8.4 first.

```bash
# 1) Import the database (creates restaurant_db with tables and demo data)
mysql -u root -p < database/database.sql
#    or inside the MySQL Command Line Client:  SOURCE database/database.sql;
#    or in MySQL Workbench: File > Open SQL Script > database/database.sql > Execute

# 2) Backend
cd backend
npm install
cp .env.example .env          # Windows: copy .env.example .env   -> then put your MySQL password in .env
npm start                     # API on http://localhost:5000

# 3) Frontend (new terminal)
cd frontend
npm install
npm run dev                   # App on http://localhost:5173
```

Open http://localhost:5173 - the login page is the start page.

## 5. Demo logins

| Role | Username | Password |
|---|---|---|
| Manager | `manager` | `manager123` |
| Counter | `counter` | `counter123` |
| Cashier | `cashier` | `cashier123` |
| Waiter | `waiter1` (tables 1-3) / `waiter2` (tables 4-6) | `waiter123` |
| Kitchen Staff | `kitchen` | `kitchen123` |
| Customer | `customer` / `customer2` | `customer123` |

Choose the matching role in the dropdown on the login page.

## 6. How the order flow works

`Placed` (customer / counter / waiter) -> `Preparing` (kitchen) -> `Ready` (kitchen) -> `Served` (waiter for dine-in, counter for any type) -> `Paid` (cashier).
Dine-in needs a table, Home Delivery needs an address. Role-based routing exists in the browser (`ProtectedRoute.jsx`) and in the API (`requireRole` in `backend/auth.js`).

## 7. Labels (turn on / off)

Both label files work the same way and are **OFF by default** (the project looks normal, no extra console output).

| File | Line to change |
|---|---|
| `frontend/src/labels/labels.js` | `/* ===== LABELS BLOCK START (frontend) ...` |
| `backend/labels.js` | `/* ===== LABELS BLOCK START (backend) ...` |

**Turn ON:** add two slashes at the start of that line so it begins with `//*` instead of `/*`. The last line of the block (`//*/`) stays as it is.
**Turn OFF:** change `//*` back to `/*`.

**Test the frontend:** edit `frontend/src/labels/labels.js`, save, refresh the browser. Small amber tags like "Included here: 2c - Button click event in functional component" appear next to features. Switch it off and refresh: tags disappear.
**Test the backend:** edit `backend/labels.js`, restart `npm start`. The console prints lines such as `Included here: 4d - CRUD operations   [menuRoutes.js - READ (GET /api/menu)]`. Items 4e and 5a-5e print once when the server connects to MySQL.
The helpers never throw, so both states run without errors.
For the standalone page `/lab/index.html`, labels appear when the frontend block is on (use `npm run dev`).

## 8. Final checklist (all 25 present)

- [x] 1a - `index.html` and `public/lab/index.html` script tags
- [x] 1b - `public/lab/script.js` selectors
- [x] 1c - `public/lab/script.js` event listeners
- [x] 1d - `public/lab/script.js` button clicks
- [x] 1e - `public/lab/script.js` three function types
- [x] 2a - `GuestCounter.jsx`, `lab/ClassCounter.jsx`
- [x] 2b - `QuantityCounter.jsx`, `lab/FunctionalCounter.jsx`
- [x] 2c - click handlers in `QuantityCounter.jsx`, `Navbar.jsx`, dashboards
- [x] 2d - `ProtectedRoute.jsx`, `OrderForm.jsx`, `lab/ConditionalDemo.jsx`
- [x] 2e - template literals in `Navbar.jsx`, `lab/StringLiteralDemo.jsx`
- [x] 3a - `MenuCard.jsx`, `lab/HooksCounter.jsx`
- [x] 3b - `MenuList.jsx`, `OrdersPanel.jsx`, `lab/ApiFetchDemo.jsx`
- [x] 3c - `MenuCard -> QuantityCounter`, `lab/PropsDemo.jsx`
- [x] 3d - `LoginPage.jsx`, `OrderForm.jsx`, `lab/FormDemo.jsx`
- [x] 3e - `MenuList.jsx`, `Cart.jsx`, `lab/MapDemo.jsx`
- [x] 4a - `GET /hello`
- [x] 4b - `/site` routes
- [x] 4c - `/hello-console`
- [x] 4d - CRUD in the route files
- [x] 4e - `backend/db.js`
- [x] 5a - `database.sql` 5a section
- [x] 5b - `database.sql` 5b section
- [x] 5c - `database.sql` 5c section, `reportRoutes.js`
- [x] 5d - `database.sql` opened in Workbench
- [x] 5e - `database/` folder + `database.sql` + `db.js`

## 9. Viva tips

1. **Start with the flow**: login -> role dashboard -> order -> kitchen -> serve -> cashier. Then say which item each step shows.
2. **Switch the labels on** during the demo; every feature then names its syllabus item.
3. **Class vs functional counter**: class uses `this.state` and `setState` (GuestCounter); functional uses `useState` (MenuCard). Same idea, different syntax.
4. **Props**: data flows one way, parent to child (`MenuCard` passes `value` and `onChange` to `QuantityCounter`).
5. **useEffect with `[]`** runs once after the first render; that is why the menu is fetched there.
6. **CRUD mapping**: POST = Create, GET = Read, PUT = Update, DELETE = Delete (show the Manager menu page).
7. **Express and MySQL**: `db.js` creates a mysql2 pool, routes call `pool.query(sql, [values])`. The `?` placeholders prevent SQL injection.
8. **Subquery**: "dishes priced above the average" uses `(SELECT AVG(price) ...)` inside the WHERE clause.
9. **Security point**: passwords are stored hashed, and routes check the role on the server, so changing the URL in the browser does not give access.
