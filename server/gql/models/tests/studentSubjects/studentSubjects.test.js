import get from 'lodash/get';
import { graphqlSync, GraphQLSchema } from 'graphql';
import { createFieldsWithType, expectSameTypeNameOrKind } from '@utils/testUtils';
import { QueryRoot } from '../../../queries';
import { MutationRoot } from '../../../mutations';
import { timestamps } from '@gql/models/timestamps';
import { studentSubjectFields } from '@gql/models/studentSubjects';

const schema = new GraphQLSchema({ query: QueryRoot, mutation: MutationRoot });

let fields = [];

fields = createFieldsWithType({ ...studentSubjectFields, ...timestamps });

const query = `
  {
    __type(name: "StudentSubject") {
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
describe('Student subject introspection tests', () => {
  it('should have the correct fields and types', async () => {
    const result = await graphqlSync({ schema, source: query });
    const studentSubjectFieldTypes = get(result, 'data.__type.fields');
    const hasCorrectFieldTypes = expectSameTypeNameOrKind(studentSubjectFieldTypes, fields);
    expect(hasCorrectFieldTypes).toBeTruthy();
  });
});
