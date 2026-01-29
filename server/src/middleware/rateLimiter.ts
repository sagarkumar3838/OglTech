import { Request, Response, NextFunction } from 'express';
import config from '../config/env';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private windowMs: number;
  private maxRequests: number;
  private enabled: boolean;

  constructor() {
    this.windowMs = config.rateLimit.windowMs;
    this.maxRequests = config.rateLimit.maxRequests;
    this.enabled = config.rateLimit.enabled;

    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  private cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach((key) => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!this.enabled) {
        return next();
      }

      // Use user ID if authenticated, otherwise use IP
      const identifier = (req as any).user?.uid || req.ip || 'anonymous';
      const now = Date.now();

      if (!this.store[identifier]) {
        this.store[identifier] = {
          count: 1,
          resetTime: now + this.windowMs,
        };
        return next();
      }

      const record = this.store[identifier];

      // Reset if window has passed
      if (now > record.resetTime) {
        record.count = 1;
        record.resetTime = now + this.windowMs;
        return next();
      }

      // Increment count
      record.count++;

      // Check if limit exceeded
      if (record.count > this.maxRequests) {
        const resetIn = Math.ceil((record.resetTime - now) / 1000);
        res.status(429).json({
          error: 'Too many requests',
          message: `Rate limit exceeded. Please try again in ${resetIn} seconds.`,
          retryAfter: resetIn,
        });
        return;
      }

      // Add rate limit headers
      res.setHeader('X-RateLimit-Limit', this.maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', (this.maxRequests - record.count).toString());
      res.setHeader('X-RateLimit-Reset', new Date(record.resetTime).toISOString());

      next();
    };
  }
}

export const rateLimiter = new RateLimiter();
