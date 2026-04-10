const express = require('express');
const router = express.Router();
const { createPaymentIntent, webhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-intent', protect, createPaymentIntent);

// Webhook route needs to have express.raw() applied to it in server.js, 
// so we will export this and set it up there or do it here.
// Note: express.raw({type: 'application/json'}) is usually applied in server.js before express.json()
router.post('/webhook', express.raw({type: 'application/json'}), webhook);

module.exports = router;
