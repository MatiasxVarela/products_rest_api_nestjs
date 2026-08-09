import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductosService } from './productos.service';
import { ProductosRepository } from './repository/productos.repository';
import { MemoryProductosRepository } from './repository/memory-productos.repository';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

describe('ProductosService', () => {
  let service: ProductosService;
  const nuevo = { nombre: 'Producto', descripcion: 'Prueba', precio: 15000 };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductosService,
        { provide: ProductosRepository, useClass: MemoryProductosRepository },
        { provide: ConfigService, useValue: { get: () => 1500 } },
      ],
    }).compile();

    service = moduleRef.get(ProductosService);
  });

  it('Calcula bien la paginacion', async () => {
    await service.create(nuevo);
    await service.create(nuevo);
    await service.create(nuevo);

    const query = new PaginationQueryDto();
    query.limit = 2;

    const resultado = await service.findAll(query);

    expect(resultado.data).toHaveLength(2);
    expect(resultado.meta.total).toBe(3);
    expect(resultado.meta.totalPages).toBe(2);
  });

  it('Calcula bien el precio en dolares', async () => {
    const producto = await service.create(nuevo);

    expect(producto.precio).toBe('15000.00');
    expect(producto.precio_usd).toBe('10.00');
  });

  it('Hace bien el redondeo con decimanles', async () => {
    const producto = await service.create({ ...nuevo, precio: 1000 });

    expect(producto.precio_usd).toBe('0.67');
  });

  it('Tira 404 cuando no encuentra el producto', async () => {
    await expect(service.findOne(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('Elimina el producto de la db', async () => {
    const creado = await service.create(nuevo);

    await service.remove(creado.id);

    await expect(service.findOne(creado.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('No deja eliminar un producto que no existe', async () => {
    await expect(service.remove(999)).rejects.toBeInstanceOf(NotFoundException);
  });
});
