import isNil from 'lodash/isNil';
import {
  addressesTable,
  productsTable,
  purchasedProductsTable,
  storeProductsTable,
  storesTable,
  supplierProductsTable,
  suppliersTable
} from '@server/utils/testUtils/mockData';
import sequelize from 'sequelize';

const defineAndAddAttributes = (connection, name, mock, attr) => {
  const mockTable = connection.define(name, mock);
  mockTable.rawAttributes = attr;
  return mockTable;
};

export function mockDBClient() {
  const SequelizeMock = require('sequelize-mock');
  // Setup the mock database connection
  const DBConnectionMock = new SequelizeMock();

  const addressesMock = defineAndAddAttributes(
    DBConnectionMock,
    'addresses',
    addressesTable[0],
    require('@database/models/addresses').getAttributes(sequelize, sequelize.DataTypes)
  );
  const productsMock = defineAndAddAttributes(
    DBConnectionMock,
    'products',
    productsTable[0],
    require('@database/models/products').getAttributes(sequelize, sequelize.DataTypes)
  );
  const purchasedProductsMock = defineAndAddAttributes(
    DBConnectionMock,
    'purchased_products',
    purchasedProductsTable[0],
    require('@database/models/purchased_products').getAttributes(sequelize, sequelize.DataTypes)
  );
  const storesMock = defineAndAddAttributes(
    DBConnectionMock,
    'stores',
    storesTable[0],
    require('@database/models/stores').getAttributes(sequelize, sequelize.DataTypes)
  );
  const storeProductsMock = defineAndAddAttributes(
    DBConnectionMock,
    'store_products',
    storeProductsTable[0],
    require('@database/models/store_products').getAttributes(sequelize, sequelize.DataTypes)
  );
  const supplierProductsMock = defineAndAddAttributes(
    DBConnectionMock,
    'supplier_products',
    supplierProductsTable[0],
    require('@database/models/supplier_products').getAttributes(sequelize, sequelize.DataTypes)
  );
  const suppliersMock = defineAndAddAttributes(
    DBConnectionMock,
    'suppliers',
    suppliersTable[0],
    require('@database/models/purchased_products').getAttributes(sequelize, sequelize.DataTypes)
  );

  return {
    client: DBConnectionMock,
    models: {
      addresses: addressesMock,
      products: productsMock,
      purchasedProducts: purchasedProductsMock,
      stores: storesMock,
      storeProducts: storeProductsMock,
      suppliers: suppliersMock,
      supplierProducts: supplierProductsMock
    }
  };
}

export async function connectToMockDB() {
  const client = mockDBClient();
  try {
    client.authenticate();
  } catch (error) {
    console.error(error);
  }
}

export const createFieldsWithType = fields => {
  const fieldsWithType = [];
  Object.keys(fields).forEach(key => {
    fieldsWithType.push({
      name: key,
      type: {
        name: fields[key].type
      }
    });
  });
  return fieldsWithType;
};

const getExpectedField = (expectedFields, name) => expectedFields.filter(field => field.name === name);

export const expectSameTypeNameOrKind = (result, expected) =>
  result.filter(field => {
    const expectedField = getExpectedField(expected, field.name)[0];
    // @todo check for connection types.
    if (!isNil(expectedField)) {
      return expectedField.type.name === field.type.name || expectedField.type.kind === field.type.kind;
    }
  }).length === 0;
