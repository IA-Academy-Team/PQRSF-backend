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
│   │   └── user.dto.ts
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

## Instalación

Para instalar el proyecto, sigue estos pasos:

1. Clona el repositorio en tu máquina local.
2. Abre una terminal y navega hasta la carpeta del proyecto.
3. Ejecuta el comando `npm install` para instalar las dependencias del proyecto.
4. Configura la base de datos PostgreSQL y actualiza la configuración de la base de datos en el archivo `config.ts` creando tu .env en la raiz del proyecto.
5. Ejecuta el comando `npm run dev` para iniciar el servidor.

## Uso

Para usar el proyecto, sigue estos pasos:

1. Abre tu navegador web y navega hasta la dirección `http://localhost:3000`.
2. Inicia sesión con tus credenciales de usuario.
3. Utiliza la interfaz de usuario web para realizar consultas y crear peticiones de recambio de servicios.

## Contribución

Si deseas contribuir al proyecto, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama para tu contribución.
3. Realiza tus cambios y asegúrate de que el código sea limpio y bien documentado.
4. Envía una solicitud de