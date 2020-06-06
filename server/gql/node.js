import { nodeDefinitions, fromGlobalId } from 'graphql-relay';
import { client } from 'database';
import joinMonster from 'join-monster';

const { nodeInterface, nodeField } = nodeDefinitions(
  // resolve the ID to an object
  (globalId, context, resolveInfo) => {
    // parse the globalID
    const { type, id } = fromGlobalId(globalId);

    // pass the type name and other info. `joinMonster` will find the type from the name and write the SQL
    return joinMonster.getNode(type, resolveInfo, context, parseInt(id), sql => client.query(sql));
  },
  // determines the type. Join Monster places that type onto the result object on the "__type__" property
  obj => obj.__type__
);
export { nodeInterface, nodeField };
