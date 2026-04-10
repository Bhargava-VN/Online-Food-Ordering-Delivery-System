import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import MenuItemCard from '../components/MenuItemCard';
import { FaStar, FaClock, FaMotorcycle, FaMapMarkerAlt } from 'react-icons/fa';

const RestaurantMenu = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        const [restRes, menuRes] = await Promise.all([
          api.get(`/restaurants/${id}`),
          api.get(`/menu/restaurant/${id}`)
        ]);
        setRestaurant(restRes.data);
        setMenu(menuRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantAndMenu();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!restaurant) {
    return <div className="text-center py-20">Restaurant not found</div>;
  }

  return (
    <div>
      {/* Restaurant Header */}
      <div className="relative h-64 md:h-80 w-full bg-slate-900">
         <img 
            src={restaurant.image || 'https://via.placeholder.com/1200x400'} 
            alt={restaurant.name} 
            className="w-full h-full object-cover opacity-60"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
         <div className="absolute bottom-0 left-0 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="text-white">
                      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 flex items-center gap-4">
                         {restaurant.name}
                         {!restaurant.isOpen && <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full uppercase tracking-wider font-bold">Closed</span>}
                      </h1>
                      <p className="text-slate-300 text-lg">{restaurant.cuisine.join(' • ')}</p>
                  </div>
                  <div className="flex items-center gap-6 text-white/90 text-sm font-medium bg-black/40 p-4 rounded-xl backdrop-blur-sm self-start md:self-auto border border-white/10">
                     <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1 text-orange-400 font-bold text-lg"><FaStar /> {restaurant.rating.toFixed(1)}</div>
                        <span className="text-xs text-white/70">Rating</span>
                     </div>
                     <div className="w-px h-8 bg-white/20"></div>
                     <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1 text-lg font-bold"><FaClock /> {restaurant.deliveryTime}m</div>
                        <span className="text-xs text-white/70">Delivery</span>
                     </div>
                     <div className="w-px h-8 bg-white/20"></div>
                     <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1 text-lg font-bold"><FaMotorcycle /> ${restaurant.minimumOrder}</div>
                        <span className="text-xs text-white/70">Min Order</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <div className="flex items-center gap-2 text-slate-500 mb-8 pb-8 border-b border-slate-200">
            <FaMapMarkerAlt /> <span>{restaurant.address.street}, {restaurant.address.city}</span>
         </div>

         {Object.keys(menu).length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500">
               Menu is currently empty.
            </div>
         ) : (
            <div className="space-y-12">
              {Object.keys(menu).map(category => (
                 <div key={category}>
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                       {category} <span className="ml-4 flex-grow h-px bg-slate-200"></span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {menu[category].map(item => (
                          <MenuItemCard key={item._id} item={item} />
                       ))}
                    </div>
                 </div>
              ))}
            </div>
         )}
      </div>
    </div>
  );
};

export default RestaurantMenu;
