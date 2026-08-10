# Api crud de productos

Api rest para manejar un catálogo de productos, con cálculo del precio de los productos a dólares.

## Instrucciones de instalación

### Instalación con docker

```bash
git clone https://github.com/MatiasxVarela/products_rest_api_nestjs

cd products_rest_api_nestjs

cp .env.example .env

docker compose up --build
```

### Instalación para desarrollo

```bash
npm install

cp .env.example .env

docker compose up -d db

npx prisma migrate dev

npx prisma generate

npm run start:dev
```

Queda expuesto por defecto en el puerto local 3000

## Configuración del entorno

| Variable           | Descripción          | Ejemplo           |
| ------------------ | -------------------- | ----------------- |
| `PORT`             | Puerto backend       | `3000`            |
| `PRECIO_USD`       | Cotización del dólar | `1500`            |
| `DB_HOST`          | Host MySQL           | `localhost`       |
| `DB_PORT`          | Puerto MySQL         | `3306`            |
| `DB_NAME`          | Nombre de la DB      | `products_db`     |
| `DB_ROOT_PASSWORD` | DB root password     | `example`         |
| `DATABASE_URL`     | DB url               | `mysql://root...` |

Recomendamos que `DATABASE_URL` se auto componga ejemplo:

```
DATABASE_URL=mysql://root:${DB_ROOT_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
```

## Configuración de PRECIO_USD

Se usa para calcular el valor en USD de los productos almacenados.

### ⚠️ Importante ⚠️

`PRECIO_USD` Es el único lugar donde se almacena el precio del dólar.

Con este valor de referencia se hacen TODAS las operaciones para ver el valor del producto en dólares, ya que este `precio_usd` del producto no se almacena en la DB.

### Cómo configurarlo

El valor de cambio del dólar se almacena en la variable de entorno `PRECIO_USD`

Para el cálculo se hace `precio_usd` = `precio` / `PRECIO_USD`

Los precios de los productos cuando retornan se ven algo así:

```json
{
  "precio": "15000.00",
  "precio_usd": "10.00"
}
```

En el caso de ser necesario `PRECIO_USD` acepta decimales.
Por ejemplo; `PRECIO_USD`=`1500.50`

## Cómo ejecutar Docker Compose

Compose levanta dos servicios:

| Servicio | Descripción                         | Puerto |
| -------- | ----------------------------------- | ------ |
| `db`     | MySQL 8 con persistencia de volumen | `3306` |
| `api`    | Backend con NestJS                  | `3000` |

### Comandos válidos

```bash
docker compose up --build      # construye imágenes y las levanta
docker compose up -d           # Levanta los servicios en segundo plano
docker compose logs -f api     # ver logs del backend
docker compose down            # detener los contenedores
docker compose down -v         # detener los contenedores y borrar la DB
```

## Cómo probar la API

La api se compone de una endpoint para ver el estado del servidor y los endpoints necesarios para el crud de productos.

### Recomendamos swagger para mejor comprensión de la api

La api esta documentada con swagger, por lo cual para una mejor comprensión de la misma recomendamos usarlo para entender los endpoints.

Ya con el backend levantado podemos hacer:

#### Get /api

Para explorar y ejecutar todos los endpoints con Swagger

### GET /health

Se usa para ver el estado del backend.

Retorna:

```json
{ "status": "ok" }
```

### /productos

Endpoints para el módulo de productos:

#### POST /productos

Crea un producto.

Recibe:

```json
{
  "nombre": "Teclado",
  "descripcion": "Mecánico",
  "precio": 15000
}
```

Retorna:

```json
{
  "id": 1,
  "nombre": "Teclado",
  "descripcion": "Mecánico",
  "precio": "15000.00",
  "precio_usd": "10.00",
  "createdAt": "2026-08-09T12:00:00.000Z",
  "updatedAt": "2026-08-09T12:00:00.000Z"
}
```

#### GET /productos

Devuelve un array de productos paginados y la metadata de paginación.

Acepta los parámetros opcionales `page` y `limit`

```
GET /productos?page=1&limit=10
```

Retorna:

```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Teclado",
      "descripcion": "Mecánico",
      "precio": "15000.00",
      "precio_usd": "10.00",
      "createdAt": "2026-08-09T12:00:00.000Z",
      "updatedAt": "2026-08-09T12:00:00.000Z"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

#### GET /productos/{id}

Devuelve un producto.

Retorna:

```json
{
  "id": 1,
  "nombre": "Teclado",
  "descripcion": "Mecánico",
  "precio": "15000.00",
  "precio_usd": "10.00",
  "createdAt": "2026-08-09T12:00:00.000Z",
  "updatedAt": "2026-08-09T12:00:00.000Z"
}
```

Si no existe el producto, responde con un `404`:

```json
{
  "message": "Producto 999 no encontrado",
  "error": "Not Found",
  "statusCode": 404
}
```

#### PUT /productos/{id}

Reemplaza un producto.

Recibe:

```json
{
  "nombre": "Teclado",
  "descripcion": "Mecánico RGB",
  "precio": 18000
}
```

Retorna:

```json
{
  "id": 1,
  "nombre": "Teclado",
  "descripcion": "Mecánico RGB",
  "precio": "18000.00",
  "precio_usd": "12.00",
  "createdAt": "2026-08-09T12:00:00.000Z",
  "updatedAt": "2026-08-09T12:30:00.000Z"
}
```

Si no existe el producto, responde con un `404`:

```json
{
  "message": "Producto 999 no encontrado",
  "error": "Not Found",
  "statusCode": 404
}
```

#### DELETE /productos/{id}

Elimina un producto.

Retorna:

```json
{
  "message": "Producto 1 eliminado correctamente"
}
```

Si no existe el producto, responde con un `404`:

```json
{
  "message": "Producto 999 no encontrado",
  "error": "Not Found",
  "statusCode": 404
}
```

## Tests

Para correr las suites de tests se usa el comando

```bash
npm test
```

Los tests corren con un repositorio en memoria.
