import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedProductos, Product } from './entities/producto.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

@ApiTags('productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  create(@Body() createProductoDto: CreateProductoDto): Promise<Product> {
    return this.productosService.create(createProductoDto);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto): Promise<PaginatedProductos> {
    return this.productosService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productosService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ): Promise<Product> {
    return this.productosService.update(id, updateProductoDto);
  }

  @Delete(':id')
  @ApiOkResponse({ example: { message: 'Producto 1 eliminado correctamente' } })
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.productosService.remove(id);
  }
}
