import assert from 'assert';
import {RequestModel, RoleModel} from '../core/model';

export interface Configuration {
  role: RoleModel;
  request: RequestModel;
}

export function validate(config: Configuration) {
  assert(config, 'require config');
  assert(config.role, 'require config.role');
  assert(
    config.role instanceof RoleModel,
    'require config.role instanceof RoleModel'
  );
  assert(config.request, 'require config.request');
  assert(
    config.request instanceof RequestModel,
    'require config.request instanceof RequestModel'
  );
}
