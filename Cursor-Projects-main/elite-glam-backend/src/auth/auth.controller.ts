import { Controller, Post, Body, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from '../users/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      console.log('Received registration request:', {
        ...createUserDto,
        password: '[REDACTED]',
        passwordConfirm: '[REDACTED]'
      });
      
      // Validate password match
      if (createUserDto.password !== createUserDto.passwordConfirm) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Validation failed',
          message: 'Passwords do not match',
        }, HttpStatus.BAD_REQUEST);
      }

      const userRecord = await this.firebaseService.createUserRecord({
        username: createUserDto.username,
        email: createUserDto.email,
        password: createUserDto.password,
      });
      
      console.log('User created successfully:', {
        uid: userRecord.uid,
        email: userRecord.email,
        username: userRecord.username
      });

      return userRecord;
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Registration failed',
        message: error.message || 'An error occurred during registration',
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      console.log('Login attempt for email:', loginDto.email);
      
      // Verify user and get user data with custom token
      const userData = await this.firebaseService.verifyPassword(loginDto.email, loginDto.password);
      console.log('User verified:', userData.uid);

      // Return user data and custom token
      return {
        user: {
          uid: userData.uid,
          email: userData.email,
          username: userData.username
        },
        token: userData.customToken
      };
    } catch (error) {
      console.error('Login failed:', error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }
} 