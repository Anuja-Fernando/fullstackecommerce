const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
    size: { type: String, required: true }
  }]
});

const User = mongoose.model('User', userSchema);

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  sizes: [String],
  image: { type: String, required: true },
  description: { type: String },
  inStock: { type: Boolean, default: true }
});

const Product = mongoose.model('Product', productSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Product Routes
app.get('/api/products', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sizes } = req.query;
    
    let filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    if (sizes) {
      const sizeArray = sizes.split(',');
      filter.sizes = { $in: sizeArray };
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cart Routes
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('cart.product');
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/cart', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;
    
    const user = await User.findById(req.user.userId);
    const existingItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId && item.size === size
    );

    if (existingItemIndex >= 0) {
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity, size });
    }

    await user.save();
    await user.populate('cart.product');
    
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/cart/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const { size } = req.query;
    
    const user = await User.findById(req.user.userId);
    user.cart = user.cart.filter(
      item => !(item.product.toString() === productId && item.size === size)
    );
    
    await user.save();
    await user.populate('cart.product');
    
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Favorites Routes
app.get('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/favorites/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    
    const user = await User.findById(req.user.userId);
    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }
    
    await user.populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/favorites/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;
    
    const user = await User.findById(req.user.userId);
    user.favorites = user.favorites.filter(id => id.toString() !== productId);
    await user.save();
    
    await user.populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Order Routes
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    
    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      
      orderItems.push({
        product: item.product,
        quantity: item.quantity,
        size: item.size,
        price: product.price
      });
    }
    
    const order = new Order({
      user: req.user.userId,
      items: orderItems,
      totalAmount,
      shippingAddress
    });
    
    await order.save();
    
    // Clear user's cart
    const user = await User.findById(req.user.userId);
    user.cart = [];
    await user.save();
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Seed some sample products
app.post('/api/seed-products', async (req, res) => {
  try {
    const sampleProducts = [
      {
        name: "Classic T-Shirt",
        price: 29.99,
        category: "Men",
        sizes: ["S", "M", "L", "XL"],
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
        description: "Comfortable cotton t-shirt perfect for everyday wear",
        inStock: true
      },
      {
        name: "Summer Dress",
        price: 59.99,
        category: "Women",
        sizes: ["S", "M", "L"],
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
        description: "Light and breezy summer dress for any occasion",
        inStock: true
      },
      {
        name: "Denim Jeans",
        price: 79.99,
        category: "Men",
        sizes: ["S", "M", "L", "XL", "XXL"],
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop",
        description: "Classic fit denim jeans with modern styling",
        inStock: true
      },
      {
        name: "Sports Shoes",
        price: 89.99,
        category: "Kids",
        sizes: ["S", "M", "L"],
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop",
        description: "Comfortable sports shoes for active kids",
        inStock: true
      },
      {
        name: "Leather Handbag",
        price: 49.99,
        category: "Women",
        sizes: ["One Size"],
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop",
        description: "Stylish leather handbag for the modern woman",
        inStock: true
      },
      {
        name: "Winter Jacket",
        price: 129.99,
        category: "Men",
        sizes: ["S", "M", "L", "XL"],
        image: "https://images.unsplash.com/photo-1551488831-00cbb60c37e5?w=400&h=500&fit=crop",
        description: "Warm and stylish winter jacket for cold weather",
        inStock: true
      },
      {
        name: "Formal Blazer",
        price: 149.99,
        category: "Men",
        sizes: ["S", "M", "L", "XL"],
        image: "https://images.unsplash.com/photo-1506765195374-56580ab4a7dd?w=400&h=500&fit=crop",
        description: "Professional formal blazer for business meetings",
        inStock: true
      },
      {
        name: "Ethnic Dress",
        price: 89.99,
        category: "Women",
        sizes: ["S", "M", "L"],
        image: "https://images.unsplash.com/photo-1594736797933-d0acc23f06d3?w=400&h=500&fit=crop",
        description: "Beautiful ethnic dress for special occasions",
        inStock: true
      }
    ];

    await Product.insertMany(sampleProducts);
    res.json({ message: 'Sample products seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
