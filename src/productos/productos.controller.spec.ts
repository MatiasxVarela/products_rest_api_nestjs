import { Test } from '@nestjs/testing';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

describe('ProductosController', () => {
  let controller: ProductosController;
  const serviceMock = {
    findAll: jest.fn(() => Promise.resolve([])),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProductosController],
      providers: [{ provide: ProductosService, useValue: serviceMock }],
    }).compile();

    controller = moduleRef.get(ProductosController);
  });

  it('Le pasa el listado al service', async () => {
    await controller.findAll(new PaginationQueryDto());

    expect(serviceMock.findAll).toHaveBeenCalled();
  });
});
