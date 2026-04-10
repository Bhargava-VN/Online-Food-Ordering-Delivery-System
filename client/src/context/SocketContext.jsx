import { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();
  const [activeOrderUpdates, setActiveOrderUpdates] = useState(null);

  useEffect(() => {
    if (user) {
      const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
      setSocket(newSocket);

      newSocket.on('order:status', (data) => {
        setActiveOrderUpdates(data);
        toast.info(`Order Status Updated: ${data.status.replace('_', ' ')}`);
      });

      newSocket.on('order:new', (data) => {
         // this is for restaurant owners
         if(user.role === 'restaurant_owner' || user.role === 'admin') {
            toast.success(`New Order Received! Total: $${data.totalAmount}`);
         }
      });

      // Join owner room if restaurant_owner
      if (user.role === 'restaurant_owner') {
        const fetchRestaurants = async () => {
            const api = (await import('../api/axios')).default;
            try {
                // To do: Get the restaurant ID for the owner. For ease, the backend should ideally send this in /auth/me or a separate route.
                // assuming we handle it later.
            } catch(e){}
        };
        fetchRestaurants();
      }

      return () => {
        newSocket.disconnect();
      };
    } else if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  }, [user]);

  const joinOrderTracking = (orderId) => {
    if (socket) {
      socket.emit('join_order', orderId);
    }
  };

  const joinRestaurantRoom = (restaurantId) => {
      if (socket) {
          socket.emit('join_restaurant', restaurantId);
      }
  }

  return (
    <SocketContext.Provider value={{ socket, activeOrderUpdates, joinOrderTracking, joinRestaurantRoom }}>
      {children}
    </SocketContext.Provider>
  );
};
