import { FastifyReply, FastifyRequest } from 'fastify';
export declare abstract class RequestModel {
    abstract getRoleFromRequest(request: FastifyRequest, reply: FastifyReply): Promise<string | undefined> | string | undefined;
}
export declare abstract class RoleModel {
    abstract givePermissionTo(role: string, permission: string): Promise<boolean> | boolean;
    abstract hasPermissionTo(role: string, permission: string): Promise<boolean> | boolean;
    abstract revokePermissionTo(role: string, permission: string): Promise<boolean> | boolean;
}
