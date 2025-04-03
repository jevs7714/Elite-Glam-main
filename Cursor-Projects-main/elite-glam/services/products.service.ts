import { Platform } from 'react-native';

// Get the appropriate API URL based on the platform
const getApiUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3001';
    } else if (Platform.OS === 'ios') {
      return 'http://localhost:3001';
    } else {
      return 'http://localhost:3001';
    }
  }
  return 'https://your-production-api.com';
};

const API_URL = getApiUrl();
console.log('API URL:', API_URL); // Debug log

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  quantity: number;
  rating?: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  condition?: string;
  sellerMessage?: string;
  rentAvailable?: boolean;
}

export const productsService = {
  async getAllProducts(): Promise<Product[]> {
    console.log('Fetching all products...'); // Debug log
    try {
      const response = await fetch(`${API_URL}/products`);
      console.log('Response status:', response.status); // Debug log
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText); // Debug log
        throw new Error('Failed to fetch products');
      }
      
      const products = await response.json();
      console.log('Fetched products:', products); // Debug log
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getProductById(id: string): Promise<Product> {
    console.log(`Fetching product with ID: ${id}`); // Debug log
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      console.log('Response status:', response.status); // Debug log
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText); // Debug log
        throw new Error(`Failed to fetch product with ID: ${id}`);
      }
      
      const product = await response.json();
      console.log('Fetched product:', product); // Debug log
      return product;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  },

  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    console.log('Creating product with data:', productData); // Debug log
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      console.log('Create response status:', response.status); // Debug log

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData); // Debug log
        throw new Error(errorData.message || 'Failed to create product');
      }

      const result = await response.json();
      console.log('Created product:', result); // Debug log
      return result;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }
}; 