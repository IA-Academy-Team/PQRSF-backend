# PQRSF Backend (API)

Backend oficial del sistema **PQRSF de Campuslands**.
Expone una API REST para autenticación, gestión completa de PQRSF, chat operativo en tiempo real, encuestas de satisfacción e integraciones externas (WhatsApp, Telegram, n8n y AWS S3).

## 1) Resumen ejecutivo (para negocio y stakeholders)
Este servicio resuelve el ciclo de vida completo de atención de solicitudes:

- Recepción de solicitudes por canales digitales (bot/formulario).
- Clasificación automática por tipo y área.
- Gestión interna por responsables y administradores.
- Respuesta formal, cierre o reapertura por apelación.
- Medición de calidad mediante encuesta posterior.

Con esto, la organización obtiene:

- Trazabilidad del caso desde radicación hasta cierre.
- Control por estado, área y tiempos.
- Evidencia documental y trazabilidad histórica de cambios.
- Comunicación operativa con usuarios vía chat/canales externos.

## 2) Alcance funcional
### Roles soportados
- **Administrador**
- **Usuario de Área Responsable**

### Capacidades principales
- Autenticación y sesión (`better-auth`).
- Gestión de catálogos (tipos, estados, áreas, stakeholders, etc.).
- Gestión de PQRSF:
  - Creación, consulta, filtros y detalle extendido.
  - Análisis, reanálisis, respuesta, cierre y apelación.
  - Adjuntos (subida/descarga) en S3.
  - Historial de estados.
- Chat:
  - Resumen de chats por persona y por PQRS.
  - Mensajes por chat con soporte de tiempo real.
  - Modo IA y modo Administrador.
  - Envío manual de texto/archivo a WhatsApp o Telegram.
- Dashboard:
  - Métricas globales (admin).
  - Métricas por área (responsable).
- Encuestas:
  - Endpoint público por ticket.
  - Consulta administrativa consolidada.

## 3) Arquitectura técnica
### Estilo arquitectónico
El backend está implementado como **monolito modular por capas**:

- `routes` → define endpoints y middlewares de entrada.
- `controllers` → parseo/validación HTTP y respuesta.
- `services` → reglas de negocio y orquestación.
- `repositories` → acceso a datos con Prisma/SQL.
- `config/middlewares/utils` → infraestructura transversal.

### Flujo típico de una petición
1. Express recibe request en `/api/*`.
2. Middleware de CORS, rate-limit y JSON parsing.
3. Router dirige al controller.
4. Controller valida entrada (Zod + utilidades).
5. Service aplica reglas de negocio.
6. Repository ejecuta operación en PostgreSQL.
7. Respuesta normalizada (incluyendo saneo de `BigInt`).
8. Si aplica: emisión WebSocket y/o integración externa.

## 4) Stack
- **Runtime**: Node.js
- **Framework HTTP**: Express 5
- **Lenguaje**: TypeScript
- **Persistencia**: PostgreSQL + Prisma
- **Validación**: Zod
- **Autenticación**: better-auth
- **Tiempo real**: Socket.IO (`/ws`)
- **Documentación API**: Swagger UI (`/api-docs`)
- **Integraciones**:
  - WhatsApp Cloud API
  - Telegram Bot API
  - n8n (webhook)
  - AWS S3 (documentos y adjuntos)

## 5) Estructura de carpetas (backend)
```text
src/
  config/         # entorno, db, websocket, auth
  controllers/    # entrada/salida HTTP
  middlewares/    # errores, CORS, rate-limit
  models/         # contratos de dominio
  repositories/   # acceso a datos
  routes/         # endpoints agrupados
  schemas/        # esquemas de validación
  services/       # lógica de negocio
  utils/          # helpers comunes

prisma/
  schema.prisma
  seeds.ts
  4. Script DB.sql

tests/
  unit/           # unitarias (sin DB)
  repositories/
  services/
  api/
```

## 6) Modelo de dominio (resumen)
Entidades nucleares:

- `pqrs`, `pqrs_status`, `type_pqrs`, `area`
- `analysis`, `reanalysis`, `response`, `document`, `survey`
- `client`, `chat`, `message`
- `users`, `roles`, `responsible`

Catálogos base (seed/script):

- Tipos PQRSF: Petición, Queja, Reclamo, Sugerencia, Felicitación.
- Estados PQRSF: Radicado, Analisis, Reanálisis, Cerrado, Devuelto.
- Tipos de persona: Persona Natural, Persona Jurídica, Anónimo.

## 7) Ciclo de vida PQRSF y reglas relevantes
Estados base (`pqrs_status`):

- `1` Radicado
- `2` Analisis
- `3` Reanálisis
- `4` Cerrado
- `5` Devuelto

Transiciones de negocio implementadas:

- `Radicado -> Analisis`
- `Radicado -> Cerrado` *(solo si `isAutoResolved=true`)*
- `Analisis -> Reanálisis`
- `Analisis -> Cerrado`
- `Reanálisis -> Cerrado`
- `Reanálisis -> Devuelto`
- `Devuelto -> Reanálisis`
- `Devuelto -> Cerrado`

Comportamiento de apelación:

