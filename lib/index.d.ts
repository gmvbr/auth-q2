/// <reference types="node" />
import { FastifyReply, FastifyRequest } from 'fastify';
import HttpErrors from 'http-errors';
import { Configuration } from './config';
import { RequestModel, RoleModel } from './core/model';
export declare const ErrorPermission: HttpErrors.HttpError;
declare type Hook = (request: FastifyRequest, reply: FastifyReply) => Promise<FastifyReply>;
declare module 'fastify' {
    interface FastifyInstance {
        authQ2: {
            request: RequestModel;
            role: RoleModel;
            autenticate: Hook;
            permission: (permission: string) => Hook;
        };
    }
}
declare const _default: import("fastify").FastifyPluginAsync<Configuration, import("http").Server>;
export default _default;
