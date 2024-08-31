import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { serve, setup } from 'swagger-ui-express';
import * as swaggerSpec from './swagger';

dotenv.config();

const app: Express = express();

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.use('/api-docs', serve, setup(swaggerSpec));
