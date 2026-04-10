import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useSocket } from '../context/SocketContext';
import { FaCheckCircle, FaFire, FaMotorcycle, FaHome, FaTimesCircle } from 'react-icons/fa';

const STEPS = [
  { id: 'placed', label: 'Order Placed', icon: FaCheckCircle },
  { id: 'confirmed', label: 'Confirmed', icon: FaCheckCircle },
  { id: 'preparing', label: 'Preparing', icon: FaFire },
  { id: 'out_for_delivery', label: 'On the Way', icon: FaMotorcycle },
  { id: 'delivered', label: 'Delivered', icon: FaHome }
];

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { activeOrderUpdates, joinOrderTracking } = useSocket();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
        joinOrderTracking(id);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  useEffect(() => {
     if(activeOrderUpdates && activeOrderUpdates.orderId === id) {
         setOrder(prev => ({...prev, orderStatus: activeOrderUpdates.status, estimatedDeliveryTime: activeOrderUpdates.estimatedTime || prev.estimatedDeliveryTime }));
     }
  }, [activeOrderUpdates, id]);

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center">Loading...</div>;
  if (!order) return <div className="text-center py-20 text-slate-500">Order not found</div>;

  const currentStepIndex = STEPS.findIndex(s => s.id === order.orderStatus);
  const isCancelled = order.orderStatus === 'cancelled';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10">
          <div className="text-center mb-10">
             <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Track Your Order</h1>
             <p className="text-slate-500 mt-2">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</p>
             {order.estimatedDeliveryTime && !isCancelled && order.orderStatus !== 'delivered' && (
                <div className="mt-4 inline-block bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-medium shadow-sm">
                   Estimated Delivery: {new Date(order.estimatedDeliveryTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
             )}
          </div>

          {/* Stepper */}
          {isCancelled ? (
             <div className="flex flex-col items-center justify-center py-8 text-red-500 bg-red-50 rounded-xl mb-10">
                 <FaTimesCircle className="text-5xl mb-3" />
                 <h3 className="text-xl font-bold">Order Cancelled</h3>
                 <p className="text-red-400 mt-1">This order has been cancelled.</p>
             </div>
          ) : (
             <div className="relative mb-16 px-4 md:px-10">
                 <div className="absolute top-1/2 left-4 md:left-10 right-4 md:right-10 h-1 bg-slate-200 -translate-y-1/2 z-0 rounded-full"></div>
                 {currentStepIndex > 0 && (
                     <div 
                        className="absolute top-1/2 left-4 md:left-10 h-1 bg-orange-500 -translate-y-1/2 z-0 transition-all duration-1000 ease-in-out" 
                        style={{ width: `calc(${currentStepIndex / (STEPS.length - 1) * 100}% - 2rem)` }} 
                     ></div>
                 )}
                 <div className="relative z-10 flex justify-between items-center">
                    {STEPS.map((step, index) => {
                       const Icon = step.icon;
                       const isActive = index <= currentStepIndex;
                       const isCurrent = index === currentStepIndex;
                       
                       return (
                          <div key={step.id} className="flex flex-col items-center gap-2">
                             <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-white text-slate-300 border-2 border-slate-200'} ${isCurrent ? 'ring-4 ring-orange-200 scale-110' : ''}`}>
                                <Icon className={isActive ? 'text-lg md:text-2xl' : 'text-base md:text-xl'} />
                             </div>
                             <span className={`text-xs md:text-sm font-bold absolute -bottom-8 w-24 text-center ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>{step.label}</span>
                          </div>
                       )
                    })}
                 </div>
             </div>
          )}

          {/* Details */}
          <div className="border-t border-slate-100 pt-8 mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                 <h4 className="font-bold text-slate-800 mb-4 tracking-tight">Order Details</h4>
                 <div className="space-y-3">
                    {order.items.map(item => (
                       <div key={item.menuItem} className="flex justify-between text-sm">
                           <span className="text-slate-600"><span className="font-medium mr-2">{item.quantity}x</span> {item.name}</span>
                           <span className="font-medium text-slate-800">${item.price.toFixed(2)}</span>
                       </div>
                    ))}
                 </div>
                 <div className="border-t border-slate-100 mt-4 pt-4 flex justify-between items-center text-lg font-bold text-slate-800">
                    <span>Total</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                 </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                 <h4 className="font-bold text-slate-800 mb-4 tracking-tight">Delivery Info</h4>
                 <div className="text-sm text-slate-600 space-y-2">
                     <p><strong className="text-slate-700">Name:</strong> {order.user.name}</p>
                     <p><strong className="text-slate-700">Address:</strong> {order.deliveryAddress.street}, {order.deliveryAddress.city} {order.deliveryAddress.zip}</p>
                     <p><strong className="text-slate-700">Restaurant:</strong> {order.restaurant.name}</p>
                     <p className="inline-block mt-2 bg-white px-2 py-1 rounded shadow-sm font-medium border border-slate-200 uppercase text-xs tracking-wider">
                         Payment: {order.paymentMethod === 'card' ? 'Card (Paid)' : 'COD'}
                     </p>
                 </div>
              </div>
          </div>
       </div>
    </div>
  );
};

export default OrderTracking;
