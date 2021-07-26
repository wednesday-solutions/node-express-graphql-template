import * as utils from '@utils';
import { getModels } from '../index';
import * as storesModel from '@database/models/stores';
import * as productsModel from '@database/models/products';
import * as addressModel from '@database/models/addresses';
import * as suppliersModel from '@database/models/suppliers';
import * as storeProductsModel from '@database/models/store_products';
import * as supplierProductsModel from '@database/models/supplier_products';
import * as purchasedProductsModel from '@database/models/purchased_products';

jest.unmock('@database/index');
jest.unmock('@database/models/index');
jest.unmock('sequelize');

describe('models index tests', () => {
  describe('getModels', () => {
    it('should invoke the "model" function of all files in the dir folder', async () => {
      const storesModelSpy = jest.spyOn(storesModel, 'model');
      const addressModelSpy = jest.spyOn(addressModel, 'model');
      const productsModelSpy = jest.spyOn(productsModel, 'model');
      const suppliersModelSpy = jest.spyOn(suppliersModel, 'model');
      const storeProductsModelSpy = jest.spyOn(storeProductsModel, 'model');
      const supplierProductsModelSpy = jest.spyOn(supplierProductsModel, 'model');
      const purchasedProductsModelSpy = jest.spyOn(purchasedProductsModel, 'model');
      await getModels('./server/database/models');
      expect(storesModelSpy).toBeCalled();
      expect(addressModelSpy).toBeCalled();
      expect(productsModelSpy).toBeCalled();
      expect(suppliersModelSpy).toBeCalled();
      expect(storeProductsModelSpy).toBeCalled();
      expect(supplierProductsModelSpy).toBeCalled();
      expect(purchasedProductsModelSpy).toBeCalled();
    });

    it('should return an object with file names in camel case', async () => {
      const db = await getModels('./server/database/models');
      expect(db).toHaveProperty('stores');
      expect(db).toHaveProperty('addresses');
      expect(db).toHaveProperty('products');
      expect(db).toHaveProperty('suppliers');
      expect(db).toHaveProperty('storeProducts');
      expect(db).toHaveProperty('supplierProducts');
      expect(db).toHaveProperty('purchasedProducts');
    });

    it('should call getFileNames with the dir parameter', async () => {
      const getFileNamesSpy = jest.spyOn(utils, 'getFileNames');
      await getModels('./server/database/models');
      expect(getFileNamesSpy).toHaveBeenCalledWith('./server/database/models');
    });
  });
});
