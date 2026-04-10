import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaArrowRight } from 'react-icons/fa';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-48 h-48 bg-slate-100 rounded-full flex items-center justify-center mb-6">
           <svg className="w-24 h-24 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Browse our restaurants to find something delicious!</p>
        <Link to="/restaurants" className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-md">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  const deliveryFee = 2.99;
  const taxes = cart.totalAmount * 0.08;
  const total = cart.totalAmount + deliveryFee + taxes;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-slate-800 mb-8 tracking-tight">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow">
           <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
             <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                 <h3 className="font-bold text-slate-700">Order from <span className="text-orange-500">{cart.restaurant?.name || 'Restaurant'}</span></h3>
                 <button onClick={clearCart} className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors">Clear Cart</button>
             </div>
             <div className="divide-y divide-slate-100">
                {cart.items.map((item) => (
                  <div key={item.menuItem._id} className="p-4 flex items-center gap-4">
                     <div className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden shrink-0">
                         <img src={item.menuItem.image || 'https://via.placeholder.com/100'} alt={item.menuItem.name} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-grow">
                         <h4 className="font-bold text-slate-800">{item.menuItem.name}</h4>
                         <p className="text-sm text-slate-500 font-medium">${item.price.toFixed(2)}</p>
                     </div>
                     <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                        <button 
                          onClick={() => updateQuantity(item.menuItem._id, item.quantity - 1)}
                          className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-slate-500 hover:text-orange-500 hover:bg-orange-50 shadow-sm transition-colors"
                        >
                          <FaMinus className="text-xs" />
                        </button>
                        <span className="w-4 text-center font-bold text-slate-700">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.menuItem._id, item.quantity + 1)}
                          className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-slate-500 hover:text-orange-500 hover:bg-orange-50 shadow-sm transition-colors"
                        >
                          <FaPlus className="text-xs" />
                        </button>
                     </div>
                     <div className="w-20 text-right font-bold text-slate-800">
                         ${(item.price * item.quantity).toFixed(2)}
                     </div>
                     <button onClick={() => removeFromCart(item.menuItem._id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                         <FaTrash />
                     </button>
                  </div>
                ))}
             </div>
           </div>
        </div>

        <div className="w-full lg:w-96 shrink-0">
           <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Order Summary</h3>
              <div className="space-y-3 mb-6">
                 <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-medium">${cart.totalAmount.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-slate-600">
                    <span>Delivery Fee</span>
                    <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-slate-600">
                    <span>Taxes</span>
                    <span className="font-medium">${taxes.toFixed(2)}</span>
                 </div>
                 <div className="border-t border-slate-200 pt-3 mt-3 flex justify-between items-center bg-orange-50 -mx-6 px-6 py-4 rounded-b-xl border-t-0">
                    <span className="font-bold text-lg text-slate-800">Total</span>
                    <span className="font-extrabold text-2xl text-orange-600">${total.toFixed(2)}</span>
                 </div>
              </div>
              <button 
                 onClick={() => navigate('/checkout')}
                 className="w-full flex justify-center items-center gap-2 py-4 rounded-xl text-white font-bold bg-orange-500 hover:bg-orange-600 transition-all shadow-md hover:shadow-lg"
              >
                 Proceed to Checkout <FaArrowRight />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
