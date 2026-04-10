import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my-orders');
        setOrders(data.orders);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-slate-800 mb-8 tracking-tight">Order History</h1>
      
      {orders.length === 0 ? (
         <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-700 mb-2">No past orders</h3>
            <p className="text-slate-500 mb-6">You haven't placed any orders yet.</p>
            <Link to="/restaurants" className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-colors">Order Now</Link>
         </div>
      ) : (
         <div className="space-y-6">
            {orders.map(order => (
               <div key={order._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                         <span className="text-sm text-slate-500">Order Placed</span>
                         <p className="font-bold text-slate-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-8">
                         <div>
                            <span className="text-sm text-slate-500">Total</span>
                            <p className="font-bold text-slate-800">${order.totalAmount.toFixed(2)}</p>
                         </div>
                         <div>
                            <span className="text-sm text-slate-500">Order #</span>
                            <p className="font-bold text-slate-800">{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                         </div>
                      </div>
                      <div>
                          <Link to={`/orders/${order._id}/track`} className="inline-block bg-white border border-slate-300 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm hover:bg-slate-50 transition-colors shadow-sm">
                             Track/Details
                          </Link>
                      </div>
                  </div>
                  <div className="p-6">
                     <h4 className="font-bold text-slate-800 mb-2">{order.restaurant.name}</h4>
                     <p className="text-sm text-slate-600">
                         {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                     </p>
                     <div className="mt-4">
                         <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                            order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' : 
                            order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                         }`}>
                            {order.orderStatus.replace('_', ' ')}
                         </span>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      )}
    </div>
  );
};

export default OrderHistory;
