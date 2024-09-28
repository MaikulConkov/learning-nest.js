import { Module } from '@nestjs/common';
import { ServiceService } from './providers/service.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './tag.entity';

@Module({
  controllers: [TagsController],
  providers: [ServiceService],
  imports: [TypeOrmModule.forFeature([Tag])],
})
export class TagsModule {}
