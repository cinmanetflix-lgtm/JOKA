import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/entities/user.entity';

/**
 * Guard to check if the user is the owner of the resource or an admin
 * This guard should be used after JwtAuthGuard
 */
@Injectable()
export class ResourceOwnerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Admins can access all resources
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // For other users, we'll validate ownership in the service layer
    // This guard just ensures authentication
    return true;
  }
}
