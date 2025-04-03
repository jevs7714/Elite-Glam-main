import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FirebaseService } from '../../firebase/firebase.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly firebaseService: FirebaseService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      console.log('No authorization header found');
      throw new UnauthorizedException('No authorization header');
    }

    try {
      console.log('Verifying token from authorization header...');
      const decodedToken = await this.firebaseService.verifyToken(authHeader);
      
      // Set the user in the request object
      request.user = decodedToken;
      console.log('Token verified successfully for user:', decodedToken.uid);
      
      return true;
    } catch (error) {
      console.error('Token verification failed in JwtAuthGuard:', {
        error: error.message,
        stack: error.stack
      });
      throw new UnauthorizedException('Invalid token');
    }
  }
} 