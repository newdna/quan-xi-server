import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
// import { PrismaClient } from '@prisma/client';

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 8000;
// const prisma = new PrismaClient();

app.use('/api/v1/ping', (req: Request, res: Response) => {
  return res.status(200).json({ success: true, msg: 'Pong' });
});

// app.use('/api/v1/challenge', async (req: Request, res: Response) => {
//   const challenge = await prisma.challenge.findMany({});
//   return res.status(200).json({ success: true, data: challenge });
// });

// app.listen(port, async () => {
//   await prisma.$connect();
//   console.log(`[*] Server Running on Port ${port}`);
// });

const fetch = async (...args: Parameters<typeof import('node-fetch')['default']>) => {
  const { default: fetch } = await import('node-fetch');
  return fetch(...args);
};

const CLIENT_ID = process.env.CLIENT_ID || "";
const CLIENT_SECRET = process.env.CLIENT_SECRET || "";

app.use(cors());
app.use(bodyParser.json());

app.get('/getAccessToken', async (req, res) => {

  req.query.code;

  const param = '?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&code=' + req.query.code;
  console.log(param)
  await fetch('http://github.com/login/oauth/access_token' + param, {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    }
  })
    .then((response) => { return response.json() })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});

app.get('/getUserData', async (req, res) => {
  req.get('Authorization');
  await fetch('https://api.github.com/user', {
    method: 'GET',
    headers: {
      'Authorization': req.get('Authorization'),
    }
  })
    .then((response) => { 
      console.log(response)
      return response.json() })
    .then((data) => {
      console.log("DATA: ", data)
      res.json(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});

app.listen(port, () => {
  console.log("server started");
})