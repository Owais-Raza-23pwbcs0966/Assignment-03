const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://syedowaisraza06:M5399cznHt6wPknM@cluster0.8mxwu.mongodb.net/Assignment03?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Product Schema
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    specifications: [{
        type: String
    }]
}, {
    timestamps: true
});

// Cart Schema
const CartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }]
}, {
    timestamps: true
});

// Create Models
const Product = mongoose.model('Product', ProductSchema);
const Cart = mongoose.model('Cart', CartSchema);

// Validation Middleware
const validateProductExists = async (req, res, next) => {
    try {
        const productId = req.body.productId || req.params.productId;
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        req.product = product;
        next();
    } catch (error) {
        next(error);
    }
};

const validateCartInput = (req, res, next) => {
    const { userId, productId, quantity } = req.body;
    
    if (!userId || !productId || !quantity) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    
    if (quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be at least 1' });
    }
    
    next();
};

// PRODUCT ROUTES
// GET all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new product (for testing/admin)
app.post('/api/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// CART ROUTES
// GET user's cart
app.get('/api/cart', async (req, res) => {
    try {
        const userId = req.query.userId; // In production, get this from auth middleware
        const cart = await Cart.findOne({ userId }).populate('products.productId');
        
        if (!cart) {
            return res.json({ products: [], total: 0 });
        }

        const total = cart.products.reduce((sum, item) => {
            return sum + (item.productId.price * item.quantity);
        }, 0);

        res.json({ products: cart.products, total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST add product to cart
app.post('/api/cart', validateProductExists, validateCartInput, async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        
        let cart = await Cart.findOne({ userId });
        
        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }
        
        const existingProductIndex = cart.products.findIndex(
            p => p.productId.toString() === productId
        );
        
        if (existingProductIndex > -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }
        
        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update cart item quantity
app.put('/api/cart/:productId', validateProductExists, async (req, res) => {
    try {
      const { userId, quantity } = req.body; // Get userId and quantity from request body
      const productId = req.params.productId;
  
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
  
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      const productIndex = cart.products.findIndex(
        p => p.productId.toString() === productId
      );
  
      if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }
  
      cart.products[productIndex].quantity = quantity;
      await cart.save();
  
      res.json(cart);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });~

// DELETE remove product from cart
app.delete('/api/cart/:productId', async (req, res) => {
    try {
      const { userId } = req.body; // Get userId from request body
      const productId = req.params.productId;
  
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
  
      const cart = await Cart.findOne({ userId });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      cart.products = cart.products.filter(
        p => p.productId.toString() !== productId
      );
  
      await cart.save();
      res.json({ message: 'Product removed from cart' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});