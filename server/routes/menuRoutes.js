const express = require('express');
const router = express.Router();
const {
  getMenuByRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability
} = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/restaurant/:id').get(getMenuByRestaurant);

router.route('/')
  .post(protect, authorize('restaurant_owner', 'admin'), addMenuItem);

router.route('/:id')
  .put(protect, authorize('restaurant_owner', 'admin'), updateMenuItem)
  .delete(protect, authorize('restaurant_owner', 'admin'), deleteMenuItem);

router.route('/:id/availability')
  .patch(protect, authorize('restaurant_owner', 'admin'), toggleAvailability);

module.exports = router;
