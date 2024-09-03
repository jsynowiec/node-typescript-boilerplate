
-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS AcademicCenterDB;
USE AcademicCenterDB;

-- Criação da tabela `users`
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela `categories`
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

-- Criação da tabela `news`
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    user_id INT,
    category_id INT,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Criação da tabela `events`
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255),
    event_date DATETIME NOT NULL,
    user_id INT,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Inserção de dados na tabela `users`
INSERT INTO users (name, email, password, role) VALUES
('Admin 1', 'admin1@centroacademico.com', 'adminpass', 'admin'),
('User 1', 'user1@centroacademico.com', 'userpass', 'user');

-- Inserção de dados na tabela `categories`
INSERT INTO categories (name, description) VALUES
('Notícia', 'Notícias importantes do centro acadêmico'),
('Evento', 'Eventos organizados pelo centro acadêmico'),
('Aviso', 'Avisos gerais e informações importantes');

-- Inserção de dados na tabela `news`
INSERT INTO news (title, content, user_id, category_id) VALUES
('Abertura do Semestre', 'A abertura do semestre será no dia 10 de setembro.', 1, 1),
('Novas Parcerias', 'O centro acadêmico firmou novas parcerias com empresas locais.', 1, 1);

-- Inserção de dados na tabela `events`
INSERT INTO events (title, description, location, event_date, user_id, category_id) VALUES
('Palestra sobre Carreiras', 'Palestra com profissionais de diversas áreas para discutir oportunidades de carreira.', 'Auditório Principal', '2024-09-15 18:00:00', 1, 2),
('Semana Acadêmica', 'Semana de atividades, workshops e palestras para os estudantes.', 'Campus Principal', '2024-10-01 09:00:00', 1, 2);
