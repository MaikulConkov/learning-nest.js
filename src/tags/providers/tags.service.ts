import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../tag.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from '../dtos/create-tag.dto';

Injectable();
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>,
  ) {}

  public async createTag(@Body() createTagsDto: CreateTagDto): Promise<Tag> {
    const tag = this.tagsRepository.create(createTagsDto);
    return await this.tagsRepository.save(tag);
  }
}
