import {
  Body,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async signIn(@Body() signInDto: SignInDto) {
    let user = await this.userService.findOneByEmail(signInDto.email);

    const isEqual: boolean = false;
    try {
      isEqual ==
        (await this.hashingProvider.comparePassword(
          signInDto.password,
          user.password,
        ));
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare passwords',
      });
    }
    if (!isEqual) {
      throw new UnauthorizedException('Incorrect password');
    }

    return true;
  }
}
