import { GraphQLString, GraphQLObjectType, GraphQLNonNull, GraphQLInt } from 'graphql';
import { connectionDefinitions, forwardConnectionArgs } from 'graphql-relay';
import { nodeInterface } from 'gql/node';
import { ProductConnection } from './products';
import { Address } from './addresses';
import { timestamps } from './timestamps';

export const storeFields = {
  id: { type: GraphQLInt },
  name: { type: GraphQLString },
  addressId: { sqlColumn: 'address_id', type: GraphQLInt }
};
const Store = new GraphQLObjectType({
  name: 'Store',
  interface: [nodeInterface],
  args: forwardConnectionArgs,
  sqlPaginate: true,
  orderBy: 'id',
  fields: () => ({
    ...storeFields,
    ...timestamps,
    address: {
      type: Address,
      sqlJoin: (storeTable, addressTable, args) => `${addressTable}.id = ${storeTable}.address_id`
    },
    products: {
      type: ProductConnection,
      sqlPaginate: true,
      orderBy: 'id',
      args: forwardConnectionArgs,
      junction: {
        sqlTable: 'store_products',
        sqlJoins: [
          (storeTable, junctionTable, args) => `${storeTable}.id = ${junctionTable}.store_id`,
          (junctionTable, productTable, args) => `${productTable}.id = ${junctionTable}.product_id`
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
