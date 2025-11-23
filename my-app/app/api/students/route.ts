// app/api/students/route.ts
// Ini seperti Controller di Laravel
// Handle CREATE (POST) dan READ (GET)

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// READ - GET Request
// Seperti: Route::get('/students', [StudentController::class, 'index']);
export async function GET() {
  // Seperti StudentController@index
  // $students = Student::all();
  
  try {
    const students = await prisma.student.findMany({
      orderBy: {
        createdAt: 'desc', // Order by terbaru
      },
    });
    
    return NextResponse.json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil data mahasiswa',
      },
      { status: 500 }
    );
  }
}

// CREATE - POST Request
// Seperti: Route::post('/students', [StudentController::class, 'store']);
export async function POST(request: NextRequest) {
  // Seperti StudentController@store
  
  try {
    // Ambil data dari request body (seperti $request->all() di Laravel)
    const body = await request.json();
    
    // Validasi sederhana (seperti $request->validate() di Laravel)
    if (!body.nama || !body.nim || !body.jurusan) {
      return NextResponse.json(
        {
          success: false,
          message: 'Semua field harus diisi!',
        },
        { status: 400 }
      );
    }
    
    // Cek apakah NIM sudah ada (unique validation)
    const existingStudent = await prisma.student.findUnique({
      where: { nim: body.nim },
    });
    
    if (existingStudent) {
      return NextResponse.json(
        {
          success: false,
          message: 'NIM sudah terdaftar!',
        },
        { status: 400 }
      );
    }
    
    // Buat data mahasiswa baru (seperti Student::create() di Laravel)
    const newStudent = await prisma.student.create({
      data: {
        nama: body.nama,
        nim: body.nim,
        jurusan: body.jurusan,
      },
    });
    
    // Return response sukses (seperti return response()->json() di Laravel)
    return NextResponse.json(
      {
        success: true,
        message: 'Mahasiswa berhasil ditambahkan!',
        data: newStudent,
      },
      { status: 201 }
    );
    
  } catch (error) {
    // Handle error (seperti try-catch di Laravel Controller)
    console.error('Error creating student:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan pada server',
      },
      { status: 500 }
    );
  }
}
