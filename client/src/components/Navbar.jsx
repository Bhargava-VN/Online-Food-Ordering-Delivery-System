import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingBag, FiUser, FiLogOut } from 'react-icons/fi';
import { FaHamburger } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 shrink-0">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <FaHamburger className="text-3xl text-orange-500" />
            <span className="font-bold text-xl tracking-tight text-slate-800">CraveDash</span>
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/restaurants" className="font-medium text-slate-600 hover:text-orange-500 transition-colors">Restaurants</Link>
            {user && <Link to="/orders" className="font-medium text-slate-600 hover:text-orange-500 transition-colors">My Orders</Link>}
            {user?.role === 'admin' && (
              <Link to="/admin" className="font-medium text-orange-500 hover:text-orange-600 transition-colors">Admin Dashboard</Link>
            )}
          </div>

          <div className="flex items-center gap-4">
             {user && (
                 <Link to="/cart" className="relative p-2 text-slate-600 hover:text-orange-500 transition-colors">
                     <FiShoppingBag className="text-2xl" />
                     {cartItemCount > 0 && (
                         <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-orange-500 rounded-full">{cartItemCount}</span>
                     )}
                 </Link>
             )}
            
            {user ? (
              <div className="flex items-center gap-4 ml-4">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user.name}</span>
                </div>
                <button onClick={logout} className="p-2 text-slate-600 hover:text-red-500 transition-colors" title="Logout">
                  <FiLogOut className="text-xl" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="font-medium text-slate-600 hover:text-orange-500 transition-colors">Sign In</Link>
                <Link to="/register" className="px-4 py-2 rounded-full bg-orange-500 text-white font-medium hover:bg-orange-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
