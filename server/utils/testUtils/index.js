import isNil from 'lodash/isNil';

const testDate = new Date();
const addressesTable = {
  id: 1,
  address1: 'address one',
  address2: 'addresss two',
  city: 'city',
  country: 'country',
  lat: 1,
  long: 1,
  createdAt: testDate,
  updatedAt: testDate,
  deletedAt: null
};
const productsTable = { id: 1, name: 'product name', category: 'product category', amount: 10 };
const purchasedProductsTable = { id: 1, productId: 1, price: 10, discount: 10, deliveryDate: testDate };
const storesTable = { id: 1, name: 'store name', addressId: 1 };
const storeProductsTable = { id: 1, productId: 1, storeId: 1 };
const suppliersTable = { id: 1, name: 'supplier name', addressId: 1 };
const supplierProductsTable = { id: 1, productId: 1, supplierId: 1 };

export const mockQueryResults = {
  addressesTable,
  productsTable,
  purchasedProductsTable,
  storesTable,
  storeProductsTable,
  suppliersTable,
  supplierProductsTable
};

export function mockDBClient() {
  var SequelizeMock = require('sequelize-mock');
  // Setup the mock database connection
  var DBConnectionMock = new SequelizeMock();

  const addressesMock = DBConnectionMock.define('addresses', addressesTable);
  const productsMock = DBConnectionMock.define('products', productsTable);
  const purchasedProductsMock = DBConnectionMock.define('purchased_products', purchasedProductsTable);
  const storesMock = DBConnectionMock.define('stores', storesTable);
  const storeProductsMock = DBConnectionMock.define('store_products', storeProductsTable);
  const suppliersMock = DBConnectionMock.define('suppliers', suppliersTable);
  const supplierProductsMock = DBConnectionMock.define('supplier_products', supplierProductsTable);

  return {
    client: DBConnectionMock,
    models: {
      addresses: addressesMock,
      products: productsMock,
      purchased_products: purchasedProductsMock,
      stores: storesMock,
      store_products: storeProductsMock,
      suppliers: suppliersMock,
      supplier_products: supplierProductsMock
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