- Desde estados generales: mueve a `Reanálisis`.
- Si ya está en `Reanálisis`, alterna a `Devuelto`.
- Si está en `Devuelto`, alterna a `Reanálisis`.

## 8) API principal
Base URL local:

- `http://localhost:3001/api`

Documentación Swagger:

- `http://localhost:3001/api-docs`

Módulos principales expuestos al frontend:

- `auth/*`
- `dashboard/*`
- `pqrsf/*`
- `chats/*` (y alias `chat/*`)
- `responsables/*`
- `encuestas/*`
- `survey/*`
- catálogos: `type-pqrsf`, `pqrs-status`, `type-document`, `area`, `users/type-person`

Integraciones externas (no UI directa):

- `whatsapp/webhook` (WhatsApp inbound + verificación)
- `whatsapp/telegram/webhook` (Telegram inbound)

## 9) Contratos de error y observabilidad
Formato de error estándar:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {}
  }
}
```

Fuentes de error normalizadas:

- `AppError` (reglas de negocio/controladas).
- `ZodError` (validaciones de entrada).
- errores PostgreSQL mapeados (`23505`, `23503`, `22P02`).

Logs operativos:

- `[Request Error]` para errores esperados (4xx).
- `[Unexpected Error]` para errores no controlados.
- conexión Prisma al iniciar.

Nota clave:

- Se sanean valores `BigInt` antes de serializar JSON/WebSocket.

## 10) Tiempo real (WebSocket)
Path Socket.IO:

- `/ws`

Eventos emitidos por backend:

- `chat_message`
- `chat_summary`
- `chat_mode`

Salas:

- `summary`
- `chat:{chatId}`

## 11) Variables de entorno
### Mínimas para levantar local
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=pqrs

PORT=3001
FRONTEND_URL=http://localhost:5173
DEV_HOST=http://localhost:5173
PROD_HOST=https://tu-dominio.com
LANDING_HOST=https://tu-landing.com
```

### Auth/correo
```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=...
SMTP_PASS=...
MAIL_FROM=no-reply@campuslands.com
```

### Integraciones externas
```env
# WhatsApp
WHATSAPP_PHONE_ID=...
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_VERIFY_TOKEN=...
WHATSAPP_API_VERSION=v23.0
WHATSAPP_BUSINESS_ACCOUNT_ID=...

# Telegram
TELEGRAM_BOT_TOKEN=...

# n8n
N8N_WEBHOOK_URL_DEV=...
N8N_WEBHOOK_URL_PROD=...

# S3
AWS_KEY=...
AWS_SECRET=...
AWS_BUCKET=...
AWS_REGION=us-east-1
```

## 12) Instalación y ejecución
```bash
cd PQRSF-backend
npm install
```

### Opción A (recomendada): Prisma + seed
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:migrate:seed
npm run dev
```

### Opción B: script SQL manual
Ejecuta `prisma/4. Script DB.sql` en tu instancia PostgreSQL y luego:

```bash
npm run prisma:generate
npm run dev
```

## 13) Scripts disponibles
```bash
npm run dev
npm run build
npm run start
npm run test

npm run prisma:validate
npm run prisma:generate
npm run prisma:reset
npm run prisma:migrate
npm run prisma:migrate:seed
npm run prisma:studio

npm run swagger
npm run swagger:generate
```

## 14) Datos de prueba (entorno local con seed)
`prisma/seeds.ts` crea usuarios base para pruebas locales:

- `admin.alvarez@campuslands.com` (rol admin)
- `juan.perez@campuslands.com` (rol responsable)

Usa únicamente en entorno local/desarrollo.

## 15) Pruebas y calidad
Se incluyen pruebas unitarias y de servicios/repositorios.

```bash
npm run test
```

Cobertura del suite actual:

- utilidades y validación
- middlewares
- controladores
- servicios críticos (`pqrs`, `respuesta`)
- repositorios seleccionados

## 16) Checklist de salida a producción
- Variables `.env` productivas validadas.
- Conectividad PostgreSQL y `prisma validate` OK.
- `npm run test` y `npm run build` sin errores.
- Swagger generado/actualizado.
- Webhooks WhatsApp/Telegram configurados y verificados.
- S3 con permisos de lectura/escritura para documentos.
- CORS configurado a dominios reales de frontend.

## 17) Troubleshooting
- **`429 RATE_LIMITED`**:
  - Ajusta `RATE_LIMIT_WINDOW_MS` y `RATE_LIMIT_MAX_REQUESTS`.
  - GET/HEAD/OPTIONS están excluidos por diseño.
- **`Do not know how to serialize a BigInt`**:
  - Revisa controladores/respuestas no normalizadas.
- **Mensajes no salen por WhatsApp/Telegram**:
  - Verifica credenciales y formato de canal/chatId.
- **CORS bloqueado**:
  - Revisa `FRONTEND_URL`, `DEV_HOST`, `LANDING_HOST`.
- **Dashboard o chats vacíos**:
  - Confirma datos seed/catálogo y permisos de usuario/rol.

## 18) Relación con el frontend
Este backend está diseñado para ser consumido por `PQRSF-frontend`.
Para operación completa en local, levanta ambos proyectos:

1. `PQRSF-backend` en `:3001`
2. `PQRSF-frontend` en `:5173`

