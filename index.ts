import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { serve, setup } from 'swagger-ui-express';
import swaggerSpec from './swagger'; // Importa o swaggerSpec do arquivo swagger.ts
import connection from './db'; // Importa a conexão
import News from './models/News';

import swaggerUi from 'swagger-ui-express';
import newsRoutes from './src/routes/News'; // Importa as rotas de notícias


dotenv.config();

const app: Express = express();

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// Criando uma rota GET para o endpoint raiz "/"
app.get('/opa', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.get('/news', async (req: Request, res: Response) => {
  try {
    const news = await News.findAll();
    res.json(news);
  } catch (err) {
    res.status(500).send('Erro ao consultar notícias');
  }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Configura o Swagger UI

app.use('/api/v1', newsRoutes); // Usa as rotas de notícias

// app.use('/api-docs', serve, setup(swaggerSpec)); // Usa o swaggerSpec para configurar o Swagger UI

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
