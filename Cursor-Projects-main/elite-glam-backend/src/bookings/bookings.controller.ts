import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { BookingsService, Booking } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  async getAllBookings(): Promise<Booking[]> {
    return this.bookingsService.getAllBookings();
  }

  @Get(':id')
  async getBookingById(@Param('id') id: string): Promise<Booking> {
    return this.bookingsService.getBookingById(id);
  }

  @Post()
  async createBooking(@Body() bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    return this.bookingsService.createBooking(bookingData);
  }

  @Patch(':id/status')
  async updateBookingStatus(
    @Param('id') id: string,
    @Body('status') status: Booking['status']
  ): Promise<Booking> {
    return this.bookingsService.updateBookingStatus(id, status);
  }

  @Post(':id/cancel')
  async cancelBooking(@Param('id') id: string): Promise<Booking> {
    return this.bookingsService.cancelBooking(id);
  }
} 