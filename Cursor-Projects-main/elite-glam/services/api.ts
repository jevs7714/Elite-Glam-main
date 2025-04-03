import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Choose the appropriate URL based on platform
const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3001';  // Android emulator
    } else if (Platform.OS === 'ios') {
      return 'http://localhost:3001';  // iOS simulator
    } else if (Platform.OS === 'web') {
      return 'http://localhost:3001';  // Web browser
    }
  }
  // Production URL (change this to your production API URL)
  return 'https://your-production-api.com';
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Add timeout to detect connection issues
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    console.log('Request interceptor for:', config.url);
    console.log('Token status:', token ? 'Found' : 'Not found');
    
    if (token) {
      // Remove any existing Bearer prefix
      const cleanToken = token.replace('Bearer ', '');
      
      // Validate token format (basic check)
      if (cleanToken.split('.').length !== 3) {
        console.warn('Invalid token format detected');
        await AsyncStorage.removeItem('userToken');
        return config;
      }

      // Add Bearer prefix
      config.headers.Authorization = `Bearer ${cleanToken}`;
      console.log('Added token to request headers:', {
        tokenLength: cleanToken.length,
        headerValue: `Bearer ${cleanToken.substring(0, 10)}...`
      });
    } else {
      console.log('No token found in AsyncStorage');
      delete config.headers.Authorization;
    }
    
    return config;
  } catch (error) {
    console.error('Error in request interceptor:', error);
    return config;
  }
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log('Received 401 error, clearing token');
      await AsyncStorage.removeItem('userToken');
      // Instead of using router directly, we'll let the components handle navigation
      // This is because we can't use hooks outside of React components
    }
    return Promise.reject(error);
  }
);

// Log the actual API URL being used
console.log('Platform:', Platform.OS);
console.log('API URL:', api.defaults.baseURL);

export const authService = {
  login: async (email: string, password: string) => {
    try {
      console.log('Making login request to:', `${api.defaults.baseURL}/auth/login`);
      console.log('Request headers:', api.defaults.headers);
      console.log('With data:', {
        email,
        password: '[REDACTED]'
      });
      
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response received:', {
        status: response.status,
        statusText: response.statusText,
        hasToken: !!response.data.token,
        tokenType: response.data.token ? typeof response.data.token : 'none'
      });

      if (!response.data.token) {
        console.error('No token received in login response');
        throw new Error('No token received from server');
      }

      // Validate token format
      const token = response.data.token;
      if (typeof token !== 'string' || token.split('.').length !== 3) {
        console.error('Invalid token format received');
        throw new Error('Invalid token format received from server');
      }

      // Store the clean token (without Bearer prefix)
      const cleanToken = token.replace('Bearer ', '');
      console.log('Storing token in AsyncStorage...');
      await AsyncStorage.setItem('userToken', cleanToken);
      console.log('Token stored successfully');

      // Store user data separately
      if (response.data.user) {
        console.log('Storing user data...');
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        console.log('User data stored successfully');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login error details:', {
        message: error.message,
        response: {
          data: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText
        },
        request: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      throw error;
    }
  },

  register: async (userData: {
    username: string,
    email: string,
    password: string,
    passwordConfirm: string
  }) => {
    try {
      // Log the request details
      console.log('Making registration request to:', `${api.defaults.baseURL}/auth/register`);
      console.log('Request headers:', api.defaults.headers);
      console.log('With data:', {
        username: userData.username,
        email: userData.email,
        password: '[REDACTED]',
        passwordConfirm: '[REDACTED]'
      });
      
      // Make the request with full URL
      const response = await api.post(`${api.defaults.baseURL}/auth/register`, userData);
      
      console.log('Registration success response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      return response.data;
    } catch (error: any) {
      // Enhanced error logging
      const errorDetails = {
        message: error.message,
        code: error.code,
        request: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers,
          data: error.config?.data
        },
        response: error.response ? {
          data: error.response.data,
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers
        } : undefined
      };
      
      console.error('Registration error details:', errorDetails);
      
      // Throw a more informative error
      throw new Error(`Registration failed: ${error.message}. ${error.response?.data?.message || ''}`);
    }
  }
}; 