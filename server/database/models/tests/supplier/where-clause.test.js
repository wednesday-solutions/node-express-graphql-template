/* eslint-disable no-useless-escape */
import { suppliersTable } from 'server/utils/testUtils/mockData';
import { testApp } from 'server/utils/testUtils/testApp';
import { addWhereClause } from 'utils';
var request = require('supertest');
let spy;
beforeEach(() => {
  const mockDBClient = require('database');
  const client = mockDBClient.client;
  spy = jest.spyOn(client, 'query');
  client.$queueQueryResult([{}, { rows: [{ ...suppliersTable }] }]);
  jest.doMock('database', () => ({ client, getClient: () => client }));
});

describe('Supplier Table where clause tests', () => {
  const supplierName = `
    query {
      supplier (id: 1) {
        id
        name
      }
    }
    `;
  let where = ``;
  where = escape(`"supplier".id=1 `);
  where = addWhereClause(where, `\"supplier\".id = 1`);
  where = addWhereClause(where, `\"supplier\".deleted_at IS NULL `);

  const sqlQuery = `SELECT
    \"supplier\".\"id\" AS \"id\",
    \"supplier\".\"name\" AS \"name\"
  FROM suppliers \"supplier\"
  WHERE ${where}`;

  it('should generate the correct sql query for supplier table', async done => {
    await request(testApp)
      .post('/graphql')
      .type('form')
      .send({ query: supplierName })
      .set('Accept', 'application/json')
      .then(() => {
        expect(spy).toHaveBeenCalledWith(sqlQuery);
        done();
      });
  });
  it('should produce the correct where clause for supplier table', async done => {
    where = escape(`supplier.id=1 `);
    where = addWhereClause(where, `supplier.id = 1`);
    where = addWhereClause(where, `supplier.deleted_at IS NULL `);
    const { addQueries } = require('gql/queries');
    const result = addQueries().supplier.where('supplier', { id: 1 });
    expect(result).toBe(where);
    done();
  });
});
