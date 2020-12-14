import {RequestModel} from '../core/model';
import {FastifyRequest} from 'fastify';

export interface TypeToken {
  role: string;
}

export class JWTRequestModel extends RequestModel {
  static create() {
    return new JWTRequestModel();
  }

  public getRoleFromRequest(request: FastifyRequest): string | undefined {
    const user = request.user as TypeToken;
    if (user === undefined) {
      return undefined;
    }
    if (
      user.role !== undefined &&
      user.role !== null &&
      typeof user.role === 'string'
    ) {
      return user.role;
    }
    return undefined;
  }
}
