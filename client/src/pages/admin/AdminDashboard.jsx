import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaUsers, FaMotorcycle, FaUtensils, FaDollarSign } from 'react-icons/fa';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
                <Icon className="text-xl" />
            </div>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/dashboard');
                setStats(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-8 tracking-tight">Dashboard Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Users" value={stats.users} icon={FaUsers} colorClass="bg-blue-100 text-blue-600" />
                <StatCard title="Total Orders" value={stats.orders} icon={FaMotorcycle} colorClass="bg-green-100 text-green-600" />
                <StatCard title="Restaurants" value={stats.restaurants} icon={FaUtensils} colorClass="bg-orange-100 text-orange-600" />
                <StatCard title="Total Revenue" value={`$${stats.revenue.toFixed(2)}`} icon={FaDollarSign} colorClass="bg-purple-100 text-purple-600" />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Quick Actions</h3>
                <p className="text-slate-600">Use the sidebar to navigate to specific management pages for Restaurants, Orders, and Users.</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
