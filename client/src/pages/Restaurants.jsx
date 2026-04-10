import { useState, useEffect } from 'react';
import api from '../api/axios';
import RestaurantCard from '../components/RestaurantCard';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');

  const cuisines = ['Italian', 'American', 'Japanese', 'Mexican', 'Indian', 'Healthy', 'Pizza', 'Sushi', 'Fast Food', 'Vegan'];

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (search) query.append('search', search);
        if (cuisineFilter) query.append('cuisine', cuisineFilter);
        
        const { data } = await api.get(`/restaurants?${query.toString()}`);
        setRestaurants(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [search, cuisineFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-slate-800 mb-8 tracking-tight">All Restaurants</h1>

      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Search by restaurant name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm bg-white"
          />
        </div>
        <div className="w-full md:w-64">
           <select 
             value={cuisineFilter} 
             onChange={(e) => setCuisineFilter(e.target.value)}
             className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
           >
             <option value="">All Cuisines</option>
             {cuisines.map(c => (
               <option key={c} value={c}>{c}</option>
             ))}
           </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {[1,2,3,4,5,6,7,8].map(n => <div key={n} className="h-64 bg-slate-200 animate-pulse rounded-2xl"></div>)}
        </div>
      ) : restaurants.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
           <h3 className="text-xl font-bold text-slate-700 mb-2">No restaurants found</h3>
           <p className="text-slate-500">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {restaurants.map(rest => (
            <RestaurantCard key={rest._id} restaurant={rest} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Restaurants;
