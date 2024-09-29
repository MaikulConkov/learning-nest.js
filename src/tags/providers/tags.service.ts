import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../tag.entity';
import { In, Repository } from 'typeorm';
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

  public async findMultibleTags(tags: number[]) {
    let results = await this.tagsRepository.find({
      where: {
        id: In(tags),
      },
    });

    return results;
  }

  public async delete(id: number) {
    await this.tagsRepository.delete(id);
    return { deleted: true, id };
  }

  public async softDelete(id: number) {
    await this.tagsRepository.softDelete(id);
    return { deleted: true, id };
  }
}
