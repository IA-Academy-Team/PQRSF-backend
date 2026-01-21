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
    code VARCHAR(10) UNIQUE
);

CREATE TABLE type_document (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- ==============================
-- Tablas con dependencias
-- ==============================

CREATE TABLE responsible (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    phone_number VARCHAR(100) NOT NULL,
    area_id INT,
    FOREIGN KEY (area_id) REFERENCES Area(id)
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

COMMENT ON COLUMN notification.status IS '1 = NO LEIDO, 2 = LEIDO';

-- ==============================
-- DML: Insertar datos iniciales
-- ==============================

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
INSERT INTO area (name, code) VALUES
('Formación', 'FOR'),
('Empleabilidad', 'EMP'),
('Administración', 'ADM'),
('Coworking Hubux', 'HUB'),
('Talento Humano – Prexxa', 'THP'),
('Talent Up', 'TUP'),
('Full Services', 'FUS'),
('Red Campus', 'RED'),
('Camper Star', 'CST'),
('Expansión Global', 'EXP'),
('Bienestar (Psicología)', 'BIE'),
('IA Academy', 'IAA'),
('Clon AI', 'CLA'),
('CampusDev', 'CDV');

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
