"use strict";
/// <reference types="fastify-jwt" />
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorPermission = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const http_errors_1 = __importDefault(require("http-errors"));
const config_1 = require("./config");
exports.ErrorPermission = http_errors_1.default(403, "You don't have permission to access");
exports.default = fastify_plugin_1.default(async (fastify, options) => {
    config_1.validate(options);
    fastify.decorate('authQ2', {
        role: options.role,
        request: options.request,
        async authenticate(request, reply) {
            try {
                await request.jwtVerify();
            }
            catch (err) {
                reply.send(err);
            }
        },
        permission(permission) {
            return async function (request, reply) {
                try {
                    const role = await options.request.getRoleFromRequest(request, reply);
                    if (role === undefined) {
                        return reply.send(exports.ErrorPermission);
                    }
                    if (typeof role !== 'string') {
                        return reply.send(exports.ErrorPermission);
                    }
                    const isAuthorize = await options.role.hasPermissionTo(role, permission);
                    if (isAuthorize === true) {
                        return reply;
                    }
                    return reply.send(exports.ErrorPermission);
                }
                catch (err) {
                    request.log.error(err);
                    return reply.send(exports.ErrorPermission);
                }
            };
        },
    });
}, {
    fastify: '3.x',
    dependencies: ['fastify-jwt'],
});
//# sourceMappingURL=index.js.map