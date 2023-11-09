import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app: Express = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use('/api/v1/ping', (req: Request, res: Response) => {
  return res.status(200).json({ success: true, msg: 'Pong' });
});

app.use('/api/v1/challenge', async (req: Request, res: Response) => {
  const challenge = await prisma.challenge.findMany({});
  return res.status(200).json({ success: true, data: challenge });
});

app.listen(port, async () => {
  await prisma.$connect();
  console.log(`[*] Server Running on Port ${port}`);
});