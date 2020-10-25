/* eslint-disable no-useless-escape */
import { purchasedProductsTable } from 'server/utils/testUtils/mockData';
import { testApp } from 'server/utils/testUtils/testApp';
import { addWhereClause } from 'utils';

var request = require('supertest');
let spy;
beforeEach(() => {
  const mockDBClient = require('database');
  const client = mockDBClient.client;
  spy = jest.spyOn(client, 'query');
  client.$queueQueryResult([{}, { rows: [{ ...purchasedProductsTable }] }]);
  jest.doMock('database', () => ({ client, getClient: () => client }));
});

describe('PurchasedProduct Table where clause tests', () => {
  const purchasedProductName = `
  query {
    purchasedProduct (id: 1) {
      id
      price
    }
  }
    `;

  let where = `TRUE`;
  where = addWhereClause(where, `\"purchasedP\".id = 1`);
  where = addWhereClause(where, `\"purchasedP\".deleted_at IS NULL `);

  const sqlQuery = `SELECT
  \"purchasedP\".\"id\" AS \"id\",
  \"purchasedP\".\"price\" AS \"price\"
FROM purchased_products \"purchasedP\"
WHERE ${where}`;

  it('should generate the correct sql query for purchasedProduct table', async done => {
    await request(testApp)
      .post('/graphql')
      .type('form')
      .send({ query: purchasedProductName })
      .set('Accept', 'application/json')
      .then(() => {
        expect(spy).toHaveBeenCalledWith(sqlQuery);
        done();
      });
  });
});
