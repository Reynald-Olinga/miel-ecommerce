const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API Miel eCommerce',
    description: 'Documentation officielle de l\'API',
    version: '1.0.0'
  },
  host: 'localhost:5000',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/*.js'];

// Génération automatique
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Documentation Swagger générée avec succès');
});