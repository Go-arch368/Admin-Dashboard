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
      toast.error('Failed to fetch students');
    }
  }

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      if (editId !== null) {
        // Update existing student
        const response = await fetch('/api/students', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editId, ...form }),
        });
        if (!response.ok) throw new Error('Failed to update student');
        toast.success('Student updated successfully');
      } else {
        // Insert new student
        const response = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!response.ok) throw new Error('Failed to create student');
        toast.success('Student created successfully');
      }

      // Reset form and refresh data
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
      toast.error('Failed to save student');
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
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        const response = await fetch('/api/students', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        if (!response.ok) throw new Error('Failed to delete student');
        toast.success('Student deleted successfully');
        await fetchStudents();
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Failed to delete student');
    }
  }

  return (
    <>
      <div className="container mx-auto my-8 px-4">
        <Toaster />
        <h3 className="text-2xl font-bold -mt-10 text-center text-gray-900 dark:text-gray-100">
          Student Management
        </h3>
        <div className="flex flex-col lg:flex-row gap-6 p-10">
          {/* Left side form */}
          <div className="lg:w-400px p-9 -mt-10 ml-10">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    value={form.phone_number}
                    onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  >
                    <option value="Male">Male


</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition duration-200"
                >
                  {editId !== null ? 'Update' : 'Add'} Student
                </button>
              </form>
            </div>
          </div>

          {/* Right side table */}
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
                  {studentdata.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-3 text-center text-gray-500 dark:text-gray-400">
                        No students found
                      </td>
                    </tr>
                  ) : (
                    studentdata.map((student) => (
                      <tr key={student.id} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="p-3 text-gray-900 dark:text-gray-200">{student.name}</td>
                        <td className="p-3 text-gray-900 dark:text-gray-200">{student.email}</td>
                        <td className="p-3 text-gray-900 dark:text-gray-200">{student.phone_number}</td>
                        <td className="p-3 text-gray-900 dark:text-gray-200">{student.gender}</td>
                        <td className="p-3 flex gap-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(student.id!)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-500 text-sm"
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