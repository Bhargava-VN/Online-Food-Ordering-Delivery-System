const asyncHandler = require('express-async-handler');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

const getMenuByRestaurant = asyncHandler(async (req, res) => {
  const menuItems = await MenuItem.find({ restaurant: req.params.id });
  
  // Group by category
  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  res.json(groupedMenu);
});

const addMenuItem = asyncHandler(async (req, res) => {
  const { restaurant, name, description, price, category, image, isAvailable, isVeg } = req.body;

  const rest = await Restaurant.findById(restaurant);
  
  if (!rest) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  if (rest.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to add items to this restaurant');
  }

  const menuItem = new MenuItem({
    restaurant,
    name,
    description,
    price,
    category,
    image,
    isAvailable,
    isVeg
  });

  const createdMenuItem = await menuItem.save();
  res.status(201).json(createdMenuItem);
});

const updateMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.findById(req.params.id).populate('restaurant');

  if (menuItem) {
    if (menuItem.restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to update this item');
    }

    menuItem.name = req.body.name || menuItem.name;
    menuItem.description = req.body.description || menuItem.description;
    menuItem.price = req.body.price || menuItem.price;
    menuItem.category = req.body.category || menuItem.category;
    menuItem.image = req.body.image || menuItem.image;
    if (req.body.isAvailable !== undefined) menuItem.isAvailable = req.body.isAvailable;
    if (req.body.isVeg !== undefined) menuItem.isVeg = req.body.isVeg;

    const updatedMenuItem = await menuItem.save();
    res.json(updatedMenuItem);
  } else {
    res.status(404);
    throw new Error('Menu item not found');
  }
});

const deleteMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.findById(req.params.id).populate('restaurant');

  if (menuItem) {
    if (menuItem.restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete this item');
    }

    await menuItem.deleteOne();
    res.json({ message: 'Menu item removed' });
  } else {
    res.status(404);
    throw new Error('Menu item not found');
  }
});

const toggleAvailability = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.findById(req.params.id).populate('restaurant');

  if (menuItem) {
    if (menuItem.restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to modify this item');
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();
    res.json(menuItem);
  } else {
    res.status(404);
    throw new Error('Menu item not found');
  }
});

module.exports = {
  getMenuByRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability
};
