import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from 'firebase-admin/firestore';

export interface Booking {
  id: string;
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BookingData {
  customerName: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

@Injectable()
export class BookingsService {
  private readonly collection = 'bookings';

  constructor(private readonly firebaseService: FirebaseService) {}

  async getAllBookings(): Promise<Booking[]> {
    try {
      const bookingsRef = await this.firebaseService.getCollection('bookings');
      const snapshot = await bookingsRef.orderBy('createdAt', 'desc').get();
      
      return snapshot.docs.map(doc => {
        const data = doc.data() as BookingData;
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Booking;
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  async getBookingById(id: string): Promise<Booking> {
    try {
      const doc = await this.firebaseService.getDocument('bookings', id);
      const data = await doc.get();
      
      if (!data.exists) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      const docData = data.data() as BookingData;
      return {
        id: data.id,
        ...docData,
        createdAt: docData.createdAt.toDate(),
        updatedAt: docData.updatedAt.toDate(),
      } as Booking;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    try {
      const id = uuidv4();
      const now = new Date();
      
      const booking: Booking = {
        id,
        ...bookingData,
        createdAt: now,
        updatedAt: now,
      };

      await this.firebaseService.addDocument('bookings', booking);
      return booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async updateBookingStatus(id: string, status: Booking['status']): Promise<Booking> {
    try {
      const doc = await this.firebaseService.getDocument('bookings', id);
      const data = await doc.get();
      
      if (!data.exists) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }

      const updateData = {
        status,
        updatedAt: new Date(),
      };

      await this.firebaseService.updateDocument('bookings', id, updateData);

      // Fetch and return the updated booking
      const updatedDoc = await this.firebaseService.getDocument('bookings', id);
      const updatedData = await updatedDoc.get();
      const docData = updatedData.data() as BookingData;

      return {
        id: updatedData.id,
        ...docData,
        createdAt: docData.createdAt.toDate(),
        updatedAt: docData.updatedAt.toDate(),
      } as Booking;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  async cancelBooking(id: string): Promise<Booking> {
    return this.updateBookingStatus(id, 'cancelled');
  }
} 