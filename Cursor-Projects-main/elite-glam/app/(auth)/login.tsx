import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import FormField from '../../components/FormField'
import { router } from 'expo-router'
import { authService } from '../../services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface LoginData {
  email: string
  password: string
}

interface LoginErrors {
  email?: string
  password?: string
  general?: string
}

const Login = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<LoginErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {}
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: keyof LoginData) => (text: string) => {
    setFormData(prev => ({ ...prev, [field]: text }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      console.log('Attempting login with:', {
        email: formData.email,
        password: '[REDACTED]'
      });
      
      const response = await authService.login(formData.email, formData.password)
      console.log('Login successful:', {
        uid: response.user.uid,
        username: response.user.username,
        token: response.token ? '[RECEIVED]' : '[MISSING]'
      });
      
      // Store the token
      await AsyncStorage.setItem('userToken', response.token)
      await AsyncStorage.setItem('userData', JSON.stringify(response.user))
      
      // Redirect to home
      router.replace('/(tabs)')
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      setErrors({
        general: error.response?.data?.message || 'Login failed. Please check your credentials.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>

      {errors.general && (
        <Text style={styles.generalError}>{errors.general}</Text>
      )}

      <View style={styles.form}>
        <FormField
          label="Email Address"
          value={formData.email}
          onChangeText={handleChange('email')}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />
        
        <FormField
          label="Password"
          value={formData.password}
          onChangeText={handleChange('password')}
          secureTextEntry={!showPassword}
          showPassword={showPassword}
          togglePassword={() => setShowPassword(!showPassword)}
          error={errors.password}
        />

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signInText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.registerLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  form: {
    marginTop: 24,
  },
  generalError: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#6B4EFF',
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: '#7E57C2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  signInText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: '#666',
  },
  registerLink: {
    color: '#7E57C2',
  },
})

export default Login