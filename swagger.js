import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Play Tube API',
      version: '1.0.0',
      description: 'A You Tube Clone API for video streaming platform with Swagger docs'
    },
    servers: [
      {
        url: process.env.API_URL,
        description: 'Local server'
      }
    ]
  },
  apis: ['./src/routes/*.js'], // Path to route files
};

const swaggerSpec = swaggerJsdoc(options);

export {
  swaggerUi,
  swaggerSpec
}