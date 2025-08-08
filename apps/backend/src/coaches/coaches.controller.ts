import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { Coach } from 'shared-types';
import { CoachesService } from './coaches.service';
import { RateLimit } from '../common/decorators/rate-limit.decorator';
import { RateLimitInterceptor } from '../common/interceptors/rate-limit.interceptor';

@Controller('coaches')
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @Get()
  getCoaches(): Coach[] {
    return this.coachesService.getAllCoaches();
  }

  @Get('user/:userId')
  getUser(@Param('userId') userId: string) {
    return this.coachesService.getUser(userId);
  }

  @Post(':coachId/unlock')
  @UseInterceptors(RateLimitInterceptor)
  @RateLimit({
    windowMs: 5000, // 5 seconds
    max: 1, // 1 query
    keyGenerator: (req) => `unlock:${req.body.userId}:${req.ip}`, // Per user + IP
  })
  unlockCoach(
    @Param('coachId') coachId: string,
    @Body('userId') userId: string,
  ) {
    return this.coachesService.unlockCoach(userId, coachId);
  }
}
