const asyncHandler = require('express-async-handler');
const Stripe = require('stripe');
const Order = require('../models/Order');
const { getIO } = require('../config/socket');

const createPaymentIntent = asyncHandler(async (req, res) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const { amount } = req.body; // expected in minimum currency unit e.g., cents

  if(!amount) {
     res.status(400);
     throw new Error("Amount is required");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'usd',
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
  });
});

const webhook = async (req, res) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // using req.body since it's raw
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // We could use paymentIntent.id to find order and mark as paid if not already
      const order = await Order.findOne({ paymentIntentId: paymentIntent.id });
      if (order && order.paymentStatus !== 'paid') {
          order.paymentStatus = 'paid';
          await order.save();
          
          try {
             const io = getIO();
             io.to(`restaurant_${order.restaurant}`).emit('order:new', {
               orderId: order._id,
               status: 'paid event captured'
             });
          } catch(e) {}
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send();
};

module.exports = {
  createPaymentIntent,
  webhook
};
