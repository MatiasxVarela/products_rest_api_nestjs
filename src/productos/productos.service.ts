import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Prisma, Producto as PrismaProducto } from '../generated/prisma/client';
import { ProductosRepository } from './repository/productos.repository';
import { EnvironmentVariables } from 'src/config/env.validation';
import { ConfigService } from '@nestjs/config';
import { Product } from './entities/producto.entity';
import { PaginationResult } from 'src/common/interfaces/pagination.interface';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';
import { Logger } from '@nestjs/common';

@Injectable()
export class ProductosService {
  constructor(
    private readonly repository: ProductosRepository,
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {}
  private readonly logger = new Logger(ProductosService.name);

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
    this.logger.log({ productoId: product.id }, 'Producto creado');
    return this.addUsdPriceToProduct(product);
  }

  async findAll(query: PaginationQueryDto): Promise<PaginationResult<Product>> {
    const [productos, total] = await Promise.all([
      this.repository.findAll({ skip: query.skip, take: query.limit }),
      this.repository.count(),
    ]);
    this.logger.log(
      { page: query.page, limit: query.limit, total },
      'Productos obtenidos',
    );
    return {
      data: this.mapUsdPriceToProducts(productos),
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.repository.findById(id);
    this.logger.log({ productoId: id }, 'Producto obtenido');
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
    this.logger.log({ productoId: updatedProduct.id }, 'Producto actualizado');
    return this.addUsdPriceToProduct(updatedProduct);
  }

  async remove(id: number): Promise<{ message: string }> {
    const product = await this.repository.findById(id);
    if (!product) {
      throw new NotFoundException(`Producto ${id} no encontrado`);
    }
    await this.repository.remove(id);
    this.logger.log({ productoId: id }, 'Producto eliminado');
    return { message: `Producto ${id} eliminado correctamente` };
  }
}
