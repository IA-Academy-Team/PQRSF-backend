-- ==============================
-- Querys: Consultas de verificación
-- ==============================
-- SELECT * FROM type_person;
-- SELECT * FROM stakeholder;
-- SELECT * FROM type_pqrs;
-- SELECT * FROM pqrs_status;
-- SELECT * FROM area;
-- SELECT * FROM responsible;
-- SELECT * FROM client;
-- SELECT * FROM message;
-- SELECT * FROM pqrs;
-- SELECT * FROM analysis;
-- SELECT * FROM reanalysis;
-- SELECT * FROM survey;
-- SELECT * FROM document;
-- SELECT * FROM notification;

-- ==============================
-- Database: pqrs
-- ==============================

-- ==============================
-- DDL: Crear tablas
-- ==============================

-- DROP TABLE IF EXISTS message CASCADE;
-- DROP TABLE IF EXISTS summary CASCADE;
-- ... (Descomentar para limpiar la BD si es necesario)
-- DROP DATABASE IF EXISTS pqrs;
CREATE DATABASE pqrs;
\c pqrs;
-- \dt

-- ==============================
-- Tablas sin dependencias
-- ==============================

CREATE TABLE type_person (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE stakeholder (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE type_pqrs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE pqrs_status (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE area (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE,
    description TEXT
);

CREATE TABLE type_document (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);


-- ==============================
-- Auth
-- ==============================

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL, -- Solo @campuslands.com
    name VARCHAR(255),                 -- Nombre completo (OAuth-friendly)
    image TEXT,                         -- Avatar (Google, GitHub, etc.)
    phone_number VARCHAR(20) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    two_factor_enabled BOOLEAN DEFAULT false,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    role_id INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    provider_id TEXT NOT NULL,          -- google, github, credential
    provider_account_id TEXT NOT NULL,  -- sub / accountId / email
    password TEXT,                      -- SOLO para provider 'credentials' cuando el usuario ingrea por contraseña
    access_token TEXT,
    refresh_token TEXT,
    id_token TEXT,
    access_token_expires_at TIMESTAMPTZ,
    refresh_token_expires_at TIMESTAMPTZ,
    scope TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (provider_id, provider_account_id)
);

-- ==============================
-- Tablas con dependencias
-- ==============================

CREATE TABLE responsible (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    area_id INT,
    FOREIGN KEY (area_id) REFERENCES Area(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE client (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100),
    document VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    phone_number VARCHAR(100),
    type_person_id INT,
    stakeholder_id INT,
    FOREIGN KEY (type_person_id) REFERENCES type_person(id),
    FOREIGN KEY (stakeholder_id) REFERENCES stakeholder(id)
);

CREATE TABLE chat (
    id BIGINT PRIMARY KEY,
    mode SMALLINT DEFAULT 1, -- "1 IA, 2 ADMIN"
    client_id BIGINT,
    FOREIGN KEY (client_id) REFERENCES client(id)
);

COMMENT ON COLUMN chat.mode IS '1 = IA, 2 = ADMIN';

CREATE TABLE message (
    id SERIAL PRIMARY KEY,
    content TEXT,
    type SMALLINT, -- "1 CLIENT, 2 IA, 3 ADMIN"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    chat_id BIGINT NOT NULL,
    FOREIGN KEY (chat_id) REFERENCES chat(id)
);

COMMENT ON COLUMN message.type IS '1 = CLIENT, 2 = IA, 3 = ADMIN';

CREATE TABLE pqrs (
    id SERIAL PRIMARY KEY,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    is_auto_resolved BOOLEAN DEFAULT FALSE,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pqrs_status_id INT NOT NULL,
    client_id BIGINT NOT NULL,
    type_pqrs_id INT NOT NULL,
    area_id INT NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (pqrs_status_id) REFERENCES pqrs_status(id),
    FOREIGN KEY (client_id) REFERENCES client(id),
    FOREIGN KEY (type_pqrs_id) REFERENCES type_pqrs(id),
    FOREIGN KEY (area_id) REFERENCES area(id)
);

CREATE TABLE analysis (
    id SERIAL PRIMARY KEY,
    answer TEXT,
    action_taken TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pqrs_id INT NOT NULL,
    responsible_id INT NOT NULL,
    FOREIGN KEY (pqrs_id) REFERENCES pqrs(id),
    FOREIGN KEY (responsible_id) REFERENCES responsible(id)
);

CREATE TABLE reanalysis (
    id SERIAL PRIMARY KEY,
    answer TEXT,
    action_taken TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    analysis_id INT NOT NULL,
    responsible_id INT NOT NULL,
    FOREIGN KEY (analysis_id) REFERENCES analysis(id),
    FOREIGN KEY (responsible_id) REFERENCES responsible(id)
);

CREATE TABLE document (
    id SERIAL PRIMARY KEY,
    url VARCHAR (500) NOT NULL,
    type_document_id INT NOT NULL,
    pqrs_id INT NOT NULL,
    FOREIGN KEY (type_document_id) REFERENCES type_document(id),
    FOREIGN KEY (pqrs_id) REFERENCES pqrs(id)
);

CREATE TABLE response (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    channel SMALLINT NOT NULL, -- "1 EMAIL, 2 WHATSAPP, 3 WEB"
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    document_id INT NOT NULL,
    pqrs_id INT NOT NULL,
    responsible_id INT NOT NULL,
    FOREIGN KEY (document_id) REFERENCES document(id), 
    FOREIGN KEY (pqrs_id) REFERENCES pqrs(id),
    FOREIGN KEY (responsible_id) REFERENCES responsible(id)
);

COMMENT ON COLUMN response.channel IS '1 = EMAIL, 2 = WHATSAPP, 3 = WEB';

CREATE TABLE survey (
    id SERIAL PRIMARY KEY,
    q1_clarity INT CHECK (q1_clarity BETWEEN 1 AND 5),
    q2_timeliness INT CHECK (q2_timeliness BETWEEN 1 AND 5),
    q3_quality INT CHECK (q3_quality BETWEEN 1 AND 5),
    q4_attention INT CHECK (q4_attention BETWEEN 1 AND 5),
    q5_overall INT CHECK (q5_overall BETWEEN 1 AND 5),
    comment VARCHAR(500),
    pqrs_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pqrs_id) REFERENCES pqrs(id)
);

CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    message VARCHAR(500) NOT NULL,
    status SMALLINT DEFAULT 1, -- "1 NO LEIDO, 2 LEIDO"
    responsible_id INT NOT NULL,
    pqrs_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (responsible_id) REFERENCES responsible(id),
    FOREIGN KEY (pqrs_id) REFERENCES pqrs(id)
);

-- * esta tabla se encarga de tener una boveda temporal de pruebas de identidad con better auth, no tiene relacion alguna con ninguna tabla de la base de datos
CREATE TABLE verifications (
    id SERIAL PRIMARY KEY,
    identifier TEXT NOT NULL, -- email
    value TEXT NOT NULL,      -- token / code
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (identifier, value)
);

COMMENT ON COLUMN notification.status IS '1 = NO LEIDO, 2 = LEIDO';

-- ==============================
-- DML: Insertar datos iniciales
-- ==============================


-- ==============================
-- Auth
-- ==============================

INSERT INTO roles (name) VALUES
('responsable'),
('admin');

-- USERS
-- Test1234 y Admin1234 son las contraseñas de los usuarios de prueba
INSERT INTO users (email, name, image, phone_number, role_id, is_active, email_verified) VALUES
('juan.perez@campuslands.com',       'Juan Perez',        NULL, '3001112233', 1, true,  true),
('admin.alvarez@campuslands.com',    'Admin Alvarez',     NULL, '3002223344', 2, true,  true);

-- SESSIONS
INSERT INTO sessions (token, user_id, expires_at, ip_address, user_agent, created_at, updated_at)
VALUES (
    'token-juan',
    (SELECT id FROM users WHERE email='juan.perez@campuslands.com'),
    '2026-12-31T23:59:59.999Z',
    '127.0.0.1',
    'Mozilla/5.0 ...',
    NOW(),
    NOW()
),
(
    'token-admin',
    (SELECT id FROM users WHERE email='admin.alvarez@campuslands.com'),
    '2026-12-31T23:59:59.999Z',
    '127.0.0.1',
    'Mozilla/5.0 ...',
    NOW(),
    NOW()
);

-- ACCOUNTS
INSERT INTO accounts (
  provider_id,
  provider_account_id,
  password,
  access_token,
  refresh_token,
  id_token,
  access_token_expires_at,
  refresh_token_expires_at,
  scope,
  created_at,
  updated_at,
  user_id
) VALUES
(
  'credential',
  'juan.perez@campuslands.com',
  '$2b$10$xKgXgWL17p3iAx4ydjaXq.3WOvjrIVQaMbCbvPPSA/wr7C9PNIdvi',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'openid profile email',
  NOW(),
  NOW(),
  1
),
(
  'credential',
  'admin.alvarez@campuslands.com',
  '$2b$10$joQMs64TpveisyjTlU0BhOvmDev2ZImr4IMoyTGtFsdOzQjnELxjm',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'openid profile email',
  NOW(),
  NOW(),
  2
);

-- VERFICIATIONS
INSERT INTO verifications (
    identifier,
    value,
    expires_at
) VALUES
(
    'juan.perez@campuslands.com',
    '123456',
    '2022-12-31T23:59:59.999Z'
),
(
    'admin.alvarez@campuslands.com',
    '654321',
    '2022-12-31T23:59:59.999Z'
);  

-- ==============================
-- Tablas sin dependencias
-- ==============================

-- stakeholder
INSERT INTO stakeholder (name) VALUES
('Camper'),
('Padre de familia'),
('Empresa de empleabilidad'),
('Trainer'),
('Aliado estratégico'),
('Patrocinador'),
('Administrativo'),
('Empresa en Coworking'),
('Público en general'),
('Área interna de Campuslands');

-- type_pqrs
INSERT INTO type_pqrs (name) VALUES
('Petición'),
('Queja'),
('Reclamo'),
('Sugerencia'),
('Felicitación');

-- pqrs_status
INSERT INTO pqrs_status (name) VALUES
('Radicado'),
('Analisis'),
('Reanálisis'),
('Cerrado');

-- area
INSERT INTO area (name, code, description) VALUES
('Formación', 'FOR', 'Formación de campuslands'),
('Empleabilidad', 'EMP', 'Empleabilidad de campuslands'),
('Administración', 'ADM', 'Administración de campuslands'),
('Coworking Hubux', 'HUB', 'Coworking Hubux'),
('Talento Humano – Prexxa', 'THP', 'Talento Humano – Prexxa'),
('Talent Up', 'TUP', 'Talent Up'),
('Full Services', 'FUS', 'Full Services'),
('Red Campus', 'RED', 'Red Campus'),
('Camper Star', 'CST', 'Camper Star'),
('Expansión Global', 'EXP', 'Expansión Global'),
('Bienestar (Psicología)', 'BIE', 'Bienestar (Psicología)'),
('IA Academy', 'IAA', 'IA Academy'),
('Clon AI', 'CLA', 'Clon AI'),
('CampusDev', 'CDV', 'CampusDev');


-- type_person
INSERT INTO type_person (name) VALUES
('Persona Natural'),
('Persona Jurídica'),
('Anónimo');

INSERT INTO type_document (name) VALUES
('Solicitud'),
('Análisis'),
('Respuesta'),
('Evidencia'),
('Otro');

\dt