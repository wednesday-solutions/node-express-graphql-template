import { updateUsingId } from '@database/dbUtils';

describe('updateUsingId', () => {
  let mocks;
  beforeEach(() => {
    mocks = {
      model: { name: 'mock', findOne: jest.fn(), update: jest.fn(() => [1]) }
    };
  });
  it('should invoke model.update, model.findOne with the correct args when it actually does update rows of the model', async () => {
    jest.spyOn(mocks.model, 'findOne');
    jest.spyOn(mocks.model, 'update');
    const args = { id: 1 };
    await updateUsingId(mocks.model, args);

    // check if update is being invoked with the correct args
    expect(mocks.model.update.mock.calls.length).toEqual(1);
    expect(mocks.model.update.mock.calls[0][0]).toEqual(args);
    expect(mocks.model.update.mock.calls[0][1]).toEqual({ where: { id: args.id, deletedAt: null } });

    // check if model.findOne is being invoked with the correct args
    expect(mocks.model.findOne.mock.calls.length).toEqual(1);
    expect(mocks.model.findOne.mock.calls[0][0]).toEqual({ where: { id: args.id } });
  });

  it('should throw an error if the affected rows are 0', async () => {
    mocks.model.update = jest.fn(() => [0]);
    jest.spyOn(mocks.model, 'findOne');
    jest.spyOn(mocks.model, 'update');
    const args = { id: 1 };
    expect(updateUsingId(mocks.model, args)).rejects.toEqual(`Data not found`);

    // check if update is being invoked with the correct args
    expect(mocks.model.update.mock.calls.length).toEqual(1);
    expect(mocks.model.update.mock.calls[0][0]).toEqual(args);
    expect(mocks.model.update.mock.calls[0][1]).toEqual({ where: { id: args.id, deletedAt: null } });

    // findOne should not be called in this case
    expect(mocks.model.findOne.mock.calls.length).toEqual(0);
  });

  it('should throw an error there is an error while updating the model', async () => {
    mocks.model.update = jest.fn(() => new Error('failed to update'));
    jest.spyOn(mocks.model, 'findOne');
    jest.spyOn(mocks.model, 'update');
    const args = { id: 1 };
    expect(updateUsingId(mocks.model, args)).rejects.toEqual(`Failed to update ${mocks.model.name}`);

    // check if update is being invoked with the correct args
    expect(mocks.model.update.mock.calls.length).toEqual(1);
    expect(mocks.model.update.mock.calls[0][0]).toEqual(args);
    expect(mocks.model.update.mock.calls[0][1]).toEqual({ where: { id: args.id, deletedAt: null } });

    // findOne should not be called in this case
    expect(mocks.model.findOne.mock.calls.length).toEqual(0);
  });
});
