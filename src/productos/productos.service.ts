import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Prisma, Producto as PrismaProducto } from '../generated/prisma/client';
import { ProductosRepository } from './repository/productos.repository';
import { EnvironmentVariables } from 'src/config/env.validation';
import { ConfigService } from '@nestjs/config';
import { Product } from './entities/producto.entity';

@Injectable()
export class ProductosService {
  constructor(
    private readonly repository: ProductosRepository,
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {}

  private addUsdPriceToProduct(product: PrismaProducto): Product {
    const usdPrice = new Prisma.Decimal(
      this.config.get('PRECIO_USD', { infer: true }),
    );

    return {
      ...product,
      precio: product.precio.toFixed(2),
      precio_usd: product.precio.div(usdPrice).toDecimalPlaces(2).toFixed(2),
    };
  }

  private mapUsdPriceToProducts(products: PrismaProducto[]): Product[] {
    return products.map((product) => this.addUsdPriceToProduct(product));
  }

  async create(createProductoDto: CreateProductoDto): Promise<Product> {
    const product = await this.repository.create(createProductoDto);
    return this.addUsdPriceToProduct(product);
  }

  async findAll(): Promise<Product[]> {
    const products = await this.repository.findAll();
    return this.mapUsdPriceToProducts(products);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new NotFoundException(`Producto ${id} no encontrado`);
    }
    return this.addUsdPriceToProduct(product);
  }

  async update(
    id: number,
    updateProductoDto: UpdateProductoDto,
  ): Promise<Product> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new NotFoundException(`Producto ${id} no encontrado`);
    }
    const updatedProduct = await this.repository.update(id, updateProductoDto);
    return this.addUsdPriceToProduct(updatedProduct);
  }

  async remove(id: number): Promise<{ message: string }> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new NotFoundException(`Producto ${id} no encontrado`);
    }
    return { message: `Producto ${id} eliminado correctamente` };
  }
}
