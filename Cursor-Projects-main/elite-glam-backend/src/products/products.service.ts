import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateProductDto } from './dto/create-product.dto';

export interface Product extends CreateProductDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ProductsService {
  private readonly COLLECTION = 'products';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      console.log('Attempting to create product with data:', createProductDto);
      
      const id = await this.firebaseService.create(this.COLLECTION, createProductDto);
      console.log('Product created with ID:', id);
      
      const product = await this.findOne(id);
      console.log('Retrieved created product:', product);
      
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to create product',
        { cause: error }
      );
    }
  }

  async findAll(): Promise<Product[]> {
    return this.firebaseService.findAll<Product>(this.COLLECTION);
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.firebaseService.findById<Product>(this.COLLECTION, id);
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: Partial<CreateProductDto>): Promise<void> {
    const exists = await this.firebaseService.findById(this.COLLECTION, id);
    if (!exists) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    await this.firebaseService.update(this.COLLECTION, id, updateProductDto);
  }

  async remove(id: string): Promise<void> {
    const exists = await this.firebaseService.findById(this.COLLECTION, id);
    if (!exists) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    await this.firebaseService.delete(this.COLLECTION, id);
  }
} 