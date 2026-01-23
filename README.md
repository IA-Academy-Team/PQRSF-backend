# Documentacion proyecto PQRSF

## Descripción

Este proyecto es una aplicación de gestión de peticiones de recambio de servicios (PQRS) para la Universidad de Campus Lands. Se trata de una API RESTful que permite a los usuarios realizar consultas y crear peticiones de recambio de servicios. Además, se incluye una interfaz de usuario web para facilitar la gestión de las peticiones.

## Tecnologías

- Node.js
- Express.js
- PostgreSQL
- Swagger
- Zod

## Estructura del proyecto

El proyecto está dividido en dos partes principales: la API y la interfaz de usuario web. La API se encarga de manejar las peticiones de los usuarios y proporcionar información detallada sobre las peticiones. La interfaz de usuario web se encarga de presentar la información de las peticiones en un formato fácil de comprender para los usuarios.

La API se encarga de manejar las peticiones de los usuarios y proporcionar información detallada sobre las peticiones. La interfaz de usuario web se encarga de presentar la información de las peticiones en un formato fácil de comprender para los usuarios.

### Arquitectura del backend

se implementa una arquitectura similar a MVC que se separa que acuerdo a las funcionalidades de la aplicación.

este es un ejemplo de como se podria dividir la aplicación en diferentes componentes:
```bash
.
├── src
│   ├── controllers
│   │   └── user.controller.ts
│   ├── dtos
│   │   └── user.schema.ts
│   ├── index.ts
│   ├── middlewares
│   │   └── user.middleware.ts
│   ├── models
│   │   └── user.model.ts
│   ├── routes
│   │   └── user.route.ts
│   ├── services
│   │   └── user.service.ts
│   └── utils
│       └── user.util.ts
```

### Arquitectura del frontend

## DOCUMENTACION DE LA API

### Instalación

Para instalar el proyecto, sigue estos pasos:

1. Clona el repositorio en tu máquina local.
2. Abre una terminal y navega hasta la carpeta del proyecto.
3. Ejecuta el comando `npm install` para instalar las dependencias del proyecto.
4. Configura la base de datos PostgreSQL y actualiza la configuración de la base de datos en el archivo `config.ts` creando tu .env en la raiz del proyecto.
5. Ejecuta el comando `npm run dev` para iniciar el servidor.
6. Entra a la ruta `http://localhost:3000/api-docs` para ver la documentación de la API con Swagger.

### Funcionalidades de cada ruta

Las rutas estan prefijadas con `/api` (ver `indexRoutes.ts`). A continuacion se listan las rutas que el frontend consume y su proposito.

#### Auth (`/auth`)
<!-- - `POST /auth/register`: crea usuario con Better Auth. Se usa al crear responsables desde el panel admin cuando el correo no existe. -->
- `POST /auth/login`: inicia sesion. Usado por el login del frontend.
- `GET /auth/me`: obtiene sesion actual. Usado para hidratar el contexto de usuario.
- `POST /auth/logout`: cierra sesion. Usado en logout del frontend.
- `POST /auth/forgot-password`: solicita recuperacion. Usado por la vista de recuperacion.
- `POST /auth/reset-password`: cambia contrasena con token. Usado por la vista de reset.
- `POST /auth/verify-email`: verificacion de correo si se usa flujo externo.
- `POST /auth/refresh`: refresco de token si aplica en el cliente.

#### Dashboard (`/dashboard`)
- `GET /dashboard/admin/metrics`: metricas globales (totales, por estado/tipo, tiempo promedio). Usado en el dashboard admin.
- `GET /dashboard/admin/chats`: listado corto de chats recientes. Usado en el dashboard admin.
- `GET /dashboard/area/:areaId/metrics`: metricas por area. Usado en dashboard de responsable.
- `GET /dashboard/area/:areaId/pending`: PQRSF pendientes por area con detalles (cliente, tipo, descripcion). Usado en dashboard responsable y vista de analisis pendientes.
- `GET /dashboard/area/:areaId/appeals`: PQRSF en apelacion por area con detalles. Usado en dashboard responsable y vista de apelaciones.

