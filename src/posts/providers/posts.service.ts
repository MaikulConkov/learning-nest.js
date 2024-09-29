import { Body, Injectable } from '@nestjs/common';
import { title } from 'process';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,

    private readonly tagsService: TagsService,
    private readonly usersService: UsersService,
  ) {}
  public async findAll(userId: string) {
    let posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
        author: true,
        tags: true,
      },
    });

    return posts;
  }

  public async create(@Body() createPostDto: CreatePostDto) {
    //Find the author from database based on authorId
    let author = await this.usersService.findOneById(createPostDto.authorId);

    //Find tags
    let tags = await this.tagsService.findMultibleTags(createPostDto.tags);

    let post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    return await this.postsRepository.save(post);
  }

  public async delete(id: number) {
    //Deleting the post
    await this.postsRepository.delete(id);

    //confirmation
    return { deleted: true, id };
  }

  public async update(@Body() patchPostsDto: PatchPostDto) {
    //Find the tags
    let tags = await this.tagsService.findMultibleTags(patchPostsDto.tags);

    //Find the post
    let post = await this.postsRepository.findOneBy({ id: patchPostsDto.id });
    //Update the propertied of the post
    post.title = patchPostsDto.title ?? post.title;
    post.content = patchPostsDto.content ?? post.content;
    post.status = patchPostsDto.status ?? post.status;
    post.postType = patchPostsDto.postType ?? post.postType;
    post.slug = patchPostsDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostsDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostsDto.publishOn ?? post.publishOn;
    //Assign the new tags
    post.tags = tags;

    //Save the post and return it
    return await this.postsRepository.save(post);
  }
}
