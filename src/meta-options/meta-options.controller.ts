import { Body, Controller, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from './meta-option.entity';
import { Repository } from 'typeorm';
import { CreatePostMetaOptionsDto } from './dtos/create-post-meta-otions.dto';
import { MetaOptionsServices } from './providers/meta-options.service';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(private readonly metaOptionsServices: MetaOptionsServices) {}

  @Post()
  public createMetaOptions(
    @Body() createPostMetaOptionsDto: CreatePostMetaOptionsDto,
  ) {
    return this.metaOptionsServices.createMetaOptions(createPostMetaOptionsDto);
  }
}
