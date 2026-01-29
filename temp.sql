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

-- ==============================
-- Mock data adicional para pruebas
-- ==============================

-- USERS (responsables adicionales)
INSERT INTO users (email, name, image, phone_number, role_id, is_active, email_verified) VALUES
('ana.martinez@campuslands.com',   'Ana Martinez',    NULL, '3003334455', 1, true,  true),
('carlos.rod@campuslands.com',    'Carlos Rodriguez',NULL, '3004445566', 1, true,  true),
('maria.garcia@campuslands.com',  'Maria Garcia',    NULL, '3005556677', 1, true,  true),
('luis.torres@campuslands.com',   'Luis Torres',     NULL, '3006667788', 1, true,  true),
('sofia.pena@campuslands.com',    'Sofia Pena',      NULL, '3007778899', 1, true,  true),
('admin.pruebas@campuslands.com', 'Admin Pruebas',   NULL, '3008889900', 2, true,  true);

-- RESPONSIBLE
INSERT INTO responsible (user_id, area_id) VALUES
((SELECT id FROM users WHERE email='juan.perez@campuslands.com'), 1),
((SELECT id FROM users WHERE email='ana.martinez@campuslands.com'), 2),
((SELECT id FROM users WHERE email='carlos.rod@campuslands.com'), 3),
((SELECT id FROM users WHERE email='maria.garcia@campuslands.com'), 4),
((SELECT id FROM users WHERE email='luis.torres@campuslands.com'), 5),
((SELECT id FROM users WHERE email='sofia.pena@campuslands.com'), 6);

-- CLIENTS
INSERT INTO client (id, name, document, email, phone_number, type_person_id, stakeholder_id) VALUES
(1001, 'Juan Camilo Perez', 'CC1001', 'juan.camilo@mail.com', '3101112233', 1, 1),
(1002, 'Maria Paula Gomez', 'CC1002', 'maria.paula@mail.com', '3102223344', 1, 2),
(1003, 'Carlos Duarte',     'CC1003', 'carlos.duarte@mail.com', '3103334455', 1, 3),
(1004, 'Ana Becerra',       'CC1004', 'ana.becerra@mail.com', '3104445566', 1, 4),
(1005, 'Sofia Ramirez',     'CC1005', 'sofia.ramirez@mail.com', '3105556677', 1, 5),
(1006, 'Luis Ortega',       'CC1006', 'luis.ortega@mail.com', '3106667788', 1, 6),
(1007, 'Camper Test',       'CC1007', 'camper.test@mail.com', '3107778899', 1, 1),
(1008, 'Empresa Demo SAS',  'NIT1008','contacto@empresademo.com', '3201112233', 2, 3),
(1009, 'Padre de Familia',  'CC1009', 'padre@mail.com', '3202223344', 1, 2),
(1010, 'Trainer Demo',      'CC1010', 'trainer@mail.com', '3203334455', 1, 4),
(1011, 'Aliado Estrategico','NIT1011','aliado@mail.com', '3204445566', 2, 5),
(1012, 'Publico General',   'CC1012', 'publico@mail.com', '3205556677', 1, 9);

-- CHAT
INSERT INTO chat (id, mode, client_id) VALUES
(2001, 1, 1001),
(2002, 1, 1002),
(2003, 2, 1003),
(2004, 1, 1004),
(2005, 2, 1005),
(2006, 1, 1006),
(2007, 1, 1007),
(2008, 2, 1008),
(2009, 1, 1009),
(2010, 2, 1010),
(2011, 1, 1011),
(2012, 1, 1012);

