import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

import Role from './roles.entity';
import UserPasswordReset from './user-password-reset.entity';
import Country from '../directories/countries.entity';
import CustomerOrder from '../orders/customer-orders.entity';
import { AddressProps } from '../../../app/dtos/orders/create-order.dto';
import Distribution from '../directories/distribution.entity';
import Cart from '../cart/cart.entity';

@Entity('users')
export default class User {
  public constructor(partEntity?: Partial<User>) {
    if (!partEntity) {
      partEntity = {};
    }
    if (!partEntity.id) {
      partEntity.id = randomUUID();
    }

    Object.assign(this, partEntity);
  }

  @ApiProperty()
  @PrimaryColumn('uuid')
  public id: string;

  @ApiProperty()
  @Column()
  public name: string;

  @ApiProperty()
  @Column({ default: true })
  public legalPerson: boolean;

  @ApiProperty()
  @Column({ unique: true })
  public email: string;

  @ApiProperty()
  @Column({ nullable: true, select: false })
  public password: string;

  @ApiProperty()
  @Column({ nullable: true })
  public phone?: string;

  @ApiProperty()
  @Column({ default: 0, type: 'float' })
  public balance: number;

  @ApiProperty()
  @Column({ default: 0, type: 'float' })
  public limit: number;

  @ApiProperty({ type: () => Role })
  @ManyToOne(() => Role, (role) => role.users, {
    nullable: false,
  })
  @JoinColumn({ name: 'role_id' })
  public role: Role;

  @ApiProperty()
  @OneToOne(() => Cart, (cart) => cart.user)
  public cart: Cart;

  @ApiProperty({ type: () => Country })
  @ManyToOne(() => Country, {
    nullable: false,
  })
  @JoinColumn({ name: 'country_id' })
  public country: Country;

  @ApiProperty()
  @Column({
    type: 'varchar',
    nullable: true,
    transformer: {
      from(value) {
        return JSON.parse(value);
      },
      to(value) {
        return JSON.stringify(value);
      },
    },
  })
  public address: AddressProps;

  @ApiProperty()
  @ManyToOne(() => Distribution, {
    cascade: ['insert'],
    nullable: true,
  })
  @JoinColumn({ name: 'distribution_id' })
  public distribution: Distribution;

  @ApiProperty({ type: () => [CustomerOrder] })
  @OneToMany(() => CustomerOrder, (order) => order.createdBy, {
    nullable: false,
  })
  public orders: CustomerOrder[];

  @ApiProperty()
  @OneToOne(() => UserPasswordReset, (passwordReset) => passwordReset.user, {
    cascade: true,
  })
  public passwordReset: UserPasswordReset;

  @ApiProperty()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  public createdAt: Date;
}
