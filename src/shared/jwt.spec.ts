import {JWTRequestModel} from './jwt';
import fastify from 'fastify';
import fastifyJWT from 'fastify-jwt';
import fastifyAuth from 'fastify-auth';

describe('test plugin', () => {
  const jwt = JWTRequestModel.create();
  const app = fastify()
    .register(fastifyAuth)
    .register(fastifyJWT, {
      secret: 'test',
    })
    .after(() => {
      app.post('/empty', async request => {
        return {role: jwt.getRoleFromRequest(request)};
      });
      app.post(
        '/get-role',
        {
          async preHandler(request, reply) {
            try {
              await request.jwtVerify();
            } catch (err) {
              reply.send(err);
            }
          },
        },
        async request => {
          return {role: jwt.getRoleFromRequest(request)};
        }
      );
    });

  beforeAll(async () => {
    try {
      await app.listen(0);
    } catch (e) {
      expect(e).toBeUndefined();
    }
  });

  afterAll(async () => app.close());

  it('expect user undefined', async () => {
    const response = await app.inject({
      method: 'POST',
      path: '/empty',
    });
    expect(response.json()).toStrictEqual({});
  });

  it('expect user.role invalid', async () => {
    let response = await app.inject({
      method: 'POST',
      path: '/get-role',
      headers: {
        authorization: 'Bearer ' + app.jwt.sign({role: null}),
      },
    });
    expect(response.json()).toStrictEqual({});
    response = await app.inject({
      method: 'POST',
      path: '/get-role',
      headers: {
        authorization: 'Bearer ' + app.jwt.sign({role: undefined}),
      },
    });
    expect(response.json()).toStrictEqual({});
    response = await app.inject({
      method: 'POST',
      path: '/get-role',
      headers: {
        authorization: 'Bearer ' + app.jwt.sign({role: 1}),
      },
    });
    expect(response.json()).toStrictEqual({});
  });

  it('expect user.role valid', async () => {
    const response = await app.inject({
      method: 'POST',
      path: '/get-role',
      headers: {
        authorization: 'Bearer ' + app.jwt.sign({role: 'admin'}),
      },
    });
    expect(response.json()).toStrictEqual({
      role: 'admin',
    });
  });
});
