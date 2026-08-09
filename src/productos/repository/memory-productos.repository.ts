import { Prisma, Producto } from '../../generated/prisma/client';
import { NewProducto, ProductosRepository } from './productos.repository';

export class MemoryProductosRepository implements ProductosRepository {
  private readonly rows = new Map<number, Producto>();
  private nextId = 1;

  findAll(): Promise<Producto[]> {
    return Promise.resolve([...this.rows.values()]);
  }

  findById(id: number): Promise<Producto | null> {
    return Promise.resolve(this.rows.get(id) ?? null);
  }

  create(data: NewProducto): Promise<Producto> {
    const now = new Date();
    const id = this.nextId++;
    const producto: Producto = {
      id: id,
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: new Prisma.Decimal(data.precio),
      createdAt: now,
      updatedAt: now,
    };
    this.rows.set(producto.id, producto);
    return Promise.resolve(producto);
  }

  update(id: number, data: Partial<NewProducto>): Promise<Producto> {
    const current = this.rows.get(id);
    if (!current) {
      return Promise.reject(new Error(`Producto ${id} not found`));
    }

    const price =
      data.precio !== undefined
        ? new Prisma.Decimal(data.precio)
        : current.precio;

    const updated: Producto = {
      ...current,
      ...data,
      precio: price,
      updatedAt: new Date(),
    };
    this.rows.set(id, updated);
    return Promise.resolve(updated);
  }

  remove(id: number): Promise<void> {
    this.rows.delete(id);
    return Promise.resolve();
  }
}
