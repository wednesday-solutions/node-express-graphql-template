import { getEarliestCreatedDate } from '@utils/queries';
describe('Queries tests', () => {
  it('should return the earliest created purchasedProduct ', async () => {
    const res = await getEarliestCreatedDate();
    expect(res.getDate()).toEqual(new Date().getDate());
  });
});
