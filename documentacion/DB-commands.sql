-- crear base de datos
CREATE DATABASE ecommerce;

-- crear usuario
CREATE USER 'DBadmin'@'localhost' IDENTIFIED BY '1234';
--Dar permisos SOLO sobre esa base de datos
GRANT ALL PRIVILEGES ON ecommerce.* TO 'DBadmin'@'localhost';
--Aplicar cambios
FLUSH PRIVILEGES;

SHOW GRANTS FOR 'DBadmin'@'localhost';

-- DESDE DB ADMIN
USE eccommerce;

--tabla  usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);

--INSERT INTO users (username, password) VALUES ('julen', 1234);

--parte productos
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

INSERT INTO
    categorias (nombre)
VALUES ('Palas'),
    ('Bolas'),
    ('Paleteros'),
    ('Ropa');

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    categoria_id INT,
    FOREIGN KEY (categoria_id) REFERENCES categorias (id)
);

--crear usuario seguro para que lo use la api

CREATE USER 'api_ecommerce'@'localhost' IDENTIFIED BY '1234';

GRANT
SELECT,
INSERT
    ON ecommerce.users TO 'api_ecommerce'@'localhost';

GRANT SELECT ON ecommerce.categorias TO 'api_ecommerce'@'localhost';

GRANT
SELECT,
INSERT
,
UPDATE,
DELETE ON ecommerce.productos TO 'api_ecommerce'@'localhost';

FLUSH PRIVILEGES;

SHOW GRANTS FOR 'api_ecommerce'@'localhost';