-- MESSAGE
INSERT INTO message (content, type, created_at, chat_id) VALUES
('Hola, necesito ayuda con una solicitud', 1, NOW() - INTERVAL '2 days', 2001),
('Claro, cuentame mas detalles', 2, NOW() - INTERVAL '2 days' + INTERVAL '2 minutes', 2001),
('Mi ticket no aparece en el portal', 1, NOW() - INTERVAL '2 days' + INTERVAL '5 minutes', 2001),
('Hola, quiero radicar una queja', 1, NOW() - INTERVAL '1 day', 2002),
('Con gusto, por favor indique el area', 2, NOW() - INTERVAL '1 day' + INTERVAL '1 minute', 2002),
('Deseo saber el estado de mi PQRS', 1, NOW() - INTERVAL '3 days', 2003),
('Estamos validando tu caso', 3, NOW() - INTERVAL '3 days' + INTERVAL '10 minutes', 2003),
('Necesito soporte con facturacion', 1, NOW() - INTERVAL '5 days', 2004),
('Se escalara al area encargada', 2, NOW() - INTERVAL '5 days' + INTERVAL '5 minutes', 2004),
('Gracias por la respuesta', 1, NOW() - INTERVAL '5 days' + INTERVAL '10 minutes', 2004),
('Quiero apelar una respuesta', 1, NOW() - INTERVAL '4 days', 2005),
('Entendido, revisaremos la apelacion', 3, NOW() - INTERVAL '4 days' + INTERVAL '3 minutes', 2005),
('Hola, mi solicitud esta en analisis', 1, NOW() - INTERVAL '6 days', 2006),
('Ya fue asignada a un responsable', 2, NOW() - INTERVAL '6 days' + INTERVAL '2 minutes', 2006),
('Necesito soporte con documentos', 1, NOW() - INTERVAL '7 days', 2007),
('Puedes adjuntar la evidencia aqui', 2, NOW() - INTERVAL '7 days' + INTERVAL '1 minute', 2007),
('Buenas tardes', 1, NOW() - INTERVAL '8 days', 2008),
('Hola, en que te podemos ayudar', 3, NOW() - INTERVAL '8 days' + INTERVAL '2 minutes', 2008),
('Gracias', 1, NOW() - INTERVAL '8 days' + INTERVAL '5 minutes', 2008),
('Tengo un reclamo pendiente', 1, NOW() - INTERVAL '9 days', 2009),
('Vamos a revisar el estado', 2, NOW() - INTERVAL '9 days' + INTERVAL '2 minutes', 2009),
('Quiero cerrar mi caso', 1, NOW() - INTERVAL '10 days', 2010),
('Se genero la respuesta final', 3, NOW() - INTERVAL '10 days' + INTERVAL '3 minutes', 2010),
('Necesito informacion general', 1, NOW() - INTERVAL '11 days', 2011),
('Claro, dime en que area', 2, NOW() - INTERVAL '11 days' + INTERVAL '2 minutes', 2011),
('Gracias por la ayuda', 1, NOW() - INTERVAL '12 days', 2012);

