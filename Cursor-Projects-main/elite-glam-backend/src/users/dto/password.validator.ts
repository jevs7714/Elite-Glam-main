import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // At least 8 characters long
          if (value.length < 8) return false;
          
          // Contains at least one uppercase letter
          if (!/[A-Z]/.test(value)) return false;
          
          // Contains at least one lowercase letter
          if (!/[a-z]/.test(value)) return false;
          
          // Contains at least one number
          if (!/[0-9]/.test(value)) return false;
          
          // Contains at least one special character
          if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return false;
          
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character';
        },
      },
    });
  };
} 