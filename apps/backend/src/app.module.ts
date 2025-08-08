import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoachesModule } from './coaches/coaches.module';

@Module({
  imports: [CoachesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
