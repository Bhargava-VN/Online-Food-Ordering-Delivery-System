const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
  try {
    await User.deleteMany();
    await Restaurant.deleteMany();
    await MenuItem.deleteMany();
    await Order.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    // Create Users
    const users = await User.insertMany([
      { name: 'Admin', email: 'admin@test.com', password, role: 'admin' },
      { name: 'Owner 1', email: 'owner1@test.com', password, role: 'restaurant_owner' },
      { name: 'Owner 2', email: 'owner2@test.com', password, role: 'restaurant_owner' },
      { name: 'User 1', email: 'user1@test.com', password, role: 'user' },
    ]);

    const admin = users[0];
    const owner1 = users[1];
    const owner2 = users[2];
    const customer = users[3];

    // Create Restaurants
    const restaurants = await Restaurant.insertMany([
      {
        name: 'Burger Palace',
        owner: owner1._id,
        description: 'Best burgers in town',
        cuisine: ['American', 'Fast Food'],
        address: { street: '123 Main St', city: 'Metropolis' },
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
        isOpen: true,
        rating: 4.5,
        deliveryTime: 30,
        minimumOrder: 15,
        isApproved: true
      },
      {
        name: 'Pizza Heaven',
        owner: owner1._id,
        description: 'Authentic Italian Pizza',
        cuisine: ['Italian', 'Pizza'],
        address: { street: '456 Oak St', city: 'Metropolis' },
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80',
        isOpen: true,
        rating: 4.8,
        deliveryTime: 45,
        minimumOrder: 20,
        isApproved: true
      },
      {
        name: 'Sushi Zen',
        owner: owner2._id,
        description: 'Fresh sushi everyday',
        cuisine: ['Japanese', 'Sushi'],
        address: { street: '789 Pine St', city: 'Metropolis' },
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80',
        isOpen: true,
        rating: 4.7,
        deliveryTime: 40,
        minimumOrder: 30,
        isApproved: true
      },
      {
        name: 'Taco Fiesta',
        owner: owner2._id,
        description: 'Spicy and delicious Mexican food',
        cuisine: ['Mexican'],
        address: { street: '101 Maple St', city: 'Metropolis' },
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80',
        isOpen: true,
        rating: 4.2,
        deliveryTime: 25,
        minimumOrder: 10,
        isApproved: true
      },
      {
        name: 'Healthy Bowl',
        owner: admin._id,
        description: 'Salads and healthy bowls',
        cuisine: ['Healthy', 'Vegan'],
        address: { street: '202 Elm St', city: 'Metropolis' },
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80',
        isOpen: true,
        rating: 4.9,
        deliveryTime: 20,
        minimumOrder: 15,
        isApproved: true
      }
    ]);

    // Create Menu Items
    const menuItems = [];
    restaurants.forEach((restaurant) => {
      for (let i = 1; i <= 6; i++) {
        menuItems.push({
          restaurant: restaurant._id,
          name: `${restaurant.name} Special ${i}`,
          description: `Delicious special item ${i} from ${restaurant.name}`,
          price: 10 + i * 2,
          category: i <= 3 ? 'Mains' : 'Sides',
          image: 'https://via.placeholder.com/150',
          isAvailable: true,
          isVeg: i % 2 === 0
        });
      }
    });

    await MenuItem.insertMany(menuItems);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
