import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

interface BranchResponse {
  object: {
    sha: string;
  };
}

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 8000;
const prisma = new PrismaClient();

app.use('/api/v1/ping', (req: Request, res: Response) => {
  return res.status(200).json({ success: true, msg: 'Pong' });
});

const fetch = async (...args: Parameters<typeof import('node-fetch')['default']>) => {
  const { default: fetch } = await import('node-fetch');
  return fetch(...args);
};

const CLIENT_ID = process.env.CLIENT_ID || "";
const CLIENT_SECRET = process.env.CLIENT_SECRET || "";
const REPO_PERSONAL_TOKEN = process.env.REPO_PERSONAL_TOKEN || "";

app.use(cors());
app.use(bodyParser.json());

app.get('/getChallenges', async (req, res) => {
  const challenges = await prisma.challenge.findMany(); // In production, don't forget to use pagination (https://www.prisma.io/docs/concepts/components/prisma-client/pagination)
  res.status(200).json(challenges);
});

app.post('/newBranch', async (req, res) => {
  const githubLink: string = req.body.githubLink;
  const githubId: string = req.body.githubId;
  const baseBranch = 'main';

  const parts = githubLink.split('/');
  const owner = parts[3];
  const repository = parts[4];
  const repoPath = `${owner}/${repository}`;

  // Get UserID by GithubID
  const user = await prisma.user.findUnique({
    where: {
      githubId: githubId
    }
  });

  // Get challengeID by repoPath
  const challenges = await prisma.challenge.findMany({
    where: {
      githubLink: githubLink
    }
  });

  const challenge = challenges[0];

  // Check if the branch already exists by Database
  const challengeStatus = await prisma.completionStatus.findMany({
    where: {
      userId: user.id,
      challengeId: challenge.id
    }
  });

  // Make the POST request to create the new branch (if not exists)
  if (challengeStatus.length == 0) {
    await prisma.completionStatus.create({
      data: {
        userId: user.id,
        challengeId: challenge.id,
        status: false
      }
    });

    try {
      const baseBranchResponse = await fetch(`https://api.github.com/repos/${repoPath}/git/refs/heads/${baseBranch}`, {
        headers: {
          Authorization: `token ${REPO_PERSONAL_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!baseBranchResponse.ok) {
        const errorMessage = await baseBranchResponse.text();
        throw new Error(`Failed to fetch commit SHA of ${baseBranch}: ${errorMessage}`);
      }

      const baseBranchData = await baseBranchResponse.json() as BranchResponse;
      const baseCommitSHA = baseBranchData.object.sha;

      const requestBody = {
        ref: `refs/heads/${githubId}`,
        sha: baseCommitSHA,
      };

      // Make the POST request to create the new branch
      const createBranchResponse = await fetch(`https://api.github.com/repos/${repoPath}/git/refs`, {
        method: 'POST',
        headers: {
          Authorization: `token ${REPO_PERSONAL_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (createBranchResponse.ok) {
        console.log('Branch created successfully!');
        res.status(200).send('Branch created successfully!');
      } else {
        const errorMessage = await createBranchResponse.text();
        console.error('Failed to create branch:', errorMessage);
        res.status(500).send(`Failed to create branch: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error creating branch:', error);
      res.status(500).send(`Error creating branch: ${error.message}`);
    }
  }
  else {
    res.status(204).send('Branch already exists');
  }
});

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
      console.log(response);
      return response.json();
    })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});

app.listen(port, () => {
  console.log("server started");
})