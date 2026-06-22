# Ecommerce (MERN Stack)

A full-stack ecommerce application built with **MERN**:
- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Frontend**: React (Create React App) + Redux Toolkit

---

## Project Structure

```
.
├─ backend/
│  ├─ app.js
│  ├─ server.js
│  ├─ config/
│  │  └─ config.env
│  ├─ controllers/
│  ├─ middlewares/
│  ├─ models/
│  ├─ routes/
│  └─ utils/
└─ frontend/
   └─ src/
      ├─ App.js
      ├─ store.js
      ├─ slices/
      └─ components/
```

---

## Tech Stack

- **Backend**: Express, Mongoose, JWT (cookie-based), Nodemailer
- **Frontend**: React, React Router, Redux Toolkit, Axios

---

## Prerequisites

1. **Node.js** installed
2. **MongoDB** running locally (default config uses localhost)

---

## Environment Variables (Backend)

Edit:
`backend/config/config.env`

Required keys (as currently used):

- `PORT=8000`
- `NODE_ENV=development`
- `DB_LOCAL_URI=mongodb://localhost:27017/ecommerce`
- `JWT_SECRET=...`
- `JWT_EXPIRES_TIME=7d`
- `COOKIE_EXPIRES_TIME=7`

Mail (Mailtrap SMTP) for password reset emails:
- `SMTP_HOST=sandbox.smtp.mailtrap.io`
- `SMTP_PORT=2525`
- `SMTP_USER=...`
- `SMTP_PASS=...`
- `SMTP_FROM_NAME=...`
- `SMTP_FROM_EMAIL=...`

---

## Backend Setup

From the repository root:

```bash
npm install
```

Run backend (development):

```bash
npm run dev
```

- Backend listens on: `http://localhost:8000`
- API base path: `/api/v1/`

### Seeder
(Optional) Populate demo data:

```bash
npm run seeder
```

---

## Frontend Setup

From the `frontend` folder:

```bash
cd frontend
npm install
npm start
```

- Frontend runs on: `http://localhost:3000`
- CRA proxy is set to: `http://127.0.0.1:8000`

---

## API Overview

All routes are mounted under:
`/api/v1/`

### Products
- `GET  /products` (supports query features via `APIFeatures`: search/filter/paginate)
- `GET  /product/:id`
- `PUT  /product/:id`
- `DELETE /product/:id`

**Reviews**
- `PUT  /review` (auth required)
- `GET  /reviews?id=<productId>`
- `DELETE /review` (expects `productId` and `id` as query params)

**Admin Products**
- `POST /admin/products/new` (auth + admin)

### Auth
- `POST /register`
- `POST /login`
- `GET  /logout`
- `POST /password/forgot`
- `POST /password/reset/:token`

**User profile**
- `GET  /myprofile` (auth required)
- `PUT  /password/change` (auth required)
- `PUT  /update` (auth required)

**Admin Users**
- `GET  /admin/users`
- `GET  /admin/user/:id`
- `PUT  /admin/user/:id`
- `DELETE /admin/user/:id`

### Orders
- `POST /order/new` (auth required)
- `GET  /order/:id` (auth required)
- `GET  /myorders` (auth required)

**Admin Orders**
- `GET  /admin/orders`
- `PUT  /admin/orders/:id` (updates status + stock when delivered)
- `DELETE /admin/orders/:id`

---

## Notes

- The backend uses **JWT stored in an HTTP-only cookie** (see `authController` and `logoutUser`).
- Product reviews and order delivery logic rely on MongoDB document updates.

---

## Running Locally (Typical Flow)

1. Start MongoDB
2. Start backend:
   - `npm run dev`
3. Start frontend:
   - `cd frontend && npm start`
4. Open: `http://localhost:3000`

---

If you want, you can further enhance this README with screenshots and example request/response payloads for the main endpoints.
