import { Link } from 'react-router-dom';
import { FaStar, FaClock, FaMotorcycle } from 'react-icons/fa';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurants/${restaurant._id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 transform hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden bg-slate-200">
          <img 
            src={restaurant.image || 'https://via.placeholder.com/400x250?text=Restaurant'} 
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {!restaurant.isOpen && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold tracking-wider">CLOSED</span>
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-slate-800 truncate pr-4">{restaurant.name}</h3>
            <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-lg shrink-0">
              <FaStar className="text-orange-500 text-xs" />
              <span className="text-xs font-bold text-orange-700">{restaurant.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <p className="text-sm text-slate-500 mb-4 truncate">
            {restaurant.cuisine.join(' • ')}
          </p>
          
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium border-t border-slate-100 pt-3">
            <div className="flex items-center gap-1.5">
              <FaClock className="text-slate-400" />
              <span>{restaurant.deliveryTime} mins</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FaMotorcycle className="text-slate-400" />
              <span>Min ${restaurant.minimumOrder}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
