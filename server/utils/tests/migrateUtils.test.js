describe('migrationUtils tests', () => {
  jest.mock('shelljs', () => ({
    ls: () => ['test_file_name_1', 'test_file_name_2']
  }));
  jest.mock('fs', () => ({
    readFileSync: () => {}
  }));
  it('should export a getVersion function that returns the version of the current migration', () => {
    const { getVersion } = require('./../migrateUtils');
    const version = getVersion('test_file_name_2');
    expect(version).toBe(2);
  });
  it('should extract the version from the currentFile and pass the resources to query', () => {
    const fs = require('fs');
    const fsSpy = jest.spyOn(fs, 'readFileSync');
    const { migrate } = require('./../migrateUtils');
    const query = jest.fn(async () => {});
    const queryInterface = {
      sequelize: {
        query
      }
    };
    migrate('test_file_name_2', queryInterface);
    const filesInResourcesVersion = ['test_file_name_1', 'test_file_name_2'];
    expect(fsSpy).toHaveBeenCalledWith(`./resources/v${2}/${filesInResourcesVersion[0]}`, 'utf-8');
  });
  it('should have a migrate function that calls query for all migrations', () => {
    const { migrate } = require('./../migrateUtils');
    const query = jest.fn(async () => {});
    const queryInterface = {
      sequelize: {
        query
      }
    };
    const result = migrate('test_file_name_2', queryInterface);
    expect(result);
    expect(query).toHaveBeenCalled();
  });
  it('should have a migrate function that catches a sql error if the migration fails', async () => {
    const sqlError = new Error();
    sqlError.original = {
      sqlMessage: {
        startsWith: () => true,
        endsWith: () => true
      }
    };
    const query = jest.fn(() => new Promise((resolve, reject) => reject(sqlError)));
    const { migrate } = require('./../migrateUtils');
    const queryInterface = {
      sequelize: {
        query
      }
    };
    expect(await migrate('test_file_name_2', queryInterface)).toBeFalsy();
  });
});
