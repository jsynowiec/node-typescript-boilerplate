import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
      description: 'This is a simple API application made with Express and documented with Swagger',
      termsOfService: 'http://example.com/terms',
      contact: {
        name: 'API Support',
        url: 'http://www.example.com/support',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.example.com',
        description: 'Production server',
      },
    ],
  },

  apis: ['./src/routes/*.ts'], // Caminho para os arquivos de rotas com anotações Swagger

};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
