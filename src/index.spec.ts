import Plugin from './index';
import fastify from 'fastify';

describe('test plugin', () => {
  it('register plugin', async () => {
    const app = fastify();
    app.register(Plugin, {name: 'test'});
    try {
      await app.listen(0);
      await app.close();
    } catch (e) {
      expect(e).toBeUndefined();
    }
  });
});
