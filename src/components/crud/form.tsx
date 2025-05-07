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

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
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
    }
  }

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      if (editId !== null) {
        const response = await fetch('/api/students', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editId, ...form }),
        });
        if (!response.ok) throw new Error('Failed to update student');
        toast.success('Student updated successfully', {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      } else {
        const response = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!response.ok) throw new Error('Failed to create student');
        toast.success('Student created successfully', {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }

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
      toast.error('Failed to save student', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  }

  async function handleEdit(student: Student) {
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
    }
  }

  return (
    <>
      <div className="container mx-auto my-6 px-6">
        <Toaster position="top-right" />
        <h3 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-10">
          Student Management Dashboard
        </h3>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="lg:w-[650px] pl-20">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 transition-all duration-300">
              <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
                {editId !== null ? 'Update Student' : 'Add New Student'}
              </h4>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-5">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 transition duration-200"
                    placeholder="Enter student name"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 transition duration-200"
                    placeholder="Enter student email"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    value={form.phone_number}
                    onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 transition duration-200"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 transition duration-200"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition duration-300 font-semibold"
                >
                  {editId !== null ? 'Update Student' : 'Add Student'}
                </button>
              </form>
            </div>
          </div>

          {/* Table Section */}
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden">
              
              <table className="w-full border-collapse">
                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold">Name</th>
                    <th className="text-left p-4 text-sm font-semibold">Email</th>
                    <th className="text-left p-4 text-sm font-semibold">Phone</th>
                    <th className="text-left p-4 text-sm font-semibold">Gender</th>
                    <th className="text-left p-4 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentdata.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No students found
                      </td>
                    </tr>
                  ) : (
                    studentdata.map((student, index) => (
                      <tr
                        key={student.id}
                        className={`${
                          index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
                        } hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-200`}
                      >
                        <td className="p-4 text-gray-900 dark:text-gray-200">{student.name}</td>
                        <td className="p-4 text-gray-900 dark:text-gray-200">{student.email}</td>
                        <td className="p-4 text-gray-900 dark:text-gray-200">{student.phone_number}</td>
                        <td className="p-4 text-gray-900 dark:text-gray-200">{student.gender}</td>
                        <td className="p-4 flex gap-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500 transition duration-200 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(student.id!)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-500 transition duration-200 text-sm font-medium"
                          >
                            Delete
                          </button>
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
    </>
  );
}