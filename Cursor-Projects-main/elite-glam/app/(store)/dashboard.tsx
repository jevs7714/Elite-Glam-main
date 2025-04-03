import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.storeName}>Store Dashboard</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push('/store-settings')}
          >
            <MaterialIcons name="settings" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <MaterialIcons name="shopping-bag" size={24} color="#7E57C2" />
          <Text style={styles.statValue}>₱25,420</Text>
          <Text style={styles.statLabel}>Today's Sales</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="local-shipping" size={24} color="#7E57C2" />
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Pending Orders</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="inventory" size={24} color="#7E57C2" />
          <Text style={styles.statValue}>45</Text>
          <Text style={styles.statLabel}>Products</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="visibility" size={24} color="#7E57C2" />
          <Text style={styles.statValue}>1.2k</Text>
          <Text style={styles.statLabel}>Views Today</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(store)/post-product')}
          >
            <MaterialIcons name="add-box" size={32} color="#7E57C2" />
            <Text style={styles.actionText}>Add Product</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/store/orders')}
          >
            <MaterialIcons name="list-alt" size={32} color="#7E57C2" />
            <Text style={styles.actionText}>View Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/store/products')}
          >
            <MaterialIcons name="inventory" size={32} color="#7E57C2" />
            <Text style={styles.actionText}>Manage Products</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/store/analytics')}
          >
            <MaterialIcons name="bar-chart" size={32} color="#7E57C2" />
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Orders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity onPress={() => router.push('/store/orders')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.ordersList}>
          {/* Example Order Item */}
          <TouchableOpacity style={styles.orderItem}>
            <View style={styles.orderLeft}>
              <Text style={styles.orderNumber}>#ORD-2024-001</Text>
              <Text style={styles.orderDate}>March 15, 2024</Text>
            </View>
            <View style={styles.orderRight}>
              <Text style={styles.orderAmount}>₱5,999.00</Text>
              <View style={styles.orderStatus}>
                <View style={[styles.statusDot, { backgroundColor: '#FFB300' }]} />
                <Text style={styles.statusText}>Pending</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  settingsButton: {
    padding: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    marginTop: 8,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    margin: '1%',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#7E57C2',
    fontSize: 14,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  actionButton: {
    width: '25%',
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  ordersList: {
    marginTop: 8,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderLeft: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7E57C2',
  },
  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
}); 