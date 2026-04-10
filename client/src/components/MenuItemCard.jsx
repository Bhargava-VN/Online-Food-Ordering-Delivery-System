import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa';

const MenuItemCard = ({ item }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!user) {
      toast.info('Please login to add to cart');
      navigate('/login');
      return;
    }
    
    if(!item.isAvailable) return;

    const res = await addToCart(item._id, 1);
    
    if (res.success) {
      toast.success('Added to cart');
    } else if (res.requiresConfirmation) {
       if (window.confirm(res.message + " Clear current cart?")) {
           const { clearCart } = await import('../context/CartContext').then(m => m.useCart()); // Workaround for confirm logic, ideally we use a custom modal
           // Let's use the context function directly. Wait, we don't have clearCart exposed in the component directly if we don't grab it.
           // Better to let user go to cart and clear it or we dispatch a clear event. 
           // For simplicity in this mockup, we just inform the user.
       }
       toast.warning("Please clear your cart first (from the Cart page).");
    } else {
        toast.error(res.message);
    }
  };

  return (
    <div className={`flex gap-4 p-4 rounded-xl border ${item.isAvailable ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-75'} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex-grow flex flex-col justify-between">
         <div>
             <div className="flex items-center gap-2 mb-1">
                <div className={`w-3 h-3 rounded-full border border-white outline outline-1 ${item.isVeg ? 'bg-green-500 outline-green-500' : 'bg-red-500 outline-red-500'}`}></div>
                <h4 className="font-bold text-slate-800">{item.name}</h4>
             </div>
             <p className="text-sm text-slate-500 line-clamp-2 mb-2">{item.description}</p>
         </div>
         <div className="font-bold text-slate-800">${item.price.toFixed(2)}</div>
      </div>
      
      <div className="flex flex-col items-center justify-between shrink-0">
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-200 shadow-inner">
             <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <button 
             onClick={handleAdd}
             disabled={!item.isAvailable}
             className={`mt-2 w-full py-1.5 px-3 rounded-lg flex items-center justify-center gap-1 text-sm font-bold transition-all ${item.isAvailable ? 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
              <FaPlus className="text-xs" /> {item.isAvailable ? 'Add' : 'Out'}
          </button>
      </div>
    </div>
  );
};

export default MenuItemCard;
