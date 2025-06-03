import React from 'react';
import { Link } from '@inertiajs/react';

const UserTable = ({ users }) => {
    return (
        <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">User List</h2>
                <Link
                    href="/users/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-sm transition"
                >
                    + Add User
                </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase tracking-wide text-xs">
                        <tr>
                            <th className="px-5 py-3">#</th>
                            <th className="px-5 py-3">Name</th>
                            <th className="px-5 py-3">Email</th>
                            <th className="px-5 py-3">Role</th>
                            <th className="px-5 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-gray-800">
                        {users && users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-5 py-3 font-medium">{index + 1}</td>
                                    <td className="px-5 py-3">{user.name}</td>
                                    <td className="px-5 py-3">{user.email}</td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                            user.role === 'superadmin'
                                                ? 'bg-purple-100 text-purple-700'
                                                : user.role === 'admin'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-green-100 text-green-700'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-center space-x-2">
                                    <Link
                                        className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1 rounded-full text-sm font-medium transition"
                                         href={`/users/${user.id}/edit`}
                                     >
                                        ✏️ Edit
                                    </Link>
                                    <Link
                                        className="inline-flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-full text-sm font-medium transition"
                                        href={`/users/${user.id}/delete`}
                                    >
                                        🗑️ Delete
                                    </Link>
                                </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-6 text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;
