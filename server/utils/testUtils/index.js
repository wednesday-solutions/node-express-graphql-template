import isNil from 'lodash/isNil';

export function mockDBClient() {
  var SequelizeMock = require('sequelize-mock');
  // Setup the mock database connection
  var DBConnectionMock = new SequelizeMock();

  const addressesMock = DBConnectionMock.define('addresses');
  const productsMock = DBConnectionMock.define('products');
  const purchasedProductsMock = DBConnectionMock.define('purchased_products');
  const storesMock = DBConnectionMock.define('stores');
  const storeProductsMock = DBConnectionMock.define('store_products');
  const suppliersMock = DBConnectionMock.define('suppliers');
  const supplierProductsMock = DBConnectionMock.define('supplier_products');

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
