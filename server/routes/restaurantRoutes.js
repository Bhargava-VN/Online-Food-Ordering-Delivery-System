const express = require('express');
const router = express.Router();
const {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} = require('../controllers/restaurantController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getRestaurants)
  .post(protect, authorize('restaurant_owner', 'admin'), createRestaurant);

router.route('/:id')
  .get(getRestaurantById)
  .put(protect, authorize('restaurant_owner', 'admin'), updateRestaurant)
  .delete(protect, authorize('admin'), deleteRestaurant);

module.exports = router;
