import {Provider} from '@loopback/context';
import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId} from '@loopback/security';
import {VerifyFunction} from 'loopback4-authentication';

import {UserRepository} from '../repositories';
import {jwtService} from '../services/jwt.service';

export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn>
{
  constructor(
    @service(jwtService)
    public jwtService: jwtService,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  value(): VerifyFunction.BearerFn {
    // return async token => {
    //   if (token && (await this.revokedTokenRepository.get(token))) {
    //     throw new HttpErrors.Unauthorized('Token Revoked');
    //   }
    //   const user = verify(token, process.env.JWT_SECRET as string, {
    //     issuer: process.env.JWT_ISSUER,
    //   }) as User;
    //   return user;
    // };
    return async token => {
      if (!token) {
        throw new HttpErrors.Unauthorized(`Token needed for verification`);
      }
      try {
        var userProfile = await this.jwtService.verifyToken(token);
        var user = this.userRepository.findOne({
          where: {id: +userProfile[securityId]},
        });
      } catch {
        throw new HttpErrors.Unauthorized(
          `Error occured while verifying token`,
        );
      }
      return user;
    };
  }
}
