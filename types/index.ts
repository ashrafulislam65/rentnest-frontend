export type UserRole = 'TENANT' | 'LANDLORD' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isBanned?: boolean;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  categoryId: string;
  category?: Category;
  images: string[];
  landlordId: string;
  isAvailable: boolean;
  createdAt?: string;
}

export type RentalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED';

export interface Rental {
  id: string;
  propertyId: string;
  property?: Property;
  tenantId: string;
  tenant?: User;
  status: RentalStatus;
  createdAt: string;
}

export interface Payment {
  id: string;
  rentalId: string;
  amount: number;
  status: string;
  createdAt?: string;
}

export interface Review {
  id: string;
  propertyId: string;
  tenantId: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

// Generic API envelope shape used by the backend's globalErrorHandler / success responses
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errorDetails?: Record<string, unknown>;
}