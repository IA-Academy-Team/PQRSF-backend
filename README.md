# PQRSF Backend (API)

API REST para la gestión de PQRSF (Peticiones, Quejas, Reclamos, Sugerencias y Felicitaciones) de Campuslands.  
Incluye autenticación, flujos PQRSF, chats en tiempo real, integraciones con WhatsApp/Telegram/n8n y carga de evidencias a S3.

## Alcance funcional
- **Roles**: Administrador, Usuario de Área Responsable.
- **Flujo principal PQRSF**:
  1. Radicación (bot o formulario).
  2. Análisis (responsable).
  3. Respuesta y cierre (admin/responsable).
  4. Apelación y reanálisis (si aplica).
- **Chat**:
  - Modo IA (bot) y modo Administrador.
  - Mensajería en tiempo real vía WebSocket.
  - Envío a WhatsApp/Telegram desde panel admin.
- **Dashboard**: métricas globales y por área.
- **Encuestas**: creación y consulta pública.

## Stack y dependencias
- **Node.js + Express 5**
- **Prisma + PostgreSQL**
- **Zod** (validación)
- **Swagger** (docs)
- **Socket.IO** (tiempo real)
- **Integraciones**: WhatsApp Cloud API, Telegram Bot, n8n, AWS S3

## Estructura (resumen)
```
src/
  config/         # env, db, websocket
  controllers/    # entradas HTTP
  middlewares/    # auth, errores, rate limit, cors
  models/         # interfaces
  repositories/   # acceso a datos (Prisma)
  routes/         # rutas agrupadas
  schemas/        # validación (Zod)
  services/       # lógica de negocio
  utils/          # helpers
```

## Arranque rápido
```bash
cd PQRSF-backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

API: `http://localhost:3001` (según `.env`)  
Swagger: `http://localhost:3001/api-docs`

## Variables de entorno (backend)
Ejemplo mínimo:
```env
# DB
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=pqrs

# Server / CORS
PORT=3001
FRONTEND_URL=http://localhost:5173
DEV_HOST=http://localhost:5173
PROD_HOST=https://tu-dominio.com
LANDING_HOST=https://tu-landing.com

# Auth/Correo
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=...
SMTP_PASS=...
MAIL_FROM=no-reply@campuslands.com

# WhatsApp / Telegram
WHATSAPP_PHONE_ID=...
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_VERIFY_TOKEN=...
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

## Scripts útiles
```bash
npm run dev
npm run build
npm run test
npm run prisma:validate
npm run prisma:generate
npm run prisma:migrate
npm run prisma:migrate:seed
npm run prisma:studio
```

## Arquitectura y flujo de datos
- **Controladores** validan input (Zod), delegan a servicios.
- **Servicios** aplican reglas de negocio y orquestan repositorios.
- **Repositorios** usan Prisma para lecturas/escrituras (con algunas consultas SQL).
- **WebSockets** (`/ws`) notifican cambios en chats y resúmenes.
- **Integraciones**:
  - WhatsApp/Telegram: `ChatIntegrationService` (envío y recepción webhook).
  - n8n: payloads para bots y encuestas.
  - S3: adjuntos y archivos.

## Endpoints principales (resumen)
- **Auth**: `/auth/*`
- **Dashboard**: `/dashboard/admin/*`, `/dashboard/area/*`
- **PQRSF**: `/pqrsf/*` (listado, detalle, análisis, reanálisis, respuestas, cierre, apelación)
- **Chats**: `/chats/*` (summary, messages, send)
- **Catálogos**: `/type-pqrsf`, `/pqrs-status`, `/type-document`

> Ver detalle completo en Swagger.

## Testing
- Se incluyen tests unitarios sin DB.
```bash
npm run test
```

## Notas de mantenimiento
- El rate limiter ignora GET/HEAD/OPTIONS para evitar bloqueos de UI.
- Las respuestas con BigInt se normalizan antes de enviar JSON.
- Para WhatsApp/Telegram se requiere configuración completa de credenciales.

## Troubleshooting rápido
- **429 Too Many Requests**: revisar rate limit.
- **BigInt serialize error**: revisar normalización de response.
- **WhatsApp/Telegram no envía**: verificar `WHATSAPP_*` o `TELEGRAM_BOT_TOKEN`.

