import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS with all necessary development URLs
  app.enableCors({
    origin: [
      'http://localhost:19006',  // Expo web
      'http://localhost:8081',   // Expo dev server
      'http://localhost:19000',  // Expo Go
      'http://localhost:19001',  // Expo Metro bundler
      'http://localhost:19002',  // Expo Dev Tools
      'exp://localhost:19000',   // Expo Go local
      'http://10.0.2.2:3000',   // Android Emulator
      'http://localhost:3001',   // Backend server
      'http://localhost:8082',   // Frontend web
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Enable validation with detailed error messages
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: false,
    disableErrorMessages: false,
    validationError: {
      target: false,
      value: false,
    },
  }));

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
