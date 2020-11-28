import { createNodeInterface } from 'graphql-sequelize';
import { getClient } from '@database/index';

let nodeInterface;

export function getNode() {
  if (!nodeInterface) {
    nodeInterface = createNodeInterface(getClient());
    return nodeInterface;
  }
  return nodeInterface;
}
