import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { api } from './api';

export interface Booking {
  id: string;
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  notes?: string;
}

const checkAuth = async () => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  // Validate token format
  if (token.split('.').length !== 3) {
    console.warn('Invalid token format detected in checkAuth');
    await AsyncStorage.removeItem('userToken');
    throw new Error('Invalid token format');
  }

  // Return clean token
  return token.replace('Bearer ', '');
};

export const bookingService = {
  async getAllBookings(): Promise<Booking[]> {
    try {
      // Check authentication first
      const token = await checkAuth();
      
      console.log('Fetching all bookings from:', `${api.defaults.baseURL}/bookings`);
      console.log('Request headers:', {
        ...api.defaults.headers,
        Authorization: `Bearer ${token}`
      });
      
      const response = await api.get('/bookings');
      
      console.log('Bookings response:', {
        status: response.status,
        statusText: response.statusText,
        dataLength: Array.isArray(response.data) ? response.data.length : 'not an array'
      });
      
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: expected array of bookings');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching bookings:', {
        message: error.message,
        response: {
          data: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText
        },
        request: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });

      // Handle specific error cases
      if (error.message === 'No authentication token found' || error.message === 'Invalid token format') {
        throw new Error('Please log in again to continue');
      }
      if (error.response?.status === 401) {
        await AsyncStorage.removeItem('userToken');
        throw new Error('Session expired. Please log in again.');
      }
      
      throw error;
    }
  },

  async getBookingById(id: string): Promise<Booking> {
    try {
      await checkAuth();
      const response = await api.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking details:', error);
      throw error;
    }
  },

  async updateBookingStatus(id: string, status: Booking['status']): Promise<Booking> {
    try {
      await checkAuth();
      const response = await api.patch(`/bookings/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  async createBooking(bookingData: Omit<Booking, 'id'>): Promise<Booking> {
    try {
      await checkAuth();
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  async cancelBooking(id: string): Promise<Booking> {
    try {
      await checkAuth();
      const response = await api.post(`/bookings/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  },

  async getMyBookings(): Promise<Booking[]> {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  }
}; 