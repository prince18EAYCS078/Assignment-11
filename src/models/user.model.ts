import {Entity, model, property, belongsTo} from '@loopback/repository';
import {IAuthUser} from 'loopback4-authentication';
import {Role} from './role.model';
import {Customer} from './customer.model';

@model()
export class User extends Entity implements IAuthUser {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  middleName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;
  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
  })
  password?: string;


  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  contact: string;

  @property({
    type: 'string',
    required: true,
  })
  role: string;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'number',
  })
  cid?: number;

  @belongsTo(() => Role)
  roleId: number;

  @belongsTo(() => Customer)
  customerId: number;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
