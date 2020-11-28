import get from 'lodash/get';
import { getResponse } from '@utils/testUtils';

describe('Address graphQL-server-DB mutation tests', () => {
  const createAddressMut = `
  mutation {
    createAddress (
      address1: "new address one"
      address2: "new address two"
      city: "new city"
      country: "new country"
      lat: 2
      long: 2
    ) {
      id
      address1
      address2
      city
      country
      lat
      long
      createdAt
      updatedAt
      deletedAt
      suppliers {
        edges {
          node {
            name
          }
        }
      }
      stores {
        edges {
          node {
            name
          }
        }
      }
    }
  }
`;

  it('should have a mutation to create a new address', async done => {
    await getResponse(createAddressMut).then(response => {
      const result = get(response, 'body.data.createAddress');
      expect(result).toMatchObject({
        id: '1',
        address1: 'new address one',
        address2: 'new address two',
        city: 'new city',
        country: 'new country'
      });
      done();
    });
  });
});