#### PQRSF (`/pqrsf`)
- `GET /pqrsf`: listado detallado con filtros. Usado en bandeja admin.
- `GET /pqrsf/radicado/:code`: busca por numero de ticket.
- `GET /pqrsf/status/:statusId`: filtra por estado.
- `GET /pqrsf/type/:typeId`: filtra por tipo.
- `GET /pqrsf/user/:userId`: filtra por usuario.
- `GET /pqrsf/area/:areaId`: filtra por area.
- `GET /pqrsf/seguimiento`: items de seguimiento para admin.
- `GET /pqrsf/apelaciones`: items en apelacion para admin.
- `GET /pqrsf/cerradas`: items cerrados para admin.
- `POST /pqrsf/:pqrsfId/finalize`: marca como cerrada.
- `POST /pqrsf/:pqrsfId/appeal`: marca como en apelacion.
- `GET /pqrsf/:pqrsfId/analysis`: lista analisis por PQRSF.
- `POST /pqrsf/analysis`: crea analisis.
- `PUT /pqrsf/analysis/:id`: actualiza analisis.
- `GET /pqrsf/reanalysis/:id`: obtiene reanalisis por id.
- `POST /pqrsf/reanalysis`: crea reanalisis.
- `PUT /pqrsf/reanalysis/:id`: actualiza reanalisis.
- `GET /pqrsf/:pqrsfId/responses`: respuestas enviadas al cliente.
- `POST /pqrsf/responses`: crea respuesta.
- `GET /pqrsf/:pqrsfId/documents`: documentos asociados.
- `POST /pqrsf/documents`: crea documento.
- `DELETE /pqrsf/documents/:id`: elimina documento.
- `GET /pqrsf/documents/:id/download`: descarga documento.
- `GET /pqrsf/:pqrsfId/survey`: encuesta asociada.
- `POST /pqrsf/survey`: crea encuesta.
- `PUT /pqrsf/survey/:id`: actualiza encuesta.

#### Areas y responsables (`/area`, `/responsables`)
- `GET /area`: lista de areas. Usado en admin de areas y formularios.
- `POST /area`: crea area.
- `PUT /area/:id`: actualiza area.
- `DELETE /area/:id`: elimina area.
- `GET /area/responsible/summary`: lista responsables con datos de usuario y area. Usado en admin de responsables.
- `POST /area/responsible`: crea responsable (vincula usuario-area).
- `PUT /area/responsible/:id`: actualiza responsable.
- `DELETE /area/responsible/:id`: elimina responsable.
- `GET /responsables/user/:userId`: obtiene responsable por usuario. Usado para resolver el area del responsable.

#### Usuarios (`/users`)
- `GET /users`: lista usuarios.
- `GET /users/:id`: detalle de usuario.
- `GET /users/email/:email`: busca usuario por email (usado al crear responsables).
- `POST /users`: el admin crea un usuario.
- `PUT /users/:id`: actualiza usuario.
- `PATCH /users/:id/status`: activa/desactiva usuario (usado en admin responsables).
- `DELETE /users/:id`: elimina usuario.
- `GET /users/type-person`: catalogo de tipo de persona (frontend lo usa para formularios).
- `GET /users/stake-holder`: catalogo de stakeholders (frontend lo usa para formularios).

#### Catalogos (`/type-pqrsf`, `/pqrs-status`, `/type-document`)
- `GET /type-pqrsf`: lista tipos de PQRSF (catalogos del frontend).
- `GET /pqrs-status`: lista estados de PQRSF (catalogos del frontend).
- `GET /type-document`: lista tipos de documento (carga de evidencias/respuestas).

#### Chats (`/chat`)
- `GET /chat/summary`: listado de chats con ultimo mensaje y cliente (admin chats).
- `GET /chat/:chatId/messages`: mensajes de un chat (admin chats).
- `POST /chat/messages`: envia mensaje (admin chats).
- `GET /chat`: lista chats basicos.
- `POST /chat`: crea chat.
- `PUT /chat/:id`: actualiza chat.
- `DELETE /chat/:id`: elimina chat.

#### Notificaciones (`/notifications`)
- `GET /notifications`: lista notificaciones por responsable.
- `PATCH /notifications/:id`: marca notificacion como leida.
- `PATCH /notifications/mark-all-read`: marca todas como leidas.

> Nota: Existen rutas CRUD adicionales (analisis, reanalisis, documentos, respuestas, clientes, etc.) que soportan procesos internos. Se mantienen para integraciones futuras y pruebas, aunque el frontend actual concentra el flujo en los endpoints agrupados en `/pqrsf` y `/dashboard`.
