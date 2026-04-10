const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/place')
  .post(placeOrder);

router.route('/my-orders')
  .get(getMyOrders);

router.route('/:id')
  .get(getOrderById);

router.route('/:id/status')
  .put(authorize('restaurant_owner', 'admin'), updateOrderStatus);

router.route('/:id/cancel')
  .put(cancelOrder);

module.exports = router;
