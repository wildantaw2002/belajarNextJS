// app/page.tsx
// Ini seperti View di Laravel (resources/views/students/index.blade.php)
// Tapi di Next.js, ini juga bisa fetch data langsung (seperti Controller+View jadi satu)

'use client'; // Tandai sebagai Client Component (bisa interactive)

import { useState, useEffect } from 'react';
import { Student, CreateStudentData } from '@/types/student';

export default function Home() {
  // State untuk menyimpan data mahasiswa (seperti variabel di Blade)
  const [students, setStudents] = useState<Student[]>([]);
  
  // State untuk form input
  const [formData, setFormData] = useState<CreateStudentData>({
    nama: '',
    nim: '',
    jurusan: '',
  });
  
  // State untuk loading & error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // READ - Fetch data mahasiswa dari API
  // Seperti di Blade: $students = Student::all();
  // Tapi di React pakai useEffect + fetch
  useEffect(() => {
    fetchStudents();
  }, []); // [] = jalankan sekali saat component mount

  const fetchStudents = async () => {
    try {
      setLoading(true);
      
      // Fetch ke API (seperti AJAX request di Laravel)
      // Route: GET /api/students
      const response = await fetch('/api/students');
      const result = await response.json();
      
      if (result.success) {
        setStudents(result.data);
      }
    } catch (err) {
      setError('Gagal mengambil data mahasiswa');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // CREATE - Handle submit form
  // Seperti submit form di Laravel Blade
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submit
    
    // Validasi sederhana
    if (!formData.nama || !formData.nim || !formData.jurusan) {
      alert('Semua field harus diisi!');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // POST request ke API (seperti form submit di Laravel)
      // Route: POST /api/students
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh data setelah create (seperti redirect()->back() di Laravel)
        await fetchStudents();
        
        // Reset form
        setFormData({ nama: '', nim: '', jurusan: '' });
        
        alert('Mahasiswa berhasil ditambahkan!');
      } else {
        setError(result.message || 'Gagal menambahkan mahasiswa');
      }
    } catch (err) {
      setError('Terjadi kesalahan pada server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle perubahan input (seperti old() di Laravel Blade)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          📚 CRUD Data Mahasiswa - Next.js
        </h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form Input - Seperti <form> di Blade */}
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Tambah Mahasiswa Baru</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleInputChange}
              placeholder="Masukkan nama lengkap"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              NIM
            </label>
            <input
              type="text"
              name="nim"
              value={formData.nim}
              onChange={handleInputChange}
              placeholder="Masukkan NIM"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Jurusan
            </label>
            <input
              type="text"
              name="jurusan"
              value={formData.jurusan}
              onChange={handleInputChange}
              placeholder="Masukkan jurusan"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-200 disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : '➕ Tambah Mahasiswa'}
          </button>
        </form>

        {/* Tabel Data - Seperti @foreach di Blade */}
        <div className="overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Daftar Mahasiswa</h2>
          
          {loading && students.length === 0 ? (
            <p className="text-center py-8 text-gray-400">Loading...</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-green-500 text-white">
                  <th className="px-4 py-3 text-left">No</th>
                  <th className="px-4 py-3 text-left">Nama</th>
                  <th className="px-4 py-3 text-left">NIM</th>
                  <th className="px-4 py-3 text-left">Jurusan</th>
                  <th className="px-4 py-3 text-left">Dibuat</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">
                      Belum ada data mahasiswa
                    </td>
                  </tr>
                ) : (
                  students.map((student, index) => (
                    <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{student.nama}</td>
                      <td className="px-4 py-3">{student.nim}</td>
                      <td className="px-4 py-3">{student.jurusan}</td>
                      <td className="px-4 py-3">
                        {new Date(student.createdAt).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
