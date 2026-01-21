import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'API de PQRSF',
        description: 'Documentación de la API para la gestión de peticiones de recambio de servicios.',
        version: '1.0.0',    
    },
    host: 'localhost:3000',
    schemes: ['http'],
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/index.ts']; 

swaggerAutogen()(outputFile, endpointsFiles, doc);