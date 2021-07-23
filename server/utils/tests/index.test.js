import { addWhereClause, isTestEnv, totalConnectionFields, getFileNames, createModelGetter } from '@utils/index';

describe('isTestEnv', () => {
  it("should return true if the ENVIRONMENT is 'test'", () => {
    expect(isTestEnv()).toBe(true);
  });
});

describe('addWhereClause', () => {
  it("should construct the whereClause correctly'", () => {
    const where = addWhereClause('', 'A = B');
    expect(where).toBe('  WHERE ( A = B ) ');
    expect(addWhereClause(where, 'A = B')).toBe('   WHERE ( A = B )  AND ( A = B ) ');
  });
});

describe('totalConnectionFields', () => {
  expect(totalConnectionFields.connectionFields.total.resolve({ fullCount: 10 })).toBe(10);
});

describe('getFileNames', () => {
  it('should get file names of a directory', () => {
    const fileNames = getFileNames('./server/database/models');
    expect(fileNames[0]).toBe('addresses');
  });

  it('should ignore test folders', () => {
    const fileNames = getFileNames('./server/utils');
    const hasTest = fileNames.includes('tests');
    expect(hasTest).toBeFalsy();
  });

  it('should ignore index files', () => {
    const fileNames = getFileNames('./server/database/models');
    const hasIndex = fileNames.includes('index');
    expect(hasIndex).toBeFalsy();
  });

  it('should call readdirSync with the dir name', () => {
    const readdirSyncSpy = jest.spyOn(require('fs'), 'readdirSync');
    getFileNames('./server/database/models');
    expect(readdirSyncSpy).toBeCalledWith('./server/database/models', { withFileTypes: true });
  });
});

describe('createModelGetter', () => {
  it('should throw an Error if the append parameter is invalid', () => {
    expect(() => createModelGetter({ tables: {}, append: 'invalid' })).toThrow();
  });

  it('should not throw an Error if the append parameter is Queries / Mutations', () => {
    expect(() => createModelGetter({ tables: {}, append: 'Queries' })).not.toThrow();
    expect(() => createModelGetter({ tables: {}, append: 'Mutations' })).not.toThrow();
  });

  it('should throw an Error if the tables parameter is missing', () => {
    expect(() => createModelGetter({ tabeles: {}, append: 'Queries' })).toThrow();
  });

  describe('should return a function', () => {
    const tables = {};
    const getter = createModelGetter({ tables, append: 'Queries' });
    expect(typeof getter).toBe('function');
    const model = {};
    const modelQueries = jest.fn();
    it('should convert the fileName param into camelCase and set the value returned by the getter in tables', () => {
      model.notCamelQueries = modelQueries;
      getter('not-camel', model);
      expect(tables).toHaveProperty('notCamel', modelQueries);
    });

    it('should throw an Error if the getter is not available', () => {
      delete model.notCamelQueries;
      model.nottCamelQueries = modelQueries;
      expect(() => getter('not-camel', model)).toThrow();
    });
  });
});
