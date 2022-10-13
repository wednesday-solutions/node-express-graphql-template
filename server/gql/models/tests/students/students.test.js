import get from 'lodash/get';
import { graphqlSync, GraphQLSchema } from 'graphql';
import { createFieldsWithType, expectSameTypeNameOrKind } from '@utils/testUtils';
import { QueryRoot } from '../../../queries';
import { MutationRoot } from '../../../mutations';
import { studentFields } from '@gql/models/students';
import { timestamps } from '@gql/models/timestamps';

const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });

let fields = [];

fields = createFieldsWithType({ ...studentFields, ...timestamps });

const query = `
  {
    __type(name: "Student") {
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
describe('Student introspection tests', () => {
  it('should have the correct fields and types', async () => {
    const result = await graphqlSync({ schema, source: query });
    const studentFieldTypes = get(result, 'data.__type.fields');
    const hasCorrectFieldTypes = expectSameTypeNameOrKind(studentFieldTypes, fields);
    expect(hasCorrectFieldTypes).toBeTruthy();
  });
});
