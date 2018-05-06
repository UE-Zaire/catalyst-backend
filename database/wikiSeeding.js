import session = require('./database');
import driver = require('./database');
import wikiLinks = require('./wikiFiles/links');
import wikiList = require('./wikiFiles/pageslist');

const insertEgdes = (links) => {
  links.forEach(tuple => {
    if (tuple[0] !== tuple[1]){
      const addEdgeQ = `MATCH (u:Wikipedia {id:"${tuple[0]}"}), (r:Wikipedia {id:"${tuple[1]}"}) Merge (u)-[:LINK]->(r)`;
      session.run(addEdgeQ).then(result => {
        console.log(result);
      })
    }
  });
}
      
const insertNode = (list) => {
  wikiArr = list.split('\n');
  wikiArr.forEach(node => {
    const insertQ = `Merge (t: Wikipedia {id: '${node}'})`;
    session.run(insertQ)
    .then((res) => {
      console.log(res);
    });
  });
}
 
driver.onCompleted = () => {
  //insertEgdes(wikiLinks); // run this second
  //insertNodes(); // Run this first
};

