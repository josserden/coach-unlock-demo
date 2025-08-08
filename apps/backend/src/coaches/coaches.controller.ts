import { Controller, Get } from '@nestjs/common';
import { Coach } from 'shared-types';
import { CoachesService } from './coaches.service';

@Controller('coaches')
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @Get()
  getCoaches(): Coach[] {
    return this.coachesService.getAllCoaches();
  }
}
