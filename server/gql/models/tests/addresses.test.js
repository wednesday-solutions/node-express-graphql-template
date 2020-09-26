import get from 'lodash/get';
import { GraphQLSchema } from 'graphql';
import { mockServer } from 'graphql-tools';
import { createFieldsWithType, expectSameTypeNameOrKind } from 'server/utils/testUtils';
import { QueryRoot } from '../../queries';
import { MutationRoot } from '../../mutations';
import { addressFields } from 'gql/models/addresses';
import { timestamps } from 'gql/models/timestamps';

const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });
const myMockServer = mockServer(schema);

let fields = [];

fields = createFieldsWithType({ ...addressFields, ...timestamps });

const query = `
  {
    __type(name: "Address") {
        name
        kind
        fields {
          name
          type {
            name
            kind
          }
        }
      }    
  }
`;
describe('Address introspection tests', () => {
  it('should have the correct fields and types', async () => {
    const result = await myMockServer.query(query);
    const addressFieldTypes = get(result, 'data.__type.fields');
    const hasCorrectFieldTypes = expectSameTypeNameOrKind(addressFieldTypes, fields);
    expect(hasCorrectFieldTypes).toBeTruthy();
  });
});
