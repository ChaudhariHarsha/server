import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UrlShortener } from './models/url-shortener.model';
import { UrlShortenerController } from './modules/url-shortner/url-shortner.controller';
import { UrlShortenerService } from './modules/url-shortner/url-shortner.service';
import { RedisService } from './modules/redis/redis.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ttl:1000,limit:3}]),
    ConfigModule.forRoot(),
    //TODO:process.env is not working
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'admin',
      database: process.env.DB_NAME || 'mini-url',
      models: [UrlShortener], 
    }),
    SequelizeModule.forFeature([UrlShortener]),

  ],
  controllers: [AppController,UrlShortenerController],
  providers: [AppService,UrlShortenerService,RedisService, {
    provide:APP_GUARD,
    useClass: ThrottlerGuard
  }],
})
export class AppModule {}
