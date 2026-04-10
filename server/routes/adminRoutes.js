const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getOrders,
  approveRestaurant
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.route('/dashboard').get(getDashboardStats);

router.route('/users').get(getUsers);
router.route('/users/:id/role').put(updateUserRole);
router.route('/users/:id').delete(deleteUser);

router.route('/orders').get(getOrders);

router.route('/restaurants/:id/approve').patch(approveRestaurant);

module.exports = router;
