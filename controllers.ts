import { Router, Request, Response } from 'express';
import { getShortestPath, getAllPaths, getSurroundings, getNodesList } from './database/wikipediaPaths';
import * as fs from 'fs';
import * as path from 'path';

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
  const { source, distance } = req.body;
  const result = await getSurroundings(source, distance);
  res.send(result);
});

router.get('/api/nodesList', (req: Request, res: Response) => {
  const result = getNodesList();
  res.send(result);
});

router.get('/api/embedding', (req: Request, res: Response) => {
  const sampleData: number[] = [];

  fs.readFile(path.join(__dirname + './sampleData/embedding.csv'), 'utf8', (err, data) => {
    if (err) { return console.error('error extracting sample data from csv', err); }

    data.split(',').forEach((coord) => {
      sampleData.push(parseFloat(coord));
    });

    res.send(sampleData);
  });
});

export {
  router
};