import {Provider} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {AuthErrorKeys, VerifyFunction} from 'loopback4-authentication';
import {User} from '../models';
import {UserRepository} from '../repositories';

export class LocalPasswordVerifyProvider
  implements Provider<VerifyFunction.LocalPasswordFn>
{
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  value(): VerifyFunction.LocalPasswordFn {
    return async (username: any, password: any) => {
      try {
        const user: User = await this.userRepository.verifyPassword(
          username,
          password,
        );
        return user;
      } catch (error) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials)
          .message;
      }
    };
  }
}
