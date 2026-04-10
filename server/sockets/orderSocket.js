const { getIO } = require('../config/socket');

const orderSocketHandler = (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // User joins their own order tracking room
  socket.on('join_order', (orderId) => {
    socket.join(`order_${orderId}`);
    console.log(`Socket ${socket.id} joined order room: order_${orderId}`);
  });

  // Owner joins their restaurant room
  socket.on('join_restaurant', (restaurantId) => {
    socket.join(`restaurant_${restaurantId}`);
    console.log(`Socket ${socket.id} joined restaurant room: restaurant_${restaurantId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
};

module.exports = orderSocketHandler;
