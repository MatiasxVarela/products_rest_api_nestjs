import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { ProductosRepository } from './repository/productos.repository';
import { PrismaProductosRepository } from './repository/prisma-productos.repository';

@Module({
  controllers: [ProductosController],
  providers: [
    ProductosService,
    { provide: ProductosRepository, useClass: PrismaProductosRepository },
  ],
})
export class ProductosModule {}
