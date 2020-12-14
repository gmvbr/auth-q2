import {FileModel} from './file';
import {join} from 'path';

describe('test file model', () => {
  it('check path exist', () => {
    expect(() => FileModel.loadFromFile('x')).toThrowError('x != exist');
  });
  it('check path is file', () => {
    expect(() => FileModel.loadFromFile(__dirname)).toThrowError(
      __dirname + ' != file'
    );
  });
  it('expect error', () => {
    expect(() =>
      FileModel.loadFromFile(join(__dirname, 'file.ts'))
    ).toThrowError();
  });

  it('check model', async () => {
    const instance = FileModel.loadFromFile(join(__dirname, 'permission.json'));
    expect(instance.givePermissionTo()).toBe(false);
    expect(instance.revokePermissionTo()).toBe(false);
    expect(instance.hasPermissionTo('su', 'system')).toBe(false);
    expect(instance.hasPermissionTo('admin', 'system')).toBe(true);
    expect(instance.hasPermissionTo('salesman', 'system')).toBe(false);
    expect(instance.hasPermissionTo('salesman', 'product.sell')).toBe(true);
  });
});
