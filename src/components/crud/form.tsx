import React from 'react';

export default function CrudForm() {
    return (
        <>
            <div className="container mx-auto my-8 px-4">
                <h3 className="text-2xl font-bold mb-6">
                    Student Management
                </h3>
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* left side form */}
                    <div className="lg:w-1/3">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <form>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        placeholder="Enter your name" 
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input 
                                        type="email" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        placeholder="Enter your email" 
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        placeholder="Enter your phone number" 
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <select 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <button 
                                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
                                >
                                    Add
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* right side table */}
                    <div className="lg:w-2/3">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse bg-white shadow-md rounded-lg">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="text-left p-3 text-sm font-semibold text-gray-600">Name</th>
                                        <th className="text-left p-3 text-sm font-semibold text-gray-600">Email</th>
                                        <th className="text-left p-3 text-sm font-semibold text-gray-600">Phone</th>
                                        <th className="text-left p-3 text-sm font-semibold text-gray-600">Gender</th>
                                        <th className="text-left p-3 text-sm font-semibold text-gray-600">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b hover:bg-gray-50">
                                        <td className="p-3">Sanjay kumar</td>
                                        <td className="p-3">sanjay@gmail.com</td>
                                        <td className="p-3">98877665444</td>
                                        <td className="p-3">Male</td>
                                        <td className="p-3 flex gap-2">
                                            <button 
                                                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}