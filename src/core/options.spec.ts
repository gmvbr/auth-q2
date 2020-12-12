import {validate} from './options';

describe('test options', () => {
  it('assert expect "require options"', async () => {
    expect(() => {
      validate(undefined as never);
    }).toThrow('require options');
  });

  it('assert expect "require options.name"', async () => {
    expect(() => {
      validate({
        name: undefined as never,
      });
    }).toThrow('require options.name');
  });
});
