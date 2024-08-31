import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts'], // Arquivos que contêm anotações para o Swagger
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
