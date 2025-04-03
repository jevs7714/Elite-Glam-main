import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const services = [
  {
    id: 1,
    name: 'Haircut & Styling',
    description: 'Professional haircut and styling services tailored to your preferences.',
    duration: '60 min',
    price: '$50',
    icon: 'content-cut'
  },
  {
    id: 2,
    name: 'Manicure',
    description: 'Nail care and beautification for your hands.',
    duration: '45 min',
    price: '$35',
    icon: 'spa'
  },
  {
    id: 3,
    name: 'Pedicure',
    description: 'Comprehensive foot care and nail treatment.',
    duration: '45 min',
    price: '$40',
    icon: 'spa'
  },
  {
    id: 4,
    name: 'Facial Treatment',
    description: 'Revitalizing facial treatment for healthy, glowing skin.',
    duration: '60 min',
    price: '$75',
    icon: 'face'
  },
  {
    id: 5,
    name: 'Hair Coloring',
    description: 'Professional hair coloring and highlights.',
    duration: '120 min',
    price: '$120',
    icon: 'palette'
  },
];

export default function ServicesScreen() {
  const handleBookService = (serviceId: number) => {
    router.push({
      pathname: '/appointments/new',
      params: { selectedService: serviceId }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Our Services</Text>
      </View>

      <ScrollView style={styles.content}>
        {services.map((service) => (
          <View key={service.id} style={styles.serviceCard}>
            <View style={styles.serviceHeader}>
              <MaterialIcons name={service.icon as any} size={24} color="#7E57C2" />
              <View style={styles.serviceHeaderText}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDetails}>
                  {service.duration} • {service.price}
                </Text>
              </View>
            </View>
            
            <Text style={styles.serviceDescription}>
              {service.description}
            </Text>
            
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => handleBookService(service.id)}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#7E57C2',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  serviceCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  serviceDetails: {
    fontSize: 14,
    color: '#666',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  bookButton: {
    backgroundColor: '#7E57C2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
}); 