import { session } from './database';
import wikiList from './wikiFiles/pageslist';

const getShortestPath = (fromNode: string, toNode: string) => {
  const pathQ = `Match (a:Wikipedia {id:"${fromNode}"}), (b:Wikipedia {id:"${toNode}"}) Match path = shortestPath( (a)-[*..4]->(b) ) return path`;
  const response = { nodes: [{id: toNode, group: 2}, {id: fromNode, group: 2}], links: [{}] };

  return session.run(pathQ).then(result => {
    result.records.forEach(record => {
      const path = record.get('path').segments;
      path.forEach((step: any) => {
        const start: any = step.start.properties.id;
        const end: any = step.end.properties.id;
        if (start !== toNode && start !== fromNode) {
          response.nodes.push({id: start, group: 1});
        }
        response.links.push({source: start, target: end, value: 1});
      })
    })
    response.links.shift();
    return response;
  })
};

const getAllPaths = (fromNode: string, toNode: string) => {
  const path = `Match (a:Wikipedia {id:"${fromNode}"}), (b:Wikipedia {id:"${toNode}"}) Match path = allShortestPaths( (a)-[*..4]->(b) ) return path`;
  const response = {nodes: [{id: toNode, group: 2}, {id: fromNode, group: 2}], links: [{}]};
  interface memory {[key: string]: boolean};
  const memo: memory = {};
  memo[toNode] = true;
  memo[fromNode] = true;

  return session.run(path).then(result => {
    result.records.forEach(record => {
      const paths = record.get('path').segments;
      paths.forEach((step: any) => {
        const start: any = step.start.properties.id;
        const end: any = step.end.properties.id;
        if (!memo.hasOwnProperty(start + end)) {
          response.links.push({source: start, target: end, value: 1});
        }
        if (!memo.hasOwnProperty(start)) response.nodes.push({id: start, group: 1});
        if (!memo.hasOwnProperty(end)) response.nodes.push({id: end, group: 1});
        memo[start + end] = true;
        memo[start] = true;
        memo[end] = true;
      })
    })
    response.links.shift();
    return response;
  })
};

const getSurroundings = (node: string, distance: number = 1) => {
  const all = `Match (a:Wikipedia {id:"${node}"}) Match path = ( (a)-[:LINK*1..${distance}]-(b:Wikipedia) ) return path`;
  const response = {nodes: [{id: node, group: 2}], links: [{}]};
  interface memory {[key: string]: boolean};
  const memo: memory = {};
  memo[node] = true;

  return session.run(all).then(result => {
    result.records.forEach(record => {
      const paths = record.get('path').segments;
      paths.forEach((step: any) => {
        const start: any = step.start.properties.id;
        const end: any = step.end.properties.id;
        if (!memo.hasOwnProperty(start + end)) {
          response.links.push({source: start, target: end, value: 1});
        }
        
        if (!memo.hasOwnProperty(start)) response.nodes.push({id: start, group: 1});
        if (!memo.hasOwnProperty(end)) response.nodes.push({id: end, group: 1});
        memo[start + end] = true;
        memo[start] = true;
        memo[end] = true;
      })
    })
    response.links.shift();
    return response;
  })
};

const getNodesList = () => {
  const nodes: any = [];
  wikiList.split('\n').forEach(node => {
    nodes.push({id: node, item: node});
  })
  return nodes;
}

export { 
  getShortestPath,
  getAllPaths, 
  getSurroundings,
  getNodesList
};



