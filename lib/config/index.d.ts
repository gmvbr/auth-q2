import { RequestModel, RoleModel } from '../core/model';
export interface Configuration {
    role: RoleModel;
    request: RequestModel;
}
export declare function validate(config: Configuration): void;
