import {validate} from '.';
import {RequestModel, RoleModel} from '../core/model';

class MockRoleModel extends RoleModel {
  public givePermissionTo(): boolean | Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  public hasPermissionTo(): boolean | Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  public revokePermissionTo(): boolean | Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}

class MockRequestModel extends RequestModel {
  public getRoleFromRequest():
    | Promise<string | undefined>
    | string
    | undefined {
    throw new Error('Method not implemented.');
  }
}

describe('test config', () => {
  it('assert expect "require config"', async () => {
    expect(() => {
      validate(undefined as never);
    }).toThrow('require config');
  });

  it('assert expect "require config.role"', async () => {
    expect(() => {
      validate({
        role: undefined as never,
        request: undefined as never,
      });
    }).toThrow('require config.role');
  });

  it('assert expect "require config.role"', async () => {
    expect(() => {
      validate({
        role: true as never,
        request: undefined as never,
      });
    }).toThrow('require config.role instanceof RoleModel');
  });

  it('assert expect "require config.request"', async () => {
    expect(() => {
      validate({
        role: new MockRoleModel(),
        request: undefined as never,
      });
    }).toThrow('require config.request');
  });

  it('assert expect "require config.request"', async () => {
    expect(() => {
      validate({
        role: new MockRoleModel(),
        request: true as never,
      });
    }).toThrow('require config.request instanceof RequestModel');
  });

  it('done', async () => {
    expect(() => {
      validate({
        role: new MockRoleModel(),
        request: new MockRequestModel(),
      });
    }).not.toThrow();
  });
});
