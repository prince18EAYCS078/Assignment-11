import {
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {
  Role, User
} from '../models';
import {UserRepository} from '../repositories';

export class UserRoleController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['GetUsersRoleById']})
  @get('/users/{id}/role', {
    responses: {
      '200': {
        description: 'Role belonging to User',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Role)},
          },
        },
      },
    },
  })
  async getRole(
    @param.path.number('id') id: typeof User.prototype.id,
  ): Promise<Role> {
    return this.userRepository.role(id);
  }
}
