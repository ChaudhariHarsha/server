import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { UrlShortenerService } from './url-shortner.service';
import { CreateUrlDto } from './dto/url-shortner.dto';
import { Response } from 'express';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('mini-url')
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @Post('create')
  async getShortenUrl(@Body() body:CreateUrlDto): Promise<string>{
    return await this.urlShortenerService.shortenUrl(body.originalUrl,body.userId)
  }

  @Throttle({default:{limit:4,ttl:1000}})
  @Get(':shortId')
  async redirectOrignalUrl(@Param('shortId') shortId: string, @Res() response: Response):Promise<void>{
    await this.urlShortenerService.redirectOrignalUrl(shortId,response)
  } 

  @Get('analytics/:shortId')
  async getUrlAnalytics(@Param('shortId') shortId: string): Promise<number>{
    return await this.urlShortenerService.getUrlAnalytics(shortId);
  }
}
