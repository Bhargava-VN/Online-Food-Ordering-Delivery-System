const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Restaurant = require('../models/Restaurant');
const { getIO } = require('../config/socket');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = asyncHandler(async (req, res) => {
  const { deliveryAddress, paymentMethod, paymentIntentId } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.menuItem');

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('No items in cart');
  }

  const orderItems = cart.items.map(item => ({
    menuItem: item.menuItem._id,
    name: item.menuItem.name,
    price: item.price,
    quantity: item.quantity
  }));

  const order = new Order({
    user: req.user._id,
    restaurant: cart.restaurant,
    items: orderItems,
    totalAmount: cart.totalAmount,
    deliveryAddress,
    paymentMethod,
    paymentIntentId,
    paymentStatus: paymentMethod === 'card' ? 'paid' : 'pending',
    orderStatus: 'placed',
    estimatedDeliveryTime: new Date(Date.now() + 45 * 60000) // 45 mins default
  });

  const createdOrder = await order.save();
  await createdOrder.populate('user', 'name email');

  // Clear cart
  cart.items = [];
  cart.restaurant = null;
  cart.totalAmount = 0;
  await cart.save();

  // Socket.io emit to restaurant room
  try {
    const io = getIO();
    io.to(`restaurant_${cart.restaurant}`).emit('order:new', {
      orderId: createdOrder._id,
      customerName: createdOrder.user.name,
      items: orderItems,
      totalAmount: createdOrder.totalAmount
    });
  } catch (err) {
    console.error('Socket io error', err);
  }

  res.status(201).json(createdOrder);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const limit = 10;
  const page = Number(req.query.page) || 1;
  const orders = await Order.find({ user: req.user._id })
    .populate('restaurant', 'name image')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1));

  const count = await Order.countDocuments({ user: req.user._id });

  res.json({ orders, page, pages: Math.ceil(count / limit) });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('restaurant', 'name location');

  if (order) {
    // Check if user owns order, or is admin, or is restaurant owner
    if (
      order.user._id.toString() === req.user._id.toString() ||
      req.user.role === 'admin'
    ) {
      res.json(order);
    } else {
       // Also check if restaurant owner
       const restaurant = await Restaurant.findById(order.restaurant._id);
       if(restaurant && restaurant.owner.toString() === req.user._id.toString()) {
           res.json(order);
       } else {
           res.status(403);
           throw new Error('Not authorized to view this order');
       }
    }
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, estimatedTime } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const validStatuses = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid order status');
  }

  order.orderStatus = status;
  if (estimatedTime) {
    order.estimatedDeliveryTime = estimatedTime;
  }

  await order.save();

  // Emit socket event to user
  try {
    const io = getIO();
    io.to(`order_${order._id}`).emit('order:status', {
      orderId: order._id,
      status: order.orderStatus,
      estimatedTime: order.estimatedDeliveryTime,
      message: `Your order is now ${order.orderStatus.replace('_', ' ')}.`
    });
  } catch (err) {
    console.error('Socket io error', err);
  }

  res.json(order);
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to cancel this order');
  }

  if (order.orderStatus !== 'placed') {
    res.status(400);
    throw new Error('Cannot cancel order after it has been confirmed or prepared');
  }

  order.orderStatus = 'cancelled';
  await order.save();

  // Socket notification
  try {
    const io = getIO();
    io.to(`order_${order._id}`).emit('order:cancelled', { orderId: order._id });
    io.to(`restaurant_${order.restaurant}`).emit('order:cancelled', { orderId: order._id });
  } catch(e) {}

  res.json(order);
});

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
};
