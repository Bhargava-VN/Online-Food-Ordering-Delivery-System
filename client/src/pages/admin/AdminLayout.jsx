import { Outlet, Link, useLocation } from 'react-router-dom';
import { FaChartBar, FaUtensils, FaList, FaUsers, FaReceipt } from 'react-icons/fa';

const AdminLayout = () => {
    const location = useLocation();

    const links = [
        { path: '/admin', label: 'Dashboard', icon: FaChartBar },
        { path: '/admin/restaurants', label: 'Restaurants', icon: FaUtensils },
        { path: '/admin/menus', label: 'Menus', icon: FaList },
        { path: '/admin/orders', label: 'Orders', icon: FaReceipt },
        { path: '/admin/users', label: 'Users', icon: FaUsers },
    ];

    return (
        <div className="flex min-h-[calc(100vh-4rem)] bg-slate-100">
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-white shrink-0 hidden md:block border-r border-slate-800">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        <span className="text-orange-500">Admin</span>Panel
                    </h2>
                </div>
                <nav className="p-4 space-y-1">
                    {links.map(link => {
                        const isActive = location.pathname === link.path;
                        const Icon = link.icon;
                        return (
                            <Link 
                               key={link.path} 
                               to={link.path}
                               className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                            >
                               <Icon className={isActive ? 'text-white' : 'text-slate-500'} /> {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            
            {/* Main Content */}
            <div className="flex-grow p-4 md:p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
