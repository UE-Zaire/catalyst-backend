import { session } from './database';

const getShortestPath = (fromNode: string, toNode: string) => {
  const pathQ = `Match (a:Wikipedia {id:"${fromNode}"}), (b:Wikipedia {id:"${toNode}"}) Match path = shortestPath( (a)-[*..4]->(b) ) return path`;
  const response = { nodes: [{id: toNode, group: 1}], links: [] };

  session.run(pathQ).then(path => {
    path.records[0]._fields[0].segments.forEach(segment => {
      const start: any = segment.start.properties.id;
      const end: any = segment.end.properties.id
      response.nodes.push({id: start, group: 1});
      response.links.push({source: start, target: end, value: 1});
    })
    return response; 
  })
}

const getAllPaths = (fromNode: string, toNode: string) => {
  const path = `Match (a:Wikipedia {id:"${fromNode}"}), (b:Wikipedia {id:"${toNode}"}) Match path = allShortestPaths( (a)-[*..4]->(b) ) return path`;
  const response = { nodes: [{id: toNode, group: 1}], links: [] };

  session.run(path).then(path => {
    path.records.forEach(result => {
      result._fields[0].segments.forEach(segment => {
        const start: any = segment.start.properties.id;
        const end: any = segment.end.properties.id
        response.nodes.push({id: start, group: 1});
        response.links.push({source: start, target: end, value: 1});
      })
    })
    return response;
  })
}

const getSurroundings = (node: string, distance: number = 1) => {
  const all = `Match (a:Wikipedia {id:"${node}"}) Match path = ( (a)-[:LINK*1..${distance}]-(b:Wikipedia) ) return path`;
  const response = { nodes: [{id: node, group: 1}], links: [] };
  const memo = {};
  memo[node] = true;

  session.run(all).then(path => {
    path.records.forEach(result => {
      result._fields.forEach(field => {
        field.segments.forEach(segment => {
          const start: any = segment.start.properties.id;
          const end: any = segment.end.properties.id;
          if (!memo[start + end]) {
            response.links.push({source: start, target: end, value: 1});
          }
          if (!memo[start]) response.nodes.push({id: start, group: 1});
          if (!memo[end]) response.nodes.push({id: end, group: 1});
          memo[start + end] = true;
          memo[start] = true;
          memo[end] = true;
        })
      })
    })
    return response;
  })
}

export { 
  session
  getShortestPath, 
  getAllPaths, 
  getSurroundings 
};



