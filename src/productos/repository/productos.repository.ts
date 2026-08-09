import { Producto } from '../../generated/prisma/client';

export type NewProducto = {
  nombre: string;
  descripcion: string;
  precio: number;
};

export abstract class ProductosRepository {
  abstract findAll(): Promise<Producto[]>;
  abstract findById(id: number): Promise<Producto | null>;
  abstract create(data: NewProducto): Promise<Producto>;
  abstract update(id: number, data: Partial<NewProducto>): Promise<Producto>;
  abstract remove(id: number): Promise<void>;
}