-- PQRS
INSERT INTO pqrs (ticket_number, is_auto_resolved, due_date, created_at, updated_at, pqrs_status_id, client_id, type_pqrs_id, area_id, description) VALUES
('PQRS-0001', false, CURRENT_DATE + INTERVAL '5 days', NOW() - INTERVAL '7 days', NOW() - INTERVAL '6 days', 1, 1001, 1, 1, 'Solicitud de informacion sobre programa.'),
('PQRS-0002', false, CURRENT_DATE + INTERVAL '3 days', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days', 2, 1002, 2, 2, 'Queja por demora en respuesta.'),
('PQRS-0003', false, CURRENT_DATE + INTERVAL '10 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days', 3, 1003, 3, 3, 'Reclamo por cobro duplicado.'),
('PQRS-0004', true,  CURRENT_DATE + INTERVAL '2 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days', 4, 1004, 4, 4, 'Sugerencia de mejora en comunicacion.'),
('PQRS-0005', false, CURRENT_DATE + INTERVAL '7 days', NOW() - INTERVAL '9 days', NOW() - INTERVAL '8 days', 1, 1005, 5, 5, 'Felicitacion por buena atencion.'),
('PQRS-0006', false, CURRENT_DATE + INTERVAL '4 days', NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days', 2, 1006, 1, 6, 'Solicitud de reprogramacion.'),
('PQRS-0007', false, CURRENT_DATE + INTERVAL '6 days', NOW() - INTERVAL '11 days', NOW() - INTERVAL '10 days', 2, 1007, 2, 7, 'Queja por proceso lento.'),
('PQRS-0008', false, CURRENT_DATE + INTERVAL '1 days', NOW() - INTERVAL '12 days', NOW() - INTERVAL '11 days', 3, 1008, 3, 8, 'Reclamo por facturacion.'),
('PQRS-0009', false, CURRENT_DATE + INTERVAL '9 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days', 4, 1009, 4, 9, 'Sugerencia sobre atencion.'),
('PQRS-0010', false, CURRENT_DATE + INTERVAL '8 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', 1, 1010, 5, 10, 'Felicitacion al area de formacion.'),
('PQRS-0011', false, CURRENT_DATE + INTERVAL '15 days', NOW() - INTERVAL '14 days', NOW() - INTERVAL '13 days', 2, 1011, 1, 11, 'Solicitud de informacion legal.'),
('PQRS-0012', false, CURRENT_DATE + INTERVAL '20 days', NOW() - INTERVAL '16 days', NOW() - INTERVAL '15 days', 3, 1012, 2, 12, 'Queja por servicio recibido.');

-- ANALYSIS
INSERT INTO analysis (answer, action_taken, created_at, pqrs_id, responsible_id) VALUES
('Revisamos el caso y se asigno responsable.', 'Asignacion de responsable', NOW() - INTERVAL '6 days', 2, 1),
('Validacion de documentos completada.', 'Solicitud de soportes', NOW() - INTERVAL '5 days', 3, 2),
('Caso en seguimiento con el area.', 'Seguimiento interno', NOW() - INTERVAL '4 days', 6, 3),
('Analisis de facturacion en proceso.', 'Revision financiera', NOW() - INTERVAL '3 days', 8, 4),
('Respuesta preliminar enviada.', 'Envio de respuesta', NOW() - INTERVAL '2 days', 11, 5),
('Revisando tiempos de respuesta.', 'Auditoria interna', NOW() - INTERVAL '1 days', 7, 6);

-- REANALYSIS
INSERT INTO reanalysis (answer, action_taken, created_at, analysis_id, responsible_id) VALUES
('Se realizo reanalisis por apelacion.', 'Nueva revision', NOW() - INTERVAL '2 days', 2, 2),
('Se ajusto la respuesta final.', 'Correccion de respuesta', NOW() - INTERVAL '1 days', 4, 3);

-- DOCUMENT
INSERT INTO document (url, type_document_id, pqrs_id) VALUES
('https://docs.example.com/solicitud-0001.pdf', 1, 1),
('https://docs.example.com/analisis-0002.pdf', 2, 2),
('https://docs.example.com/analisis-0003.pdf', 2, 3),
('https://docs.example.com/solicitud-0004.pdf', 1, 4),
('https://docs.example.com/respuesta-0005.pdf', 3, 5),
('https://docs.example.com/evidencia-0006.pdf', 4, 6),
('https://docs.example.com/respuesta-0007.pdf', 3, 7),
('https://docs.example.com/analisis-0008.pdf', 2, 8),
('https://docs.example.com/respuesta-0009.pdf', 3, 9),
('https://docs.example.com/respuesta-0010.pdf', 3, 10),
('https://docs.example.com/otro-0011.pdf', 5, 11),
('https://docs.example.com/otro-0012.pdf', 5, 12);

-- RESPONSE
INSERT INTO response (content, channel, sent_at, document_id, pqrs_id, responsible_id) VALUES
('Respuesta enviada por correo.', 1, NOW() - INTERVAL '5 days', 2, 2, 1),
('Respuesta enviada por WhatsApp.', 2, NOW() - INTERVAL '4 days', 3, 3, 2),
('Respuesta publicada en web.', 3, NOW() - INTERVAL '3 days', 5, 5, 3),
('Respuesta enviada por correo.', 1, NOW() - INTERVAL '2 days', 7, 7, 4),
('Respuesta enviada por web.', 3, NOW() - INTERVAL '1 day', 9, 9, 5),
('Respuesta enviada por correo.', 1, NOW() - INTERVAL '6 days', 10, 10, 6);

-- SURVEY
INSERT INTO survey (q1_clarity, q2_timeliness, q3_quality, q4_attention, q5_overall, comment, pqrs_id, created_at) VALUES
(4, 4, 5, 4, 5, 'Buena atencion y claridad.', 4, NOW() - INTERVAL '2 days'),
(3, 3, 3, 3, 3, 'Podria mejorar la comunicacion.', 3, NOW() - INTERVAL '1 day'),
(5, 5, 5, 5, 5, 'Excelente servicio.', 5, NOW() - INTERVAL '3 days'),
(2, 2, 2, 2, 2, 'La respuesta fue lenta.', 2, NOW() - INTERVAL '4 days'),
(4, 3, 4, 4, 4, 'Buen cierre del caso.', 9, NOW() - INTERVAL '1 day'),
(5, 4, 5, 4, 5, 'Muy satisfecho.', 10, NOW() - INTERVAL '2 days');

-- NOTIFICATION
INSERT INTO notification (message, status, responsible_id, pqrs_id, created_at) VALUES
('Nueva PQRS asignada', 1, 1, 1, NOW() - INTERVAL '7 days'),
('PQRS en analisis', 2, 2, 2, NOW() - INTERVAL '6 days'),
('Respuesta pendiente', 1, 3, 3, NOW() - INTERVAL '5 days'),
('PQRS en reanalisis', 1, 4, 8, NOW() - INTERVAL '4 days'),
('PQRS cerrada', 2, 5, 4, NOW() - INTERVAL '3 days'),
('Nueva apelacion registrada', 1, 6, 7, NOW() - INTERVAL '2 days');

\dt
