'use client';

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { productsService, Product } from '../../services/products.service';

const { width } = Dimensions.get('window');

const defaultProductImage = require('../../assets/images/dressProduct.png');

const ProductDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) {
        setError('No product ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const productData = await productsService.getProductById(id.toString());
        setProduct(productData);
      } catch (error: any) {
        console.error('Error fetching product details:', error);
        setError(error.message || 'Failed to load product details');
        Alert.alert('Error', 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6B46C1" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Product not found'}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={product.image ? { uri: product.image } : defaultProductImage}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        {/* Price */}
        <Text style={styles.price}>PHP {product.price?.toLocaleString() || '0'}{product.rentAvailable ? '/RENT' : ''}</Text>

        {/* Title and Description */}
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.description}>
          {product.description || 'No description available'}
        </Text>

        {/* Condition */}
        <View style={styles.conditionContainer}>
          <Text style={styles.conditionTitle}>Condition: {product.condition || 'New'}</Text>
          {product.sellerMessage && (
            <Text style={styles.conditionDescription}>
              "{product.sellerMessage}"
            </Text>
          )}
        </View>

        {/* Ratings */}
        <View style={styles.ratingsContainer}>
          <View style={styles.ratingWrapper}>
            <FontAwesome name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingNumber}>({product.rating || '4.8'})</Text>
          </View>
          <Text style={styles.ratingText}>Products Ratings</Text>
        </View>

        {/* Review - This would come from actual reviews in a real implementation */}
        <View style={styles.reviewContainer}>
          <View style={styles.reviewHeader}>
            <View style={styles.avatarPlaceholder} />
            <View style={styles.reviewInfo}>
              <View style={styles.reviewNameContainer}>
                <Text style={styles.reviewName}>Jessa Mae</Text>
                <Text style={styles.heartIcon}>❤️</Text>
                <Text style={styles.reviewCount}>47</Text>
              </View>
              <Text style={styles.helpfulText}>Helpful (20)</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialCommunityIcons name="chat-outline" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialCommunityIcons name="cart-outline" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => router.push({
            pathname: '/(store)/confirm-booking',
            params: {
              productId: product.id,
              productName: product.name,
              productPrice: product.price
            }
          })}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#6B46C1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B46C1',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    height: width * 0.75,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 8,
    marginHorizontal: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    marginHorizontal: 16,
    lineHeight: 24,
  },
  conditionContainer: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  conditionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  conditionDescription: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
  },
  ratingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingNumber: {
    marginLeft: 4,
    fontWeight: '600',
  },
  ratingText: {
    marginLeft: 8,
    color: '#666',
  },
  reviewContainer: {
    marginTop: 16,
    marginHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  reviewInfo: {
    marginLeft: 12,
  },
  reviewNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewName: {
    fontWeight: '600',
  },
  heartIcon: {
    marginLeft: 8,
  },
  reviewCount: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  helpfulText: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bookButton: {
    flex: 1,
    backgroundColor: '#6B46C1',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetails; 