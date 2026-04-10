const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');

const getDashboardStats = asyncHandler(async (req, res) => {
  const usersCount = await User.countDocuments();
  const ordersCount = await Order.countDocuments();
  const restaurantsCount = await Restaurant.countDocuments();
  
  const orders = await Order.find({ paymentStatus: 'paid' });
  const revenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

  res.json({
    users: usersCount,
    orders: ordersCount,
    restaurants: restaurantsCount,
    revenue
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const limit = 10;
  const page = Number(req.query.page) || 1;
  const role = req.query.role;

  let query = {};
  if (role) {
    query.role = role;
  }

  const users = await User.find(query)
    .select('-password')
    .limit(limit)
    .skip(limit * (page - 1));
  
  const count = await User.countDocuments(query);

  res.json({ users, page, pages: Math.ceil(count / limit) });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.role = req.body.role || user.role;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      role: updatedUser.role
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getOrders = asyncHandler(async (req, res) => {
  const limit = 10;
  const page = Number(req.query.page) || 1;
  const status = req.query.status;

  let query = {};
  if (status) {
    query.orderStatus = status;
  }

  const orders = await Order.find(query)
    .populate('user', 'id name')
    .populate('restaurant', 'id name')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1));

  const count = await Order.countDocuments(query);

  res.json({ orders, page, pages: Math.ceil(count / limit) });
});

const approveRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (restaurant) {
    restaurant.isApproved = req.body.isApproved !== undefined ? req.body.isApproved : !restaurant.isApproved;
    await restaurant.save();
    res.json(restaurant);
  } else {
    res.status(404);
    throw new Error('Restaurant not found');
  }
});

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getOrders,
  approveRestaurant
};
