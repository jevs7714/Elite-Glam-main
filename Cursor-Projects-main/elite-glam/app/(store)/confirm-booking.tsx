import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { bookingService } from '../../services/booking.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Mock data for calendar
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const currentMonth = 'March 2025';
const days = Array.from({ length: 31 }, (_, i) => i + 1);

const ConfirmBooking = () => {
  const router = useRouter();
  const { productId, productName, productPrice } = useLocalSearchParams();
  
  const [selectedDate, setSelectedDate] = useState(16);
  const [eventDate, setEventDate] = useState('2025-02-03');
  const [eventTime, setEventTime] = useState('16:58');
  const [eventLocation, setEventLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Parse the price from URL params or use default
  const price = productPrice ? parseFloat(productPrice.toString()) : 5999;
  const formattedPrice = price.toLocaleString();

  const handleConfirmBooking = async () => {
    try {
      setIsSubmitting(true);

      // Get user data from storage
      const userDataStr = await AsyncStorage.getItem('userData');
      if (!userDataStr) {
        throw new Error('User data not found');
      }
      const userData = JSON.parse(userDataStr);

      // Create booking data
      const bookingData = {
        customerName: userData.username,
        serviceName: productName as string,
        date: eventDate,
        time: eventTime,
        status: 'pending' as const,
        price: price,
        notes: eventLocation,
      };

      // Submit booking
      const response = await bookingService.createBooking(bookingData);
      console.log('Booking created:', response);

      Alert.alert(
        'Success',
        'Your booking has been confirmed! You can check its status in the Booking Status screen.',
        [
          {
            text: 'View Booking',
            onPress: () => router.push('/booking-status'),
          },
          {
            text: 'Continue Shopping',
            onPress: () => router.push('/(tabs)'),
            style: 'cancel',
          },
        ]
      );
    } catch (error: any) {
      console.error('Error creating booking:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to create booking. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Booking</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Address Bar */}
      <View style={styles.addressBar}>
        <View style={styles.addressContent}>
          <Ionicons name="location" size={20} color="#6B46C1" style={styles.locationIcon} />
          <View style={styles.addressTextContainer}>
            <Text style={styles.addressName}>Juan Dela Cruz (+63) 912 345 6789</Text>
            <Text style={styles.addressDetails}>
              9.5 Espinosa Street, Toledo City, Cebu, Visayas, Philippines, 6038
            </Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Product Information (New Section) */}
        {productName && (
          <View style={styles.productInfoContainer}>
            <Text style={styles.sectionTitle}>Product</Text>
            <Text style={styles.productName}>{productName}</Text>
          </View>
        )}

        {/* Calendar Section */}
        <View style={styles.calendarContainer}>
          <Text style={styles.sectionTitle}>Select Final Fitting</Text>
          
          <View style={styles.calendarHeader}>
            <TouchableOpacity>
              <Ionicons name="chevron-back" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.monthText}>{currentMonth}</Text>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          {/* Calendar Days Header */}
          <View style={styles.daysHeader}>
            {daysOfWeek.map((day, index) => (
              <Text key={index} style={styles.dayHeaderText}>
                {day}
              </Text>
            ))}
          </View>
          
          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {days.map((day) => (
              <TouchableOpacity 
                key={day} 
                style={[
                  styles.dayCell,
                  selectedDate === day && styles.selectedDay
                ]}
                onPress={() => setSelectedDate(day)}
              >
                <Text 
                  style={[
                    styles.dayText,
                    selectedDate === day && styles.selectedDayText
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Event Details */}
        <View style={styles.eventDetailsContainer}>
          <Text style={styles.sectionTitle}>Event Details</Text>
          
          <View style={styles.eventDetailRow}>
            <Text style={styles.eventDetailLabel}>Date of Event</Text>
            <View style={styles.eventDateInputContainer}>
              <TextInput 
                style={styles.eventDateInput} 
                value={eventDate}
                onChangeText={setEventDate}
              />
              <Ionicons name="calendar" size={20} color="#666" />
            </View>
          </View>
          
          <View style={styles.eventDetailRow}>
            <Text style={styles.eventDetailLabel}>Time of Event</Text>
            <View style={styles.eventTimeInputContainer}>
              <TextInput 
                style={styles.eventTimeInput} 
                value={eventTime}
                onChangeText={setEventTime}
              />
              <Ionicons name="time-outline" size={20} color="#666" />
            </View>
          </View>
          
          <View style={styles.eventDetailRow}>
            <Text style={styles.eventDetailLabel}>Event Location</Text>
            <View style={styles.eventLocationInputContainer}>
              <TextInput 
                style={styles.eventLocationInput} 
                placeholder="Enter event location"
                placeholderTextColor="#999"
                value={eventLocation}
                onChangeText={setEventLocation}
              />
              <Ionicons name="location-outline" size={20} color="#666" />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total ₱{formattedPrice}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.confirmButton, isSubmitting && styles.confirmButtonDisabled]}
          onPress={handleConfirmBooking}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B46C1',
  },
  addressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  addressContent: {
    flexDirection: 'row',
    flex: 1,
  },
  locationIcon: {
    marginRight: 8,
  },
  addressTextContainer: {
    flex: 1,
  },
  addressName: {
    fontWeight: '500',
    fontSize: 14,
  },
  addressDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  productInfoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '500',
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayHeaderText: {
    fontSize: 14,
    color: '#666',
    width: width / 7 - 10,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayCell: {
    width: width / 7 - 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 20,
  },
  dayText: {
    fontSize: 14,
  },
  selectedDay: {
    backgroundColor: '#6B46C1',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '600',
  },
  eventDetailsContainer: {
    backgroundColor: '#fff',
    padding: 16,
  },
  eventDetailRow: {
    marginBottom: 16,
  },
  eventDetailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  eventDateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 44,
  },
  eventDateInput: {
    flex: 1,
    height: 40,
  },
  eventTimeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 44,
  },
  eventTimeInput: {
    flex: 1,
    height: 40,
  },
  eventLocationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 44,
  },
  eventLocationInput: {
    flex: 1,
    height: 40,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalContainer: {
    flex: 1,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#6B46C1',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  confirmButtonDisabled: {
    opacity: 0.7,
  },
});

export default ConfirmBooking; 