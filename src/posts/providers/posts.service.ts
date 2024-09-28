import { Body, Injectable } from '@nestjs/common';
import { title } from 'process';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    public readonly metaOptionsRepository: Repository<MetaOption>,

    private readonly usersService: UsersService,
  ) {}
  public async findAll(userId: string) {
    const user = this.usersService.findOneById(userId);
    let posts = await this.postsRepository.find();

    return posts;
  }

  public async create(@Body() createPostDto: CreatePostDto) {
    let post = this.postsRepository.create(createPostDto);

    return await this.postsRepository.save(post);
  }

  public async delete(id: number) {
    //Find the post
    let post = await this.postsRepository.findOneBy({ id });
    //Deleting the post
    await this.postsRepository.delete(id);
    //We delte the post first because postgre wont let me delete metaOptions if it has foreign key entry in another entity
    //Delete metaoptions
    await this.metaOptionsRepository.delete(post.metaOptions.id);
    //confirmation
    return { deleted: true, id };
  }
}
