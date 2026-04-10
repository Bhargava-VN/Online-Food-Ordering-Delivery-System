import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import api from '../api/axios';
import { FaSearch, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await api.get('/restaurants?sort=rating');
        setRestaurants(data.slice(0, 4)); // Get top 4
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Food delivery you can <span className="text-orange-500">count on</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto md:mx-0">
              Discover local favorites and get fresh food delivered right to your door with real-time tracking.
            </p>
            <div className="flex items-center bg-white rounded-full p-2 max-w-md mx-auto md:mx-0 shadow-lg">
              <FaSearch className="text-slate-400 ml-4 hidden sm:block" />
              <input 
                type="text" 
                placeholder="Search restaurants or cuisines..." 
                className="flex-grow px-4 outline-none text-slate-800 bg-transparent placeholder-slate-400 w-full"
              />
              <Link to="/restaurants" className="bg-orange-500 text-white px-6 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors shadow-md">
                Search
              </Link>
            </div>
          </div>
          <div className="flex-1 hidden md:block">
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80" alt="Food Delivery" className="rounded-2xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500" />
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Featured Restaurants</h2>
            <p className="text-slate-500 mt-2">Highest rated places near you</p>
          </div>
          <Link to="/restaurants" className="hidden sm:flex items-center gap-2 text-orange-500 font-bold hover:text-orange-600 transition-colors">
            View All <FaArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(n => <div key={n} className="h-64 bg-slate-200 animate-pulse rounded-2xl"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {restaurants.map(rest => (
              <RestaurantCard key={rest._id} restaurant={rest} />
            ))}
          </div>
        )}
      </section>
      
      {/* App Promo */}
      <section className="py-16 bg-orange-50 border-y border-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-4">Never wait in line again</h2>
              <p className="text-slate-600 max-w-2xl mx-auto mb-8">Download our mobile app to order food on the go. Faster ordering, exclusive discounts, and live tracking straight to your phone.</p>
              <div className="flex justify-center gap-4 flex-wrap">
                  <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2">
                       App Store
                  </button>
                  <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2">
                       Google Play
                  </button>
              </div>
          </div>
      </section>
    </div>
  );
};

export default Home;
