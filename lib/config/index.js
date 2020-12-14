"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const assert_1 = __importDefault(require("assert"));
const model_1 = require("../core/model");
function validate(config) {
    assert_1.default(config, 'require config');
    assert_1.default(config.role, 'require config.role');
    assert_1.default(config.role instanceof model_1.RoleModel, 'require config.role instanceof RoleModel');
    assert_1.default(config.request, 'require config.request');
    assert_1.default(config.request instanceof model_1.RequestModel, 'require config.request instanceof RequestModel');
}
exports.validate = validate;
//# sourceMappingURL=index.js.map