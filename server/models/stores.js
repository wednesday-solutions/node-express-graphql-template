import { GraphQLString, GraphQLObjectType, GraphQLNonNull, GraphQLInt } from 'graphql';
import { connectionDefinitions, forwardConnectionArgs } from 'graphql-relay';
import { nodeInterface } from 'server/node';
import { ItemConnection } from './items';
import { Address } from './addresses';
import { timestamps } from './timestamps';

const Store = new GraphQLObjectType({
  name: 'Store',
  interface: [nodeInterface],
  args: forwardConnectionArgs,
  sqlPaginate: true,
  orderBy: 'id',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    ...timestamps,
    address: {
      type: Address,
      sqlJoin: (storeTable, addressTable, args) => `${addressTable}.id = ${storeTable}.address_id`
    },
    items: {
      type: ItemConnection,
      sqlPaginate: true,
      orderBy: 'id',
      args: forwardConnectionArgs,
      junction: {
        sqlTable: 'store_items',
        sqlJoins: [
          (storeTable, junctionTable, args) => `${storeTable}.id = ${junctionTable}.store_id`,
          (junctionTable, itemTable, args) => `${itemTable}.id = ${junctionTable}.item_id`
        ]
      }
    }
  })
});

Store._typeConfig = {
  sqlTable: 'stores',
  uniqueKey: 'id'
};

const { connectionType: StoreConnection } = connectionDefinitions({
  nodeType: Store,
  connectionFields: {
    total: {
      type: GraphQLNonNull(GraphQLInt)
    }
  }
});

export { Store, StoreConnection };
