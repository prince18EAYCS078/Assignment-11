import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {PgDataSource} from '../datasources';
import {User, UserRelations, Role, Customer} from '../models';
import {RoleRepository} from './role.repository';
import {CustomerRepository} from './customer.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly role: BelongsToAccessor<Role, typeof User.prototype.id>;

  public readonly customer: BelongsToAccessor<Customer, typeof User.prototype.id>;

  constructor(
    @inject('datasources.pg') dataSource: PgDataSource, @repository.getter('RoleRepository') protected roleRepositoryGetter: Getter<RoleRepository>, @repository.getter('CustomerRepository') protected customerRepositoryGetter: Getter<CustomerRepository>,

  ) {
    super(User, dataSource);
    this.customer = this.createBelongsToAccessorFor('customer', customerRepositoryGetter,);
    this.registerInclusionResolver('customer', this.customer.inclusionResolver);
    this.role = this.createBelongsToAccessorFor('role', roleRepositoryGetter,);
    this.registerInclusionResolver('role', this.role.inclusionResolver);
  }

  async verifyPassword(username: string, password: string): Promise<User> {
    const user = await super.findOne({where: {username}});
    if (!user) {
      throw new HttpErrors.NotFound('username does not exist');
    }
    const passwordCheck = password === user.password ? true : false;
    if (!passwordCheck) throw new HttpErrors.Unauthorized('wrong password');

    return user;
  }
}
