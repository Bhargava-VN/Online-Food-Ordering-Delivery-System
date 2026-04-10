import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const fetchOrders = async (p = 1) => {
        try {
            const { data } = await api.get(`/admin/orders?page=${p}`);
            setOrders(data.orders);
            setPages(data.pages);
            setPage(data.page);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/orders/${id}/status`, { status });
            toast.success("Order status updated");
            fetchOrders(page);
        } catch(e) {
            toast.error("Failed to update schedule");
        }
    }

    const statuses = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

    return (
        <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-8 tracking-tight">Manage Orders</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="text-xs uppercase bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Change Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.map(order => (
                                <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs">{order._id}</td>
                                    <td className="px-6 py-4 font-medium text-slate-800">{order.user?.name}</td>
                                    <td className="px-6 py-4 font-bold text-slate-800">${order.totalAmount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                         <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{order.orderStatus.replace('_', ' ')}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <select 
                                            value={order.orderStatus}
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                                        >
                                            {statuses.map(s => (
                                                <option key={s} value={s}>{s.replace('_', ' ')}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ManageOrders;
