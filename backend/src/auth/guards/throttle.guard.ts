import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

interface ThrottleConfig {
  limit: number;
  ttl: number; // in seconds
}

const THROTTLE_KEY = 'throttle';

// Simple in-memory store for rate limiting
// In production, use Redis
const requestStore = new Map<string, { count: number; resetTime: number }>();

@Injectable()
export class ThrottleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const throttleConfig = this.reflector.get<ThrottleConfig>(
      THROTTLE_KEY,
      context.getHandler(),
    );

    if (!throttleConfig) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const key = this.generateKey(request);
    const now = Date.now();

    const record = requestStore.get(key);

    if (!record || now > record.resetTime) {
      // New window
      requestStore.set(key, {
        count: 1,
        resetTime: now + throttleConfig.ttl * 1000,
      });
      return true;
    }

    if (record.count < throttleConfig.limit) {
      record.count++;
      return true;
    }

    throw new HttpException(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }

  private generateKey(request: any): string {
    // Use IP address and endpoint as key
    const ip = request.ip || request.connection.remoteAddress;
    const endpoint = request.url;
    return `${ip}:${endpoint}`;
  }
}

export const Throttle = (limit: number, ttl: number) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(THROTTLE_KEY, { limit, ttl }, descriptor.value);
    return descriptor;
  };
};
