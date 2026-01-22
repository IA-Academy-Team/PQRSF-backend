import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'API de PQRSF',
        description: 'Documentación de la API para la gestión de peticiones de recambio de servicios.',
        version: '1.0.0',    
    },
    host: 'localhost:3000',
    schemes: ['http'],
    definitions: {
        CreatePqrs: {
            type: "object",
            properties: {
                ticketNumber: { type: "string" },
                isAutoResolved: { type: "boolean" },
                dueDate: { type: "string", format: "date-time" },
                pqrsStatusId: { type: "integer" },
                clientId: { type: "integer", format: "int64" },
                typePqrsId: { type: "integer" },
                areaId: { type: "integer" },
            },
        },
        UpdatePqrs: {
            type: "object",
            properties: {
                ticketNumber: { type: "string" },
                isAutoResolved: { type: "boolean" },
                dueDate: { type: "string", format: "date-time" },
                pqrsStatusId: { type: "integer" },
                clientId: { type: "integer", format: "int64" },
                typePqrsId: { type: "integer" },
                areaId: { type: "integer" },
            },
        },
        CreateAnalisis: {
            type: "object",
            properties: {
                answer: { type: "string" },
                actionTaken: { type: "string" },
                pqrsId: { type: "integer" },
                responsibleId: { type: "integer" },
            },
        },
        UpdateAnalisis: {
            type: "object",
            properties: {
                answer: { type: "string" },
                actionTaken: { type: "string" },
                pqrsId: { type: "integer" },
                responsibleId: { type: "integer" },
            },
        },
        CreateReanalisis: {
            type: "object",
            properties: {
                answer: { type: "string" },
                actionTaken: { type: "string" },
                analysisId: { type: "integer" },
                responsibleId: { type: "integer" },
            },
        },
        UpdateReanalisis: {
            type: "object",
            properties: {
                answer: { type: "string" },
                actionTaken: { type: "string" },
                analysisId: { type: "integer" },
                responsibleId: { type: "integer" },
            },
        },
        CreateNotificacion: {
            type: "object",
            properties: {
                message: { type: "string" },
                status: { type: "integer" },
                responsibleId: { type: "integer" },
                pqrsId: { type: "integer" },
            },
        },
        UpdateNotificacion: {
            type: "object",
            properties: {
                message: { type: "string" },
                status: { type: "integer" },
                responsibleId: { type: "integer" },
                pqrsId: { type: "integer" },
            },
        },
        MarkNotificacionesAsRead: {
            type: "object",
            properties: {
                ids: {
                    type: "array",
                    items: { type: "integer" },
                },
            },
        },
        CreateCliente: {
            type: "object",
            properties: {
                name: { type: "string" },
                document: { type: "string" },
                email: { type: "string" },
                phoneNumber: { type: "string" },
                typePersonId: { type: "integer" },
                stakeholderId: { type: "integer" },
            },
        },
        UpdateCliente: {
            type: "object",
            properties: {
                name: { type: "string" },
                document: { type: "string" },
                email: { type: "string" },
                phoneNumber: { type: "string" },
                typePersonId: { type: "integer" },
                stakeholderId: { type: "integer" },
            },
        },
        CreateChat: {
            type: "object",
            properties: {
                mode: { type: "integer" },
                clientId: { type: "integer", format: "int64" },
            },
        },
        UpdateChat: {
            type: "object",
            properties: {
                mode: { type: "integer" },
                clientId: { type: "integer", format: "int64" },
            },
        },
        CreateMensaje: {
            type: "object",
            properties: {
                content: { type: "string" },
                type: { type: "integer" },
                chatId: { type: "integer", format: "int64" },
            },
        },
        UpdateMensaje: {
            type: "object",
            properties: {
                content: { type: "string" },
                type: { type: "integer" },
                chatId: { type: "integer", format: "int64" },
            },
        },
        CreateResponsable: {
            type: "object",
            properties: {
                name: { type: "string" },
                email: { type: "string" },
                password: { type: "string" },
                phoneNumber: { type: "string" },
                areaId: { type: "integer" },
            },
        },
        UpdateResponsable: {
            type: "object",
            properties: {
                name: { type: "string" },
                email: { type: "string" },
                password: { type: "string" },
                phoneNumber: { type: "string" },
                areaId: { type: "integer" },
            },
        },
        CreateUsuario: {
            type: "object",
            properties: {
                email: { type: "string" },
                name: { type: "string" },
                image: { type: "string" },
                phoneNumber: { type: "string" },
                isActive: { type: "boolean" },
                emailVerified: { type: "boolean" },
                twoFactorEnabled: { type: "boolean" },
                lastLogin: { type: "string", format: "date-time" },
                roleId: { type: "integer" },
            },
        },
        UpdateUsuario: {
            type: "object",
            properties: {
                email: { type: "string" },
                name: { type: "string" },
                image: { type: "string" },
                phoneNumber: { type: "string" },
                isActive: { type: "boolean" },
                emailVerified: { type: "boolean" },
                twoFactorEnabled: { type: "boolean" },
                lastLogin: { type: "string", format: "date-time" },
                roleId: { type: "integer" },
            },
        },
        CreateSesion: {
            type: "object",
            properties: {
                token: { type: "string" },
                expiresAt: { type: "string", format: "date-time" },
                ipAddress: { type: "string" },
                userAgent: { type: "string" },
                userId: { type: "integer" },
            },
        },
        UpdateSesion: {
            type: "object",
            properties: {
                token: { type: "string" },
                expiresAt: { type: "string", format: "date-time" },
                ipAddress: { type: "string" },
                userAgent: { type: "string" },
                userId: { type: "integer" },
            },
        },
        CreateCuenta: {
            type: "object",
            properties: {
                providerId: { type: "string" },
                providerAccountId: { type: "string" },
                password: { type: "string" },
                accessToken: { type: "string" },
                refreshToken: { type: "string" },
                idToken: { type: "string" },
                accessTokenExpiresAt: { type: "string", format: "date-time" },
                refreshTokenExpiresAt: { type: "string", format: "date-time" },
                scope: { type: "string" },
                userId: { type: "integer" },
            },
        },
        UpdateCuenta: {
            type: "object",
            properties: {
                providerId: { type: "string" },
                providerAccountId: { type: "string" },
                password: { type: "string" },
                accessToken: { type: "string" },
                refreshToken: { type: "string" },
                idToken: { type: "string" },
                accessTokenExpiresAt: { type: "string", format: "date-time" },
                refreshTokenExpiresAt: { type: "string", format: "date-time" },
                scope: { type: "string" },
                userId: { type: "integer" },
            },
        },
        CreateVerificacion: {
            type: "object",
            properties: {
                identifier: { type: "string" },
                value: { type: "string" },
                expiresAt: { type: "string", format: "date-time" },
            },
        },
        UpdateVerificacion: {
            type: "object",
            properties: {
                identifier: { type: "string" },
                value: { type: "string" },
                expiresAt: { type: "string", format: "date-time" },
            },
        },
        CreateDocumento: {
            type: "object",
            properties: {
                url: { type: "string" },
                typeDocumentId: { type: "integer" },
                pqrsId: { type: "integer" },
            },
        },
        UpdateDocumento: {
            type: "object",
            properties: {
                url: { type: "string" },
                typeDocumentId: { type: "integer" },
                pqrsId: { type: "integer" },
            },
        },
        CreateEncuesta: {
            type: "object",
            properties: {
                q1Clarity: { type: "integer" },
                q2Timeliness: { type: "integer" },
                q3Quality: { type: "integer" },
                q4Attention: { type: "integer" },
                q5Overall: { type: "integer" },
                comment: { type: "string" },
                pqrsId: { type: "integer" },
            },
        },
        UpdateEncuesta: {
            type: "object",
            properties: {
                q1Clarity: { type: "integer" },
                q2Timeliness: { type: "integer" },
                q3Quality: { type: "integer" },
                q4Attention: { type: "integer" },
                q5Overall: { type: "integer" },
                comment: { type: "string" },
                pqrsId: { type: "integer" },
            },
        },
        CreateRespuesta: {
            type: "object",
            properties: {
                content: { type: "string" },
                channel: { type: "integer" },
                sentAt: { type: "string", format: "date-time" },
                documentId: { type: "integer" },
                pqrsId: { type: "integer" },
                responsibleId: { type: "integer" },
            },
        },
        UpdateRespuesta: {
            type: "object",
            properties: {
                content: { type: "string" },
                channel: { type: "integer" },
                sentAt: { type: "string", format: "date-time" },
                documentId: { type: "integer" },
                pqrsId: { type: "integer" },
                responsibleId: { type: "integer" },
            },
        },
        AuthRegister: {
            type: "object",
            properties: {
                name: { type: "string" },
                email: { type: "string" },
                password: { type: "string" },
            },
            required: ["email", "password"],
            example: {
                name: "Juan Perez",
                email: "juan.perez@campuslands.com",
                password: "Test1234",
            },
        },
        AuthLogin: {
            type: "object",
            properties: {
                email: { type: "string" },
                password: { type: "string" },
            },
            required: ["email", "password"],
            example: {
                email: "juan.perez@campuslands.com",
                password: "Test1234",
            },
        },
        AuthRequestReset: {
            type: "object",
            properties: {
                email: { type: "string" },
                redirectTo: { type: "string" },
            },
            required: ["email"],
            example: {
                email: "juan.perez@campuslands.com",
                redirectTo: "http://localhost:5173/reset",
            },
        },
        AuthReset: {
            type: "object",
            properties: {
                token: { type: "string" },
                newPassword: { type: "string" },
            },
            required: ["token", "newPassword"],
            example: {
                token: "reset-token-here",
                newPassword: "Test1234",
            },
        },
    },
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/index.ts']; 

swaggerAutogen()(outputFile, endpointsFiles, doc);
