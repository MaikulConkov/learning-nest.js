import {
  Body,
  Controller,
  Delete,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { TagsService } from './providers/tags.service';
import { CreateTagDto } from './dtos/create-tag.dto';
import { Tag } from './tag.entity';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  public createTags(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagsService.createTag(createTagDto);
  }

  @Delete()
  public async deleteTag(@Query('id', ParseIntPipe) id: number) {
    return this.tagsService.delete(id);
  }

  //tags/soft-delete
  @Delete('soft-delete')
  public async softDeleteTag(@Query('id', ParseIntPipe) id: number) {
    return this.tagsService.softDelete(id);
  }
}
