import {
  Injectable,
  forwardRef,
  Inject,
  RequestTimeoutException,
  BadRequestException,
} from '@nestjs/common';
import { GetUsersParamsDto } from '../dtos/get-users-params.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { error } from 'console';
/**
 * Class to connect to Users table and perform business operations
 */
@Injectable()
export class UsersService {
  /**
   *contructor
   */
  constructor(
    /**
     * Injecting users repository
     */
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    /**
     *Injecting ConfigService
     */
    private readonly configService: ConfigService,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser = undefined;
    try {
      //check if user exists
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unabled to proccess your request at the moment, please try later',
        { description: 'Error connecting to the database' },
      );
    }
    //if user exists throw error
    if (existingUser) {
      throw new BadRequestException(
        'The user already exists, please check your email.',
      );
    }
    //create ne user
    let newUser = this.usersRepository.create(createUserDto);

    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unabled to proccess your request at the moment, please try later',
        { description: 'Error connecting to the database' },
      );
    }

    return newUser;
  }

  /**
   *The method to get all the users from database
   */
  public findAll(
    getUsersParamsDto: GetUsersParamsDto,
    limit: number,
    page: number,
  ) {
    const environment = this.configService.get('S3_BUCKETS');
    console.log(environment);
    const isAuth = this.authService.isAuth();
    return [
      { firstName: 'john', email: 'john@doe.com' },
      { firstName: 'alice', email: 'alice@doe.com' },
    ];
  }

  /**
   *Find a single user by ID of the user
   */
  public async findOneById(id: number) {
    let user = undefined;
    try {
      user = await this.usersRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unabled to proccess your request at the moment, please try later',
        { description: 'Error connecting to the database' },
      );
    }

    if (!user) {
      throw new BadRequestException('The user Id does not exist');
    }

    return user;
  }
}
