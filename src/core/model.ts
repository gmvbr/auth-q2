import {FastifyReply, FastifyRequest} from 'fastify';

export abstract class RequestModel {
  public abstract getRoleFromRequest(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<string | undefined> | string | undefined;
}

export abstract class RoleModel {
  public abstract givePermissionTo(
    role: string,
    permission: string
  ): Promise<boolean> | boolean;

  public abstract hasPermissionTo(
    role: string,
    permission: string
  ): Promise<boolean> | boolean;

  public abstract revokePermissionTo(
    role: string,
    permission: string
  ): Promise<boolean> | boolean;
}
