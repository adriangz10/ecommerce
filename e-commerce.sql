-- Tabla: proveedores
CREATE TABLE proveedores (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    direccion VARCHAR(255),
    estado TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
    fecha_alta DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: categorias
CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    estado TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo'
);

-- Tabla: articulos
CREATE TABLE articulos (
    id_articulo INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    categoria_id INT,
    precio_unitario DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    stock_actual INT NOT NULL DEFAULT 0,
    stock_minimo INT NOT NULL DEFAULT 0,
    unidad_medida VARCHAR(20) DEFAULT 'unidad',
    proveedor_id INT,
    imagen_url VARCHAR(255),
    estado TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=activo, 0=inactivo',
    fecha_alta DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categorias(id_categoria)
        ON DELETE SET NULL,

    CONSTRAINT fk_proveedor
        FOREIGN KEY (proveedor_id)
        REFERENCES proveedores(id_proveedor)
        ON DELETE SET NULL,

    INDEX idx_categoria (categoria_id),
    INDEX idx_proveedor (proveedor_id),
    INDEX idx_nombre (nombre)
);