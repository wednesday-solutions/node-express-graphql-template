import { addWhereClause, isTestEnv, totalConnectionFields } from '@utils/index';

describe('isTestEnv', () => {
  it("should return true if the ENVIRONMENT_NAME is 'test'", () => {
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
