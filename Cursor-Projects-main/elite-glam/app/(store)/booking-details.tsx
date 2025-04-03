import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { bookingService, Booking } from '../../services/booking.service';

const STATUS_COLORS = {
  pending: '#FFA500',
  confirmed: '#4CAF50',
  completed: '#2196F3',
  cancelled: '#F44336',
} as const;

const STATUS_ICONS = {
  pending: 'schedule' as const,
  confirmed: 'check-circle' as const,
  completed: 'done-all' as const,
  cancelled: 'cancel' as const,
} as const;

export default function BookingDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      const data = await bookingService.getBookingById(id as string);
      setBooking(data);
    } catch (error: any) {
      console.error('Error fetching booking details:', error);
      Alert.alert(
        'Error',
        'Failed to load booking details. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: Booking['status']) => {
    try {
      await bookingService.updateBookingStatus(id as string, newStatus);
      // Refresh the booking details
      fetchBookingDetails();
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      Alert.alert(
        'Error',
        'Failed to update booking status. Please try again.'
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B4EFF" />
        <Text style={styles.loadingText}>Loading booking details...</Text>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Booking not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Booking Details</Text>
      </View>

      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[booking.status] }]}>
          <MaterialIcons
            name={STATUS_ICONS[booking.status]}
            size={20}
            color="white"
          />
          <Text style={styles.statusText}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <View style={styles.infoRow}>
          <MaterialIcons name="person" size={20} color="#666" />
          <Text style={styles.infoText}>{booking.customerName}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="event" size={20} color="#666" />
          <Text style={styles.infoText}>{booking.date}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="access-time" size={20} color="#666" />
          <Text style={styles.infoText}>{booking.time}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Service Details</Text>
        <View style={styles.infoRow}>
          <MaterialIcons name="spa" size={20} color="#666" />
          <Text style={styles.infoText}>{booking.serviceName}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="attach-money" size={20} color="#666" />
          <Text style={styles.infoText}>${booking.price}</Text>
        </View>
      </View>

      {booking.notes && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <View style={styles.notesContainer}>
            <MaterialIcons name="notes" size={20} color="#666" />
            <Text style={styles.notesText}>{booking.notes}</Text>
          </View>
        </View>
      )}

      {booking.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.confirmButton]}
            onPress={() => handleStatusUpdate('confirmed')}
          >
            <MaterialIcons name="check-circle" size={24} color="white" />
            <Text style={styles.actionButtonText}>Confirm Booking</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => handleStatusUpdate('cancelled')}
          >
            <MaterialIcons name="cancel" size={24} color="white" />
            <Text style={styles.actionButtonText}>Cancel Booking</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    padding: 16,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notesText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  actionButtons: {
    padding: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
}); 