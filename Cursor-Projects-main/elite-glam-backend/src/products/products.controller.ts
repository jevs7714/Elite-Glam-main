import { Controller, Get, Post, Body, Param, Delete, Put, BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      console.log('Received create product request with data:', createProductDto);
      
      // Validate numeric fields
      if (typeof createProductDto.price !== 'number' || createProductDto.price < 0) {
        throw new BadRequestException('Price must be a positive number');
      }
      
      if (typeof createProductDto.quantity !== 'number' || createProductDto.quantity < 0) {
        throw new BadRequestException('Quantity must be a non-negative number');
      }

      const result = await this.productsService.create(createProductDto);
      console.log('Product created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error in create product controller:', error);
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      console.log('Fetching all products');
      const products = await this.productsService.findAll();
      console.log(`Found ${products.length} products`);
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      console.log('Fetching product with ID:', id);
      const product = await this.productsService.findOne(id);
      console.log('Found product:', product);
      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: Partial<CreateProductDto>) {
    try {
      console.log('Updating product with ID:', id, 'Data:', updateProductDto);
      await this.productsService.update(id, updateProductDto);
      console.log('Product updated successfully');
      return { message: 'Product updated successfully' };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      console.log('Deleting product with ID:', id);
      await this.productsService.remove(id);
      console.log('Product deleted successfully');
      return { message: 'Product deleted successfully' };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
} 