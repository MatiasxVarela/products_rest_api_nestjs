import { PaginationMeta } from 'src/common/dto/pagination-meta.dto';

export class Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  precio_usd: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PaginatedProductos {
  data: Product[];
  meta: PaginationMeta;
}
