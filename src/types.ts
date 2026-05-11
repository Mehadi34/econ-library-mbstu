export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  description: string;
  cover: string;
  totalCopies: number;
  availableCopies: number;
  location: string;
}

export interface LibraryStats {
  totalBooks: number;
  activeMembers: number;
  dailyVisitors: number;
  newArrivals: number;
}

export interface Donor {
  id: string;
  name: string;
  role: string;
  amount: string;
  verified: boolean;
  img: string;
  email?: string;
  phone?: string;
}

export interface PreBookRequest {
  id: string;
  userId: string;
  userName: string;
  bookId: string;
  bookTitle: string;
  status: 'pending' | 'approved' | 'rejected' | 'collected';
  requestDate: string;
}

