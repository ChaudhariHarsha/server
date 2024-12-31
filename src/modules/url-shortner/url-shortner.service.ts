import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { nanoid } from 'nanoid';
import { UrlShortener } from 'src/models/url-shortener.model';
import { Response } from 'express';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UrlShortenerService {
  constructor(
    @InjectModel(UrlShortener)
    private readonly urlShortenerModel: typeof UrlShortener,
    private redisService: RedisService,
  ) {}

  async shortenUrl(url: string, userId: number): Promise<string> {
    try {
      const existingUrl = await this.urlShortenerModel.findOne({
        where: { originalUrl: url },
        raw: true,
      });
      if (!existingUrl) {
        const encodedUrl = nanoid(7);
        const newUrl = await this.urlShortenerModel.create(
          {
            originalUrl: url,
            shortenUrl: encodedUrl,
            createdBy: userId,
            updatedBy: userId,
          },
          { raw: true },
        );
        this.redisService.set(encodedUrl, JSON.stringify(newUrl));
        return encodedUrl;
      } else {
        existingUrl.count += 1;
        existingUrl.save();
        this.redisService.set(
          existingUrl.shortenUrl,
          JSON.stringify(existingUrl),
        );
        return existingUrl.shortenUrl;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateHitCount(urlInfo: UrlShortener){
    try { 
      const result = await this.urlShortenerModel.findOne({where:{shortenUrl:urlInfo.shortenUrl}})
      result.count += 1;
      await result.save()
    } catch (error) {
      throw new Error(error)
    }
  }

  async redirectOrignalUrl(shortId: string, res: Response): Promise<void> {
    try {
      let urlInfo;
      const redisKeyInfo = await this.redisService.get(shortId);
      if (redisKeyInfo) {
        urlInfo = JSON.parse(redisKeyInfo);
      } else {
        urlInfo = await this.urlShortenerModel.findOne({
          where: { shortenUrl: shortId },
          attributes: ['originalUrl'],
          raw: true,
        });
      }

      if (urlInfo) {
        urlInfo.shortenUrl=shortId
        this.updateHitCount(urlInfo)
        res.redirect(urlInfo.originalUrl);
      } else {
        throw new Error('Unable to find url info');
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUrlAnalytics(shortId: string): Promise<number> {
    try {
      const result= await this.urlShortenerModel.findOne({
        where: { shortenUrl: shortId },
        raw:true
      });
      return result ? result.count : 0
    } catch (error) {
      throw new Error(error);
    }
  }
}
