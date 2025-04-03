import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { bookingService, Booking } from '../../services/booking.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

type BookingStatus = keyof typeof STATUS_COLORS;

export default function BookingStatusScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | null>(null);

  const fetchBookings = async () => {
    try {
      console.log('Starting to fetch bookings...');
      const data = await bookingService.getAllBookings();
      console.log('Received bookings data:', data);
      setBookings(data);
    } catch (error: any) {
      console.error('Error in fetchBookings:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Handle authentication errors
      if (error.response?.status === 401) {
        console.log('Received 401 error, redirecting to login');
        await AsyncStorage.removeItem('userToken');
        router.replace('/(auth)/login');
      } else {
        Alert.alert(
          'Error',
          'Failed to load bookings. Please try again later.'
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const loadBookings = async () => {
      try {
        // Check if user is logged in
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.log('No authentication token found, redirecting to login');
          router.replace('/(auth)/login');
          return;
        }

        console.log('Booking status screen mounted, fetching bookings...');
        await fetchBookings();
      } catch (error: any) {
        console.error('Error in loadBookings:', error);
        // If unauthorized, redirect to login
        if (error.response?.status === 401) {
          console.log('Received 401 error, redirecting to login');
          await AsyncStorage.removeItem('userToken');
          router.replace('/(auth)/login');
        }
      }
    };

    loadBookings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus);
      // Refresh the bookings list
      fetchBookings();
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      Alert.alert(
        'Error',
        'Failed to update booking status. Please try again.'
      );
    }
  };

  const filteredBookings = selectedStatus
    ? bookings.filter(booking => booking.status === selectedStatus)
    : bookings;

  const renderStatusFilter = () => (
    <View style={styles.filterContainer}>
      {(Object.keys(STATUS_COLORS) as BookingStatus[]).map((status) => (
        <TouchableOpacity
          key={status}
          style={[
            styles.filterButton,
            selectedStatus === status && styles.filterButtonActive,
            { backgroundColor: selectedStatus === status ? STATUS_COLORS[status] : 'transparent' }
          ]}
          onPress={() => setSelectedStatus(selectedStatus === status ? null : status)}
        >
          <MaterialIcons
            name={STATUS_ICONS[status]}
            size={20}
            color={selectedStatus === status ? 'white' : STATUS_COLORS[status]}
          />
          <Text
            style={[
              styles.filterText,
              { color: selectedStatus === status ? 'white' : STATUS_COLORS[status] }
            ]}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => {
        router.push({
          pathname: '/booking-details',
          params: { id: item.id }
        });
      }}
    >
      <View style={styles.bookingHeader}>
        <View>
          <Text style={styles.customerName}>{item.customerName}</Text>
          <Text style={styles.serviceName}>{item.serviceName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] }]}>
          <MaterialIcons
            name={STATUS_ICONS[item.status]}
            size={16}
            color="white"
          />
          <Text style={styles.statusText}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <MaterialIcons name="event" size={16} color="#666" />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="access-time" size={16} color="#666" />
          <Text style={styles.detailText}>{item.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="attach-money" size={16} color="#666" />
          <Text style={styles.detailText}>${item.price}</Text>
        </View>
      </View>

      {item.notes && (
        <View style={styles.notesContainer}>
          <MaterialIcons name="notes" size={16} color="#666" />
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      )}

      {item.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.confirmButton]}
            onPress={() => handleStatusUpdate(item.id, 'confirmed')}
          >
            <MaterialIcons name="check-circle" size={20} color="white" />
            <Text style={styles.actionButtonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => handleStatusUpdate(item.id, 'cancelled')}
          >
            <MaterialIcons name="cancel" size={20} color="white" />
            <Text style={styles.actionButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B4EFF" />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Booking Status</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/confirm-booking')}
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {renderStatusFilter()}

      <FlatList
        data={filteredBookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#6B4EFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterButtonActive: {
    borderColor: 'transparent',
  },
  filterText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  serviceName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  bookingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  notesText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
    flex: 1,
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
}); 