# Proyecto de E-commerce

Backend para una aplicación de e-commerce construido con NestJS.

## Descripción

Este proyecto proporciona una API RESTful para gestionar artículos, categorías y proveedores. Está construido con NestJS y utiliza TypeORM para la interacción con la base de datos.

## Instalación

Para instalar las dependencias del proyecto, ejecuta el siguiente comando:

```bash
npm install
```

## Ejecutar la Aplicación

Para iniciar la aplicación en modo de desarrollo con recarga automática, usa:

```bash
npm run start:dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Ejecutar Pruebas

Para ejecutar las pruebas unitarias, utiliza:

```bash
npm run test
```

Para ejecutar las pruebas end-to-end, utiliza:

```bash
npm run test:e2e
```

## API Endpoints

La API proporciona los siguientes endpoints para gestionar los recursos de la aplicación.

---

### Artículos

**Ruta base:** `/articulos`

| Método | Ruta        | Descripción                  | Payload (Body)        |
| :----- | :---------- | :--------------------------- | :-------------------- |
| `POST` | `/`         | Crear un nuevo artículo      | `CreateArticuloDto`   |
| `GET`    | `/`         | Obtener todos los artículos  | N/A                   |
| `GET`    | `/:id`      | Obtener un artículo por ID   | N/A                   |
| `PATCH`  | `/:id`      | Actualizar un artículo por ID| `UpdateArticuloDto`   |
| `DELETE` | `/:id`      | Eliminar un artículo por ID  | N/A                   |

#### `CreateArticuloDto`

```typescript
{
  "codigo": "string",
  "nombre": "string",
  "descripcion": "string" (opcional),
  "categoria_id": "number" (opcional),
  "precio_unitario": "number",
  "stock_actual": "number",
  "stock_minimo": "number",
  "unidad_medida": "string" (opcional),
  "proveedor_id": "number" (opcional),
  "imagen_url": "string" (opcional, URL)
}
```

---

### Categorías

**Ruta base:** `/categorias`

| Método | Ruta        | Descripción                    | Payload (Body)         |
| :----- | :---------- | :----------------------------- | :--------------------- |
| `POST` | `/`         | Crear una nueva categoría      | `CreateCategoriaDto`   |
| `GET`    | `/`         | Obtener todas las categorías   | N/A                    |
| `GET`    | `/:id`      | Obtener una categoría por ID   | N/A                    |
| `PATCH`  | `/:id`      | Actualizar una categoría por ID| `UpdateCategoriaDto`   |
| `DELETE` | `/:id`      | Eliminar una categoría por ID  | N/A                    |

#### `CreateCategoriaDto`

```typescript
{
  "nombre": "string",
  "descripcion": "string" (opcional)
}
```

---

### Proveedores

**Ruta base:** `/proveedores`

| Método | Ruta        | Descripción                   | Payload (Body)          |
| :----- | :---------- | :---------------------------- | :---------------------- |
| `POST` | `/`         | Crear un nuevo proveedor      | `CreateProveedoreDto`   |
| `GET`    | `/`         | Obtener todos los proveedores | N/A                     |
| `GET`    | `/:id`      | Obtener un proveedor por ID   | N/A                     |
| `PATCH`  | `/:id`      | Actualizar un proveedor por ID| `UpdateProveedoreDto`   |
| `DELETE` | `/:id`      | Eliminar un proveedor por ID  | N/A                     |

#### `CreateProveedoreDto`

```typescript
{
  "nombre": "string",
  "contacto": "string" (opcional),
  "telefono": "string" (opcional),
  "email": "string" (opcional, email),
  "direccion": "string" (opcional)
}
```