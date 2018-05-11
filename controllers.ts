import { Router, Request, Response } from 'express';
import { getShortestPath, getAllPaths, getSurroundings, getNodesList } from './database/neo4j/wikipediaPaths';
import { getTweets } from './database/mySQL/twitterStorage';
import { getUserFollowers } from './twitterAPI/twitterCallers';
import passport from 'passport';
import * as fs from 'fs';
import * as path from 'path';

const router: Router = Router();

//---------------------------------------------------------- LOGIN

router.get('/twitter/login',
  passport.authenticate('twitter'));

router.get('/logged', (req, res) => {
  res.redirect('/');
});

//---------------------------------------------------------- TWITTER 

router.post('/api/twitterFollowers', async (req, res) => {
  const { username } = req.body;
  const results = await getUserFollowers(username);
  res.send(results);
});

//---------------------------------------------------------- WIKIPEDIA

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

router.post('/api/surroundings', async (req: any, res: Response) => {
  const { source, distance } = req.body;
  const result = await getSurroundings(source, distance); 
  res.send(result);
});

router.get('/api/nodesList', (req: Request, res: Response) => {
  const result = getNodesList();
  res.send(result);
});

//----------------------------------------------------------- SAMPLE DATA

router.get('/api/embedding', (req: Request, res: Response) => {
  const sampleData: object[] = [];
  fs.readFile(path.join(__dirname + '/sampleData/embedding.csv'), 'utf8', (err, data) => {

    const csvData = data.split(',');

    for (let i = 0; i < csvData.length; i += 2) {
      sampleData.push([parseFloat(csvData[i]), parseFloat(csvData[i + 1])]);
    }

    fs.readFile(path.join(__dirname + '/sampleData/clusters10.csv'), 'utf8', (err, data) => {
      if (!err) {
        const clusterData = data.split('\n');
        const comb = sampleData.map((arr: any, i: number) => [...arr, parseInt(clusterData[i])]);
        res.send(comb);
      } 
    })
  });
});

export {
  router
};