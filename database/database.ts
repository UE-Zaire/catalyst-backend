import { v1 as neo4j } from 'neo4j-driver';
import keys from '../config';

const drivers = neo4j.driver('bolt://hobby-mbklilkocmacgbkeiemideal.dbs.graphenedb.com:24786', neo4j.auth.basic(keys.username, keys.password));
export const session = drivers.session();
export const driver = drivers;

drivers.onCompleted = () => {console.log('Driver created')};
drivers.onError = (error) => {console.log('error', error)};

  //addLinks(wikiLinks);
  //traverseList();
  //getShortestPath('Mind', '0');
  //getAllPaths('Mind', '0')
  //getSurroundings('0', 2)