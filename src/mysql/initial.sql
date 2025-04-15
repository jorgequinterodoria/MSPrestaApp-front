create database if not exists prestamos;

-- Crear las tablas con sus tipos de datos apropiados para MySQL
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL, -- Nuevo campo para la contraseña
  role ENUM('ADMINISTRADOR', 'PRESTAMISTA', 'CLIENTE') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  status ENUM('active', 'disabled', 'completed') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loans (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  client_id CHAR(36) NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  interest_rate DECIMAL(5,2) NOT NULL CHECK (interest_rate >= 0),
  payment_type ENUM('capital', 'interest') NOT NULL,
  start_date DATE NOT NULL,
  status ENUM('active', 'disabled', 'completed') DEFAULT 'active',
  remaining_amount DECIMAL(10,2) NOT NULL CHECK (remaining_amount >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE TABLE IF NOT EXISTS payments (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  loan_id CHAR(36) NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  payment_date DATE NOT NULL,
  payment_type ENUM('capital', 'interest') NOT NULL,
  status ENUM('active', 'disabled', 'completed') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (loan_id) REFERENCES loans(id)
);

CREATE TABLE IF NOT EXISTS debts (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  loan_id CHAR(36) NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  due_date DATE NOT NULL,
  status ENUM('pending', 'paid', 'late') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (loan_id) REFERENCES loans(id)
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_loans_client_id ON loans(client_id);
CREATE INDEX idx_payments_loan_id ON payments(loan_id);
CREATE INDEX idx_debts_loan_id ON debts(loan_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_clients_email ON clients(email);

-- Crear un usuario administrador con contraseña encriptada
INSERT INTO users (email, name, password, role) 
VALUES ('admin@example.com', 'Fredy Gaspar', SHA2('admin_password', 256), 'ADMINISTRADOR');

-- Crear un cliente
INSERT INTO clients (name, email, phone) VALUES ('Juan Perez', 'INSERT INTO clients (name, email, phone) VALUES ('Juan Perez', 'EMAIL', '3019999999');
