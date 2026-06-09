# Full Stack Ecommerce Website

A complete full-stack ecommerce application built with React and Node.js.

## Features

- User Authentication (Register/Login)
- Product Catalog with Filtering
- Shopping Cart Management
- Favorites/Wishlist
- Order Management
- Responsive Design
- Modern UI with Material-UI

## Tech Stack

### Frontend
- React 19
- Material-UI
- Styled Components
- React Router
- Redux Toolkit
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB installed and running

### Installation

1. Clone the repository
2. Install dependencies for both client and server:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:

**Server (.env)**:
```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
MONGODB_URI=mongodb://localhost:27017/ecommerce
```

**Client (.env)**:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start MongoDB

5. Run the application:

```bash
# Start the server (from server directory)
npm run dev

# Start the client (from client directory)
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Products
- GET /api/products - Get all products (with filtering)
- GET /api/products/:id - Get single product
- POST /api/seed-products - Seed sample products

### Cart
- GET /api/cart - Get user's cart
- POST /api/cart - Add item to cart
- DELETE /api/cart/:productId - Remove item from cart

### Favorites
- GET /api/favorites - Get user's favorites
- POST /api/favorites/:productId - Add to favorites
- DELETE /api/favorites/:productId - Remove from favorites

### Orders
- POST /api/orders - Create new order
- GET /api/orders - Get user's orders

## Usage

1. **Register/Login**: Create an account or login to access all features
2. **Browse Products**: View products on the home page or shop page
3. **Filter Products**: Use filters on the shop page to find specific products
4. **Add to Cart**: Click the cart icon on product cards to add items
5. **Manage Favorites**: Click the heart icon to add products to favorites
6. **Checkout**: View cart and place orders

## Project Structure

```
fullstackecommerce/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utilities and API calls
│   │   └── App.js        # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── index.js          # Server entry point
│   ├── .env              # Environment variables
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit and push changes
5. Open a pull request

## License

This project is licensed under the ISC License.
