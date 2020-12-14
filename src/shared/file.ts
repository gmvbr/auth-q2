import {RoleModel} from '../core/model';
import {readFileSync, existsSync, statSync} from 'fs';

export class FileModel extends RoleModel {
  private cache: {[k: string]: string[]} = {};

  static loadFromFile(path: string) {
    if (!existsSync(path)) {
      throw new Error(path + ' != exist');
    }
    if (!statSync(path).isFile()) {
      throw new Error(path + ' != file');
    }
    const model = new FileModel();
    const text = readFileSync(path).toString();
    model.cache = JSON.parse(text) as {};
    return model;
  }

  public givePermissionTo(): boolean {
    return false;
  }

  public hasPermissionTo(role: string, permission: string): boolean {
    if (this.cache[role] === undefined) {
      return false;
    }
    if (this.cache[role].includes('*')) {
      return true;
    }
    return this.cache[role].includes(permission);
  }

  public revokePermissionTo(): boolean {
    return false;
  }
}
