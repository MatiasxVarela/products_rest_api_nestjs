import { Producto } from 'src/generated/prisma/client';
import { NewProducto, ProductosRepository } from './productos.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Pagination } from 'src/common/interfaces/pagination.interface';

@Injectable()
export class PrismaProductosRepository implements ProductosRepository {
  constructor(private readonly prisma: PrismaService) {}

  count(): Promise<number> {
    return this.prisma.producto.count();
  }

  findAll({ skip, take }: Pagination): Promise<Producto[]> {
    return this.prisma.producto.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number): Promise<Producto | null> {
    return this.prisma.producto.findUnique({ where: { id } });
  }

  async create(data: NewProducto): Promise<Producto> {
    return this.prisma.producto.create({ data });
  }

  async update(id: number, data: Partial<NewProducto>): Promise<Producto> {
    return this.prisma.producto.update({ where: { id }, data });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.producto.delete({ where: { id } });
  }
}
