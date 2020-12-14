import Plugin from './index';
import fastify, {FastifyRequest} from 'fastify';
import fastifyJWT from 'fastify-jwt';
import fastifyAuth from 'fastify-auth';
import {RequestModel, RoleModel} from './core/model';

interface TokenUser {
  role: string;
}

class MockRoleModel extends RoleModel {
  private cache: {[k: string]: string[]} = {};

  public givePermissionTo(role: string, permission: string): boolean {
    if (this.cache[role] === undefined) {
      this.cache[role] = [];
    }
    if (this.cache[role].includes(permission)) {
      return true;
    }
    this.cache[role].push(permission);
    return false;
  }

  public hasPermissionTo(role: string, permission: string): boolean {
    if (this.cache[role] === undefined) {
      this.cache[role] = [];
    }
    return this.cache[role].includes(permission);
  }

  public revokePermissionTo(role: string, permission: string): boolean {
    if (this.cache[role] === undefined) {
      this.cache[role] = [];
    }
    if (this.cache[role].includes(permission)) {
      this.cache[role].splice(this.cache[role].indexOf(permission));
      return true;
    }
    return false;
  }
}

class MockRequestModel extends RequestModel {
  public getRoleFromRequest(
    request: FastifyRequest
  ): Promise<string | undefined> | string | undefined {
    return (request.user as TokenUser).role;
  }
}

describe('test plugin', () => {
  const app = fastify()
    .register(fastifyAuth)
    .register(fastifyJWT, {
      secret: 'test',
    })
    .register(Plugin, {
      request: new MockRequestModel(),
      role: new MockRoleModel(),
    })
    .register(async fastify => {
      await fastify.authQ2.role.givePermissionTo('admin', 'admin.info');
      await fastify.authQ2.role.givePermissionTo('user', 'user.info');
    })
    .after(() => {
      app
        .post('/sign', async (_, reply) => {
          const token = await reply.jwtSign({
            sub: 'xxxx',
            role: 'admin',
          });
          return {token};
        })
        .post(
          '/verify',
          {
            preHandler: app.auth([app.authQ2.authenticate]),
          },
          async () => ({
            success: true,
          })
        )
        .post(
          '/admin.info',
          {
            preHandler: app.auth(
              [app.authQ2.authenticate, app.authQ2.permission('admin.info')],
              {
                relation: 'and',
              }
            ),
          },
          async () => ({
            success: true,
          })
        );
    });

  beforeAll(async () => {
    try {
      await app.listen(0);
      expect(app.authQ2).not.toBeNull();
      expect(app.authQ2.authenticate).not.toBeNull();
      expect(app.authQ2.permission).not.toBeNull();
      expect(app.authQ2.role).not.toBeNull();
      expect(app.authQ2.request).not.toBeNull();
    } catch (e) {
      expect(e).toBeUndefined();
    }
  });

  afterAll(async () => app.close());

  it('test invalid jwt', async () => {
    const response = await app.inject({
      method: 'POST',
      path: '/verify',
      headers: {
        authorization: 'Bearer error',
      },
    });
    expect(response.json()).toStrictEqual({
      error: 'Unauthorized',
      message: 'Authorization token is invalid: jwt malformed',
      statusCode: 401,
    });
  });

  it('test valid jwt', async () => {
    const token = await app.inject({
      method: 'POST',
      path: '/sign',
    });
    const response = await app.inject({
      method: 'POST',
      path: '/verify',
      headers: {
        authorization: 'Bearer ' + token.json().token,
      },
    });
    expect(response.json()).toStrictEqual({
      success: true,
    });
  });

  it('expect getRoleFromRequest as null', async () => {
    const response = await app.inject({
      method: 'POST',
      path: '/admin.info',
      headers: {
        authorization: 'Bearer ' + app.jwt.sign({role: null}),
      },
    });
    expect(response.json()).toStrictEqual({
      error: 'Forbidden',
      message: "You don't have permission to access",
      statusCode: 403,
    });
  });

  it('expect getRoleFromRequest as undefined', async () => {
    const response = await app.inject({
      method: 'POST',
      path: '/admin.info',
      headers: {
        authorization: 'Bearer ' + app.jwt.sign({role: undefined}),
      },
    });
    expect(response.json()).toStrictEqual({
      error: 'Forbidden',
      message: "You don't have permission to access",
      statusCode: 403,
    });
  });

  it('expect getRoleFromRequest as string', async () => {
    const response = await app.inject({
      method: 'POST',
      path: '/admin.info',
      headers: {
        authorization: 'Bearer ' + app.jwt.sign({role: false}),
      },
    });
    expect(response.json()).toStrictEqual({
      error: 'Forbidden',
      message: "You don't have permission to access",
      statusCode: 403,
    });
  });

  it('expect `hasPermissionTo` false', async () => {
    const response = await app.inject({
      method: 'POST',
      path: '/admin.info',
      headers: {
        authorization: 'Bearer ' + app.jwt.sign({role: 'user'}),
      },
    });
    expect(response.json()).toStrictEqual({
      error: 'Forbidden',
      message: "You don't have permission to access",
      statusCode: 403,
    });
  });

  it('expect `hasPermissionTo` false', async () => {
    const response = await app.inject({
      method: 'POST',
      path: '/admin.info',
      headers: {
        authorization: 'Bearer ' + app.jwt.sign({role: 'user'}),
      },
    });
    expect(response.json()).toStrictEqual({
      error: 'Forbidden',
      message: "You don't have permission to access",
      statusCode: 403,
    });
  });

  it('expect `hasPermissionTo` true', async () => {
    const response = await app.inject({
      method: 'POST',
      path: '/admin.info',
      headers: {
        authorization: 'Bearer ' + app.jwt.sign({role: 'admin'}),
      },
    });
    expect(response.json()).toStrictEqual({
      success: true,
    });
  });
});
