import { Router, Request, Response } from 'express';
import { getShortestPath, getAllPaths, getSurroundings } from './database/controllers';

const router: Router = Router();

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
  const { source } = req.body;
  const result = await getSurroundings(source);
  res.send(result);
});

export {
  router
};