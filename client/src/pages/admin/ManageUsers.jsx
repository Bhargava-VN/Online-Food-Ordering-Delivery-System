import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const fetchUsers = async (p = 1) => {
        try {
            const { data } = await api.get(`/admin/users?page=${p}`);
            setUsers(data.users);
            setPages(data.pages);
            setPage(data.page);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const updateRole = async (id, role) => {
        try {
            await api.put(`/admin/users/${id}/role`, { role });
            toast.success("User role updated");
            fetchUsers(page);
        } catch(e) {
            toast.error("Failed to update role");
        }
    }

    const deleteUser = async (id) => {
        if(window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/admin/users/${id}`);
                toast.success("User deleted");
                fetchUsers(page);
            } catch(e) {
                toast.error("Failed to delete user");
            }
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-8 tracking-tight">Manage Users</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="text-xs uppercase bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map(user => (
                                <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-800">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <select 
                                            value={user.role}
                                            onChange={(e) => updateRole(user._id, e.target.value)}
                                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                                        >
                                            <option value="user">User</option>
                                            <option value="restaurant_owner">Owner</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => deleteUser(user._id)}
                                            className="font-medium text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Pagination Controls */}
            {pages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                    <button 
                        disabled={page === 1}
                        onClick={() => fetchUsers(page - 1)}
                        className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                    >Previous</button>
                    <span className="px-4 py-2 text-slate-600">Page {page} of {pages}</span>
                    <button 
                        disabled={page === pages}
                        onClick={() => fetchUsers(page + 1)}
                        className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                    >Next</button>
                </div>
            )}
        </div>
    )
}

export default ManageUsers;
