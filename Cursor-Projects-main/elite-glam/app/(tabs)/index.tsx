import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { productsService, Product } from '../../services/products.service';

const categories = [
  { id: 'all', name: 'All' },
  { id: 'gown', name: 'Gown' },
  { id: 'suit', name: 'Suit' },
  { id: 'makeup', name: 'Make-up' },
];

const defaultProductImage = require('../../assets/images/dressProduct.png');

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setError(null);
      console.log('Starting to fetch products...'); // Debug log
      const fetchedProducts = await productsService.getAllProducts();
      console.log('Successfully fetched products:', fetchedProducts); // Debug log
      setProducts(fetchedProducts);
    } catch (error: any) {
      console.error('Error in fetchProducts:', error);
      setError(error.message || 'Failed to fetch products');
      Alert.alert('Error', 'Failed to fetch products. Pull down to refresh.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    console.log('Refreshing products...'); // Debug log
    setIsRefreshing(true);
    fetchProducts();
  }, []);

  // Fetch products when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('Screen focused, fetching products...'); // Debug log
      fetchProducts();
    }, [])
  );

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase());

  console.log('Filtered products:', filteredProducts); // Debug log

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A148C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.logo}
          />
          <Text style={styles.brandText}>
            <Text style={styles.brandE}>E</Text>
            <Text style={styles.brandLite}>lite</Text>
            <Text style={styles.brandG}>G</Text>
            <Text style={styles.brandLam}>lam</Text>
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="shopping-cart" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="notifications" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryTitle}>Category</Text>
          <TouchableOpacity>
            <MaterialIcons name="tune" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category.id && styles.categoryButtonTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products Grid */}
      <ScrollView 
        style={styles.productsContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#4A148C']}
          />
        }
      >
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {filteredProducts.length === 0 ? (
              <View style={styles.noProductsContainer}>
                <Text style={styles.noProductsText}>No products found</Text>
              </View>
            ) : (
              filteredProducts.map((product) => (
                <TouchableOpacity 
                  key={product.id} 
                  style={styles.productCard}
                  onPress={() => router.push(`/(store)/product-details?id=${product.id}`)}
                >
                  <Image 
                    source={product.image ? { uri: product.image } : defaultProductImage} 
                    style={styles.productImage} 
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <View style={styles.ratingContainer}>
                      <MaterialIcons name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingText}>{product.rating || 0}</Text>
                    </View>
                    <Text style={styles.productPrice}>PHP {product.price.toLocaleString()}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  noProductsContainer: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  noProductsText: {
    fontSize: 16,
    color: '#666',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  brandText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  brandE: { color: '#4A148C' },
  brandLite: { color: '#333' },
  brandG: { color: '#FFD700' },
  brandLam: { color: '#333' },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  categorySection: {
    padding: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  categoryButtonActive: {
    backgroundColor: '#4A148C',
    borderColor: '#4A148C',
  },
  categoryButtonText: {
    color: '#666',
    fontSize: 14,
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  productsContainer: {
    flex: 1,
    padding: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4444',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4A148C',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
  },
}); 