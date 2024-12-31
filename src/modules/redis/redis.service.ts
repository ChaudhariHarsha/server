import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: 'localhost',  // Redis server address
      port: 6379,         // Redis port (default is 6379)
      password: '',       // Optional: Redis password if configured
    });
  }

  // Example method to set a key-value pair
  async set(key: string, value: string): Promise<string> {
    const ttl = 10 * 365 * 24 * 60 * 60;
    return this.redisClient.set(key, value, 'EX', ttl);
  }

  // Example method to get a value by key
  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  // Example method to close the connection
  async quit(): Promise<void> {
    await this.redisClient.quit();
  }
}
