import express, { Request, Response } from 'express';
const router = express.Router();

/**
 * @swagger
 * /api/v1/news:
 *   get:
 *     summary: Retorna uma lista de notícias
 *     responses:
 *       200:
 *         description: Lista de notícias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/news', (req: Request, res: Response) => {
  res.json([
    { id: 1, title: 'Abertura do Semestre' },
    { id: 2, title: 'Novas Parcerias' }
  ]);
});

export default router;
