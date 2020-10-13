import range from 'lodash/range';
import faker from 'faker';

const testDate = new Date();
export const addressesTable = range(1, 10).map((value, index) => ({
  id: index + 1,
  address1: faker.address.streetName(),
  address2: faker.address.streetAddress(),
  city: faker.address.city(),
  country: faker.address.country(),
  lat: faker.address.latitude(),
  long: faker.address.longitude()
}));
export const productsTable = { id: 1, name: 'product name', category: 'product category', amount: 10 };
export const purchasedProductsTable = { id: 1, productId: 1, price: 10, discount: 10, deliveryDate: testDate };
export const storesTable = { id: 1, name: 'store name', addressId: 1 };
export const storeProductsTable = { id: 1, productId: 1, storeId: 1 };
export const suppliersTable = { id: 1, name: 'supplier name', addressId: 1 };
export const supplierProductsTable = { id: 1, productId: 1, supplierId: 1 };
