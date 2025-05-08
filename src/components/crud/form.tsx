'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';

interface Student {
  id?: number;
  name: string;
  email: string;
  phone_number: string;
  gender: string;
}

export default function CrudForm() {
  const [studentdata, setStudentdata] = useState<Student[]>([]);
  const [form, setForm] = useState<Student>({
    name: '',
    email: '',
    phone_number: '',
    gender: 'Male',
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudentdata(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = '/api/students';
      const method = editId !== null ? 'PUT' : 'POST';
      const body = editId !== null 
        ? JSON.stringify({ id: editId, ...form }) 
        : JSON.stringify(form);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (!response.ok) throw new Error(`Failed to ${editId !== null ? 'update' : 'create'} student`);

      toast.success(`Student ${editId !== null ? 'updated' : 'created'} successfully`, {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      
      setForm({
        name: '',
        email: '',
        phone_number: '',
        gender: 'Male',
      });
      setEditId(null);
      await fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error(`Failed to ${editId !== null ? 'update' : 'create'} student`, {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleEdit(student: Student) {
    setForm({
      name: student.name,
      email: student.email,
      phone_number: student.phone_number,
      gender: student.gender,
    });
    setEditId(student.id!);
  }

  async function handleDelete(id: number) {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#dc2626',
        confirmButtonText: 'Yes, delete it!',
        customClass: {
          popup: 'rounded-xl',
          confirmButton: 'px-4 py-2',
          cancelButton: 'px-4 py-2',
        },
      });

      if (result.isConfirmed) {
        setIsLoading(true);
        const response = await fetch('/api/students', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) throw new Error('Failed to delete student');
        
        toast.success('Student deleted successfully', {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        await fetchStudents();
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Failed to delete student', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      <h3 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Student Management
      </h3>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Section */}
        <div className="lg:w-1/2 xl:w-2/5 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
            {editId !== null ? 'Update Student' : 'Add New Student'}
          </h4>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 transition"
                placeholder="Student name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 transition"
                placeholder="student@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={form.phone_number}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 transition"
                placeholder="+1234567890"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gender
              </label>
              <select
                id="gender"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 transition"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {editId !== null ? 'Update Student' : 'Add Student'}
            </button>
          </form>
        </div>

        {/* Table Section */}
        <div className="lg:w-1/2 xl:w-3/5 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Gender</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {studentdata.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                      {isLoading ? 'Loading...' : 'No students found'}
                    </td>
                  </tr>
                ) : (
                  studentdata.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{student.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{student.email}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{student.phone_number}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{student.gender}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="px-3 py-1.5 bg-yellow-500 text-white text-xs font-medium rounded hover:bg-yellow-600 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(student.id!)}
                            className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}