const asyncHandler = require('express-async-handler');
const Restaurant = require('../models/Restaurant');

const getRestaurants = asyncHandler(async (req, res) => {
  const { cuisine, search, sort } = req.query;

  const query = { isApproved: true, isOpen: true };

  if (cuisine) {
    query.cuisine = { $in: cuisine.split(',') };
  }

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  let sortOption = {};
  if (sort === 'rating') {
    sortOption = { rating: -1 };
  } else {
    sortOption = { createdAt: -1 };
  }

  const restaurants = await Restaurant.find(query).sort(sortOption);
  res.json(restaurants);
});

const getRestaurantById = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (restaurant) {
    res.json(restaurant);
  } else {
    res.status(404);
    throw new Error('Restaurant not found');
  }
});

const createRestaurant = asyncHandler(async (req, res) => {
  const { name, description, cuisine, address, image, deliveryTime, minimumOrder } = req.body;

  const restaurant = new Restaurant({
    name,
    owner: req.user._id,
    description,
    cuisine: Array.isArray(cuisine) ? cuisine : cuisine.split(','),
    address,
    image,
    deliveryTime,
    minimumOrder,
    isApproved: req.user.role === 'admin' // Auto-approve if admin creates it
  });

  const createdRestaurant = await restaurant.save();
  res.status(201).json(createdRestaurant);
});

const updateRestaurant = asyncHandler(async (req, res) => {
  const { name, description, cuisine, address, image, deliveryTime, minimumOrder, isOpen } = req.body;

  const restaurant = await Restaurant.findById(req.params.id);

  if (restaurant) {
    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to update this restaurant');
    }

    restaurant.name = name || restaurant.name;
    restaurant.description = description || restaurant.description;
    restaurant.cuisine = cuisine ? (Array.isArray(cuisine) ? cuisine : cuisine.split(',')) : restaurant.cuisine;
    restaurant.address = address || restaurant.address;
    restaurant.image = image || restaurant.image;
    restaurant.deliveryTime = deliveryTime || restaurant.deliveryTime;
    restaurant.minimumOrder = minimumOrder || restaurant.minimumOrder;
    if (isOpen !== undefined) {
      restaurant.isOpen = isOpen;
    }

    const updatedRestaurant = await restaurant.save();
    res.json(updatedRestaurant);
  } else {
    res.status(404);
    throw new Error('Restaurant not found');
  }
});

const deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (restaurant) {
    await restaurant.deleteOne();
    res.json({ message: 'Restaurant removed' });
  } else {
    res.status(404);
    throw new Error('Restaurant not found');
  }
});

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
};
