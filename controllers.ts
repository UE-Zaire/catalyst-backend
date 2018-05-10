import { Router, Request, Response } from 'express';
import { getShortestPath, getAllPaths, getSurroundings, getNodesList } from './database/neo4j/wikipediaPaths';
import { getTweetsByUser } from './twitterAPI/twitterCallers';

const router: Router = Router();

router.post('/api/user', async (req, res) => {
  const { username } = req.body;
  const results = await getTweetsByUser(username);
  res.send(results);
})

router.post('/api/path', async (req: Request, res: Response) => {
  const { source, target } = req.body;
  const result = await getShortestPath(source, target);
  res.send(result);
});

router.post('/api/paths', async (req: Request, res: Response) => {
  const { source, target } = req.body;
  const result = await getAllPaths(source, target);
  res.send(result);
});

router.post('/api/surroundings', async (req: Request, res: Response) => {
  const { source, distance } = req.body;
  const result = await getSurroundings(source, distance);
  res.send(result);
});

router.get('/api/nodesList', (req: Request, res: Response) => {
  const result = getNodesList();
  res.send(result);
})

export {
  router
};