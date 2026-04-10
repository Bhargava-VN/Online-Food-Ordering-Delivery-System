# CraveDash (Online Food Delivery System)

A full-stack online food ordering and delivery system built using the MERN stack (MongoDB, Express.js, React.js, Node.js), Socket.IO for real-time order tracking, and Stripe for payments.

## Features
- **User Authentication**: Secure signup and login for users.
- **Restaurant Browsing**: Browse available restaurants and menus.
- **Shopping Cart & Checkout**: Add items to the cart and securely checkout.
- **Real-time Order Tracking**: Track the order real-time from the kitchen to delivery.
- **Admin Dashboard**: Manage menus, view orders, etc.

## Project Structure
This application is divided into two parts:
- `client/`: React frontend created with Vite.
- `server/`: Express / Node.js backend.

## Getting Started

### Prerequisites
- Node.js installed on your machine.
- MongoDB instance (local or Atlas) running.

### Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <your-github-repo-url>
   cd food-delivery-app
   ```

2. **Install dependencies for backend**:
   ```bash
   cd server
   npm install
   ```

3. **Install dependencies for frontend**:
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Variables**:
   Setup your `.env` files in both `client` and `server` folders according to the project requirements (Stripe keys, MongoDB URI, etc.).

### Running the Project

You can run both the frontend and backend servers easily using the provided Windows batch script.

From the root directory (`food-delivery-app`), double-click or run:
```cmd
start.bat
```
This will automatically start:
- Backend Server on http://localhost:5000
- Frontend Client on http://localhost:5173

*(Alternatively, you can run them manually by navigating into `server/` and `client/` and using `npm run dev` in separate terminals).*

### Database Seeding
To populate the database with initial dummy data (or required initial states), you can run:
```cmd
seed.bat
```
