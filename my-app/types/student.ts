// types/student.ts
// Ini seperti Model di Laravel, tapi cuma define struktur data

export interface Student {
  id: number;
  nama: string;
  nim: string;
  jurusan: string;
  createdAt: string;
}

export interface CreateStudentData {
  nama: string;
  nim: string;
  jurusan: string;
}
