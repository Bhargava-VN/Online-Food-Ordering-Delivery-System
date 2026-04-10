const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');

const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.menuItem restaurant');
  
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [], totalAmount: 0 });
  }
  
  res.json(cart);
});

const addToCart = asyncHandler(async (req, res) => {
  const { menuItemId, quantity } = req.body;

  const menuItem = await MenuItem.findById(menuItemId);
  if (!menuItem || !menuItem.isAvailable) {
    res.status(400);
    throw new Error('Menu item not found or unavailable');
  }

  let cart = await Cart.findOne({ user: req.user._id });
  
  if (!cart) {
    cart = new Cart({ user: req.user._id, restaurant: menuItem.restaurant, items: [] });
  }

  // Clear cart if adding item from different restaurant
  if (cart.items.length > 0 && cart.restaurant.toString() !== menuItem.restaurant.toString()) {
    return res.status(400).json({ 
      message: 'Different restaurant. Please clear cart before adding new items.',
      requiresConfirmation: true 
    });
  }

  cart.restaurant = menuItem.restaurant;

  const itemIndex = cart.items.findIndex(p => p.menuItem.toString() === menuItemId);

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ menuItem: menuItemId, quantity, price: menuItem.price });
  }

  // Recalculate total
  cart.totalAmount = cart.items.reduce((total, item) => total + (item.quantity * item.price), 0);

  await cart.save();
  await cart.populate('items.menuItem restaurant');
  
  res.json(cart);
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { menuItemId, quantity } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    const itemIndex = cart.items.findIndex(p => p.menuItem.toString() === menuItemId);

    if (itemIndex > -1) {
      if (quantity > 0) {
        cart.items[itemIndex].quantity = quantity;
      } else {
        cart.items.splice(itemIndex, 1);
      }
      
      if (cart.items.length === 0) {
        cart.restaurant = null;
      }

      // Recalculate total
      cart.totalAmount = cart.items.reduce((total, item) => total + (item.quantity * item.price), 0);
      
      await cart.save();
      await cart.populate('items.menuItem restaurant');
      
      res.json(cart);
    } else {
      res.status(404);
      throw new Error('Item not found in cart');
    }
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

const removeFromCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    cart.items = cart.items.filter(item => item.menuItem.toString() !== req.params.itemId);
    
    if (cart.items.length === 0) {
      cart.restaurant = null;
    }

    cart.totalAmount = cart.items.reduce((total, item) => total + (item.quantity * item.price), 0);
    
    await cart.save();
    await cart.populate('items.menuItem restaurant');
    
    res.json(cart);
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

const clearCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    cart.items = [];
    cart.restaurant = null;
    cart.totalAmount = 0;
    
    await cart.save();
    res.json(cart);
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
