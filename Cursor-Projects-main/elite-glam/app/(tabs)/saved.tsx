import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Example saved products (in a real app, this would come from a state management system or backend)
const savedProducts = [
  {
    id: 1,
    name: 'Princess Purple Quinceanera Dress',
    rating: 4.8,
    price: 5999.00,
    image: require('../../assets/images/dressProduct.png'),
  },
  {
    id: 2,
    name: 'Princess Purple Quinceanera Dress',
    rating: 4.8,
    price: 5999.00,
    image: require('../../assets/images/dressProduct.png'),
  },
];

export default function SavedScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Items</Text>
      </View>

      {/* Saved Items List */}
      <ScrollView style={styles.content}>
        {savedProducts.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <MaterialIcons name="favorite-border" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No saved items yet</Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => router.push('/')}
            >
              <Text style={styles.browseButtonText}>Browse Products</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {savedProducts.map((product) => (
              <TouchableOpacity 
                key={product.id} 
                style={styles.productCard}
                onPress={() => router.push(`/product/${product.id}`)}
              >
                <Image source={product.image} style={styles.productImage} />
                <TouchableOpacity 
                  style={styles.favoriteButton}
                  onPress={() => {
                    // In a real app, this would remove the item from saved items
                    console.log('Remove from saved');
                  }}
                >
                  <MaterialIcons name="favorite" size={24} color="#7E57C2" />
                </TouchableOpacity>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <MaterialIcons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{product.rating}</Text>
                  </View>
                  <Text style={styles.productPrice}>PHP {product.price.toLocaleString()}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 64,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#7E57C2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  productCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
}); 