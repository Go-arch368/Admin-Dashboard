import React from 'react';

export default function CrudForm() {
    return (
        <>
            <div className="container mx-auto my-8 px-4">
                <h3 className="text-2xl font-bold -mt-10 text-center text-gray-900 dark:text-gray-100">
                    Student Management
                </h3>
                <div className="flex flex-col lg:flex-row gap-6 p-10">
                    {/* left side form */}
                    <div className="lg:w-1/3 p-9 -mt-10 ml-1    0 ">
                        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                            <form>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Name</label>
                                    <input 
                                        type="text" 
                                        id="name"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200" 
                                        placeholder="Enter your name" 
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
                                    <input 
                                        type="email" 
                                        id="email"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200" 
                                        placeholder="Enter your email" 
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Phone Number</label>
                                    <input 
                                        type="text" 
                                        id="phone"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200" 
                                        placeholder="Enter your phone number" 
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Gender</label>
                                    <select 
                                        id="gender"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <button 
                                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition duration-200"
                                >
                                    Add
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* right side table */}
                    <div className="lg:w-2/3">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse bg-white dark:bg-gray-800 shadow-md rounded-lg">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-200">Name</th>
                                        <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-200">Email</th>
                                        <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-200">Phone</th>
                                        <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-200">Gender</th>
                                        <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-200">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="p-3 text-gray-900 dark:text-gray-200">Sanjay kumar</td>
                                        <td className="p-3 text-gray-900 dark:text-gray-200">sanjay@gmail.com</td>
                                        <td className="p-3 text-gray-900 dark:text-gray-200">98877665444</td>
                                        <td className="p-3 text-gray-900 dark:text-gray-200">Male</td>
                                        <td className="p-3 flex gap-2">
                                            <button 
                                                className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500 text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-500 text-sm"
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