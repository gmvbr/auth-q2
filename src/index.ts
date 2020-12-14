/// <reference types="fastify-jwt" />

import Fp from 'fastify-plugin';
import HttpErrors from 'http-errors';
import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import {Configuration, validate} from './config';
import {RequestModel, RoleModel} from './core/model';

export * from './shared/jwt';
export * from './shared/file';
export * from './core/model';
export * from './config/index';

export const ErrorPermission = HttpErrors(
  403,
  "You don't have permission to access"
);

declare type Hook = (
  request: FastifyRequest,
  reply: FastifyReply
) => Promise<FastifyReply>;

declare module 'fastify' {
  interface FastifyInstance {
    authQ2: {
      request: RequestModel;
      role: RoleModel;
      authenticate: Hook;
      permission: (permission: string) => Hook;
    };
  }
}

export default Fp<Configuration>(
  async (fastify, options) => {
    validate(options);
    fastify.decorate('authQ2', {
      role: options.role,
      request: options.request,
      async authenticate(request: FastifyRequest, reply: FastifyReply) {
        try {
          await request.jwtVerify();
        } catch (err) {
          reply.send(err);
        }
      },
      permission(permission: string) {
        return async function (
          this: FastifyInstance,
          request: FastifyRequest,
          reply: FastifyReply
        ) {
          try {
            const role = await this.authQ2.request.getRoleFromRequest(
              request,
              reply
            );
            if (role === null) {
              return reply.send(ErrorPermission);
            }
            if (role === undefined) {
              return reply.send(ErrorPermission);
            }
            if (typeof role !== 'string') {
              return reply.send(ErrorPermission);
            }
            const isAuthorize = await this.authQ2.role.hasPermissionTo(
              role,
              permission
            );
            if (isAuthorize === true) {
              return;
            }
          } catch (err) {
            /* istanbul ignore next */
            request.log.error(err);
          }
          return reply.send(ErrorPermission);
        };
      },
    });
  },
  {
    fastify: '3.x',
    dependencies: ['fastify-jwt'],
  }
);
