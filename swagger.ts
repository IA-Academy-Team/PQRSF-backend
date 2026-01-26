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
            example: {
                ticketNumber: "string",
                isAutoResolved: false,
                dueDate: "2025-01-01T00:00:00Z",
                pqrsStatusId: 1,
                clientId: 1,
                typePqrsId: 1,
                areaId: 1,
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
            example: {
                ticketNumber: "string",
                isAutoResolved: false,
                dueDate: "2025-01-01T00:00:00Z",
                pqrsStatusId: 1,
                clientId: 1,
                typePqrsId: 1,
                areaId: 1,
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
            example: {
                answer: "string",
                actionTaken: "string",
                pqrsId: 1,
                responsibleId: 1,
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
            example: {
                answer: "string",
                actionTaken: "string",
                pqrsId: 1,
                responsibleId: 1,
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
            example: {
                answer: "string",
                actionTaken: "string",
                analysisId: 1,
                responsibleId: 1,
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
            example: {
                answer: "string",
                actionTaken: "string",
                analysisId: 1,
                responsibleId: 1,
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
            example: {
                message: "string",
                status: 1,
                responsibleId: 1,
                pqrsId: 1,
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
            example: {
                message: "string",
                status: 1,
                responsibleId: 1,
                pqrsId: 1,
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
            example: {
                ids: [1],
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
            example: {
                name: "string",
                document: "string",
                email: "string",
                phoneNumber: "string",
                typePersonId: 1,
                stakeholderId: 1,
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
            example: {
                name: "string",
                document: "string",
                email: "string",
                phoneNumber: "string",
                typePersonId: 1,
                stakeholderId: 1,
            },
        },
        CreateChat: {
            type: "object",
            properties: {
                mode: { type: "integer" },
                clientId: { type: "integer", format: "int64" },
            },
            example: {
                mode: 1,
                clientId: 1,
            },
        },
        UpdateChat: {
            type: "object",
            properties: {
                mode: { type: "integer" },
                clientId: { type: "integer", format: "int64" },
            },
            example: {
                mode: 1,
                clientId: 1,
            },
        },
        CreateMensaje: {
            type: "object",
            properties: {
                content: { type: "string" },
                type: { type: "integer" },
                chatId: { type: "integer", format: "int64" },
            },
            example: {
                content: "string",
                type: 1,
                chatId: 1,
            },
        },
        SendChatMessage: {
            type: "object",
            properties: {
                chatId: { type: "integer", format: "int64" },
                content: { type: "string" },
                channel: { type: "string", enum: ["whatsapp", "telegram"] },
            },
            example: {
                chatId: 5070488751,
                content: "hola, mensaje de prueba",
                channel: "whatsapp",
            },
        },
        UpdateMensaje: {
            type: "object",
            properties: {
                content: { type: "string" },
                type: { type: "integer" },
                chatId: { type: "integer", format: "int64" },
            },
            example: {
                content: "string",
                type: 1,
                chatId: 1,
            },
        },
        CreateResponsable: {
            type: "object",
            properties: {
                userId: { type: "integer" },
                areaId: { type: "integer" },
            },
            example: {
                userId: 1,
                areaId: 1,
            },
        },
        UpdateResponsable: {
            type: "object",
            properties: {
                userId: { type: "integer" },
                areaId: { type: "integer" },
            },
            example: {
                userId: 1,
                areaId: 1,
            },
        },
        CreateStakeholder: {
            type: "object",
            properties: {
                name: { type: "string" },
            },
            example: {
                name: "string",
            },
        },
        UpdateStakeholder: {
            type: "object",
            properties: {
                name: { type: "string" },
            },
            example: {
                name: "string",
            },
        },
        CreateArea: {
            type: "object",
            properties: {
                name: { type: "string" },
                code: { type: "string" },
            },
            example: {
                name: "string",
                code: "string",
            },
        },
        UpdateArea: {
            type: "object",
            properties: {
                name: { type: "string" },
                code: { type: "string" },
            },
            example: {
                name: "string",
                code: "string",
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
            example: {
                email: "string",
                name: "string",
                image: "string",
                phoneNumber: "string",
                isActive: true,
                emailVerified: false,
                twoFactorEnabled: false,
                lastLogin: "2025-01-01T00:00:00Z",
                roleId: 1,
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
            example: {
                email: "string",
                name: "string",
                image: "string",
                phoneNumber: "string",
                isActive: true,
                emailVerified: false,
                twoFactorEnabled: false,
                lastLogin: "2025-01-01T00:00:00Z",
                roleId: 1,
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
            example: {
                token: "string",
                expiresAt: "2025-01-01T00:00:00Z",
                ipAddress: "string",
                userAgent: "string",
                userId: 1,
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
            example: {
                token: "string",
                expiresAt: "2025-01-01T00:00:00Z",
                ipAddress: "string",
                userAgent: "string",
                userId: 1,
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
            example: {
                providerId: "string",
                providerAccountId: "string",
                password: "string",
                accessToken: "string",
                refreshToken: "string",
                idToken: "string",
                accessTokenExpiresAt: "2025-01-01T00:00:00Z",
                refreshTokenExpiresAt: "2025-01-01T00:00:00Z",
                scope: "string",
                userId: 1,
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
            example: {
                providerId: "string",
                providerAccountId: "string",
                password: "string",
                accessToken: "string",
                refreshToken: "string",
                idToken: "string",
                accessTokenExpiresAt: "2025-01-01T00:00:00Z",
                refreshTokenExpiresAt: "2025-01-01T00:00:00Z",
                scope: "string",
                userId: 1,
            },
        },
        CreateVerificacion: {
            type: "object",
            properties: {
                identifier: { type: "string" },
                value: { type: "string" },
                expiresAt: { type: "string", format: "date-time" },
            },
            example: {
                identifier: "string",
                value: "string",
                expiresAt: "2025-01-01T00:00:00Z",
            },
        },
        UpdateVerificacion: {
            type: "object",
            properties: {
                identifier: { type: "string" },
                value: { type: "string" },
                expiresAt: { type: "string", format: "date-time" },
            },
            example: {
                identifier: "string",
                value: "string",
                expiresAt: "2025-01-01T00:00:00Z",
            },
        },
        CreateDocumento: {
            type: "object",
            properties: {
                url: { type: "string" },
                typeDocumentId: { type: "integer" },
                pqrsId: { type: "integer" },
            },
            example: {
                url: "string",
                typeDocumentId: 1,
                pqrsId: 1,
            },
        },
        UpdateDocumento: {
            type: "object",
            properties: {
                url: { type: "string" },
                typeDocumentId: { type: "integer" },
                pqrsId: { type: "integer" },
            },
            example: {
                url: "string",
                typeDocumentId: 1,
                pqrsId: 1,
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
            example: {
                q1Clarity: 1,
                q2Timeliness: 1,
                q3Quality: 1,
                q4Attention: 1,
                q5Overall: 1,
                comment: "string",
                pqrsId: 1,
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
            example: {
                q1Clarity: 1,
                q2Timeliness: 1,
                q3Quality: 1,
                q4Attention: 1,
                q5Overall: 1,
                comment: "string",
                pqrsId: 1,
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
            example: {
                content: "string",
                channel: 1,
                sentAt: "2025-01-01T00:00:00Z",
                documentId: 1,
                pqrsId: 1,
                responsibleId: 1,
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
            example: {
                content: "string",
                channel: 1,
                sentAt: "2025-01-01T00:00:00Z",
                documentId: 1,
                pqrsId: 1,
                responsibleId: 1,
            },
        },
        CreateRol: {
            type: "object",
            properties: {
                name: { type: "string" },
                description: { type: "string" },
            },
            example: {
                name: "string",
                description: "string",
            },
        },
        UpdateRol: {
            type: "object",
            properties: {
                name: { type: "string" },
                description: { type: "string" },
            },
            example: {
                name: "string",
                description: "string",
            },
        },
        CreateTipoPqrs: {
            type: "object",
            properties: {
                name: { type: "string" },
            },
            example: {
                name: "string",
            },
        },
        UpdateTipoPqrs: {
            type: "object",
            properties: {
                name: { type: "string" },
            },
            example: {
                name: "string",
            },
        },
        CreateEstadoPqrs: {
            type: "object",
            properties: {
                name: { type: "string" },
            },
            example: {
                name: "string",
            },
        },
        UpdateEstadoPqrs: {
            type: "object",
            properties: {
                name: { type: "string" },
            },
            example: {
                name: "string",
            },
        },
        CreateTipoDocumento: {
            type: "object",
            properties: {
                name: { type: "string" },
            },
            example: {
                name: "string",
            },
        },
        UpdateTipoDocumento: {
            type: "object",
            properties: {
                name: { type: "string" },
            },
            example: {
                name: "string",
            },
        },
        CreateTipoPersona: {
            type: "object",
            properties: {
                name: { type: "string" },
            },
            example: {
                name: "string",
            },
        },
        UpdateTipoPersona: {
            type: "object",
            properties: {
                name: { type: "string" },
            },
            example: {
                name: "string",
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
                name: "string",
                email: "string",
                password: "string",
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
                email: "string",
                password: "string",
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
                email: "string",
                redirectTo: "string",
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
                token: "string",
                newPassword: "string",
            },
        },
        AuthRefresh: {
            type: "object",
            properties: {
                providerId: { type: "string" },
                accountId: { type: "string" },
                userId: { type: "string" },
            },
            required: ["providerId"],
            example: {
                providerId: "credentials",
                accountId: "string",
                userId: "string",
            },
        },
        AuthVerifyEmail: {
            type: "object",
            properties: {
                token: { type: "string" },
                callbackURL: { type: "string" },
            },
            required: ["token"],
            example: {
                token: "string",
                callbackURL: "string",
            },
        },
        UsuarioStatus: {
            type: "object",
            properties: {
                isActive: { type: "boolean" },
            },
            example: {
                isActive: true,
            },
        },
    },
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/index.ts']; 

swaggerAutogen()(outputFile, endpointsFiles, doc);
