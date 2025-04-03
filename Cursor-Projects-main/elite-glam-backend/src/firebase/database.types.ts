// Define types for our database collections
export interface UserRecord {
  uid: string;          // Firebase Auth UID
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  profile?: {
    firstName?: string;
    lastName?: string;
    photoURL?: string;
  };
}

// Type for creating a new user (includes password)
export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
}

// Type for user response (excludes sensitive data)
export interface UserResponse {
  uid: string;
  username: string;
  email: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    photoURL?: string;
  };
}

// Type for authentication response (includes custom token)
export interface AuthResponse extends UserRecord {
  customToken: string;
} 