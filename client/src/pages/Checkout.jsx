import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_12345');

const CheckoutForm = ({ cart, deliveryAddress, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    
    // 1. Create payment intent
    try {
        const amount = cart.totalAmount + 2.99 + (cart.totalAmount * 0.08);

        const { data: { clientSecret } } = await api.post('/payments/create-intent', { amount });
        
        // 2. Confirm card payment
        const result = await stripe.confirmCardPayment(clientSecret, {
           payment_method: {
             card: elements.getElement(CardElement),
           }
        });

        if (result.error) {
           toast.error(result.error.message);
           setLoading(false);
           return;
        }

        if (result.paymentIntent.status === 'succeeded') {
            // 3. Place order
            const { data: order } = await api.post('/orders/place', {
                deliveryAddress,
                paymentMethod: 'card',
                paymentIntentId: result.paymentIntent.id
            });
            onSuccess(order._id);
        }
    } catch(err) {
        toast.error("Payment failed. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
     <form onSubmit={handleSubmit} className="mt-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Payment Details</h3>
        <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 mb-6">
            <CardElement options={{
              style: {
                base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
                invalid: { color: '#9e2146' },
              },
            }} />
        </div>
        <button 
           type="submit" 
           disabled={!stripe || loading}
           className="w-full flex justify-center py-4 rounded-xl text-white font-bold bg-orange-500 hover:bg-orange-600 transition-all shadow-md hover:shadow-lg disabled:opacity-70"
        >
           {loading ? 'Processing Payment...' : 'Pay & Place Order'}
        </button>
     </form>
  )
}

const Checkout = () => {
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || { street: '', city: '', zip: '' });

  useEffect(() => {
    // If we land here and cart is empty or missing, fetch it or redirect
    if (!cart || !cart.items || cart.items.length === 0) {
      toast.info('Your cart is empty');
      navigate('/cart');
    }
  }, [cart, navigate]);

  if (!cart || !cart.items || cart.items.length === 0) return null;

  const handleSuccess = async (orderId) => {
      await fetchCart(); // this will reset the cart context
      toast.success('Order placed successfully!');
      navigate(`/orders/${orderId}/track`);
  }

  const handleCOD = async () => {
      try {
          const { data: order } = await api.post('/orders/place', {
              deliveryAddress: address,
              paymentMethod: 'cod'
          });
          handleSuccess(order._id);
      } catch(e) {
          toast.error("Failed to place order.");
      }
  }

  const deliveryFee = 2.99;
  const taxes = cart.totalAmount * 0.08;
  const total = cart.totalAmount + deliveryFee + taxes;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-slate-800 mb-8 tracking-tight">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
           {/* Address */}
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Delivery Address</h3>
              <div className="space-y-4">
                 <input
                   type="text"
                   placeholder="Street Address"
                   required
                   className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                   value={address.street}
                   onChange={(e) => setAddress({...address, street: e.target.value})}
                 />
                 <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      value={address.city}
                      onChange={(e) => setAddress({...address, city: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="ZIP"
                      required
                      className="w-1/3 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      value={address.zip}
                      onChange={(e) => setAddress({...address, zip: e.target.value})}
                    />
                 </div>
              </div>
           </div>

           {/* Payment Container */}
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <Elements stripe={stripePromise}>
                  <CheckoutForm cart={cart} deliveryAddress={address} onSuccess={handleSuccess} />
               </Elements>
               <div className="mt-6 text-center">
                   <div className="relative">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                      <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-500">OR</span></div>
                   </div>
                   <button 
                      onClick={handleCOD}
                      className="mt-6 w-full py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                   >
                      Cash on Delivery
                   </button>
               </div>
           </div>
        </div>

        <div>
           {/* Order Summary */}
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Order Summary</h3>
              <div className="max-h-64 overflow-y-auto mb-4 pr-2 space-y-3">
                 {cart.items.map(item => (
                    <div key={item.menuItem._id} className="flex justify-between items-center text-sm">
                       <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-700">{item.quantity}x</span>
                          <span className="text-slate-600 truncate max-w-[150px]">{item.menuItem.name}</span>
                       </div>
                       <span className="font-medium text-slate-800">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                 ))}
              </div>
              <div className="space-y-3 pt-4 border-t border-slate-100">
                 <div className="flex justify-between text-slate-500 text-sm">
                    <span>Subtotal</span>
                    <span className="font-medium">${cart.totalAmount.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-slate-500 text-sm">
                    <span>Delivery Fee</span>
                    <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-slate-500 text-sm">
                    <span>Taxes</span>
                    <span className="font-medium">${taxes.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                    <span className="font-bold text-lg text-slate-800">Total</span>
                    <span className="font-extrabold text-xl text-orange-600">${total.toFixed(2)}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
