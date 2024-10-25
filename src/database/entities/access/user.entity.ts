import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import Role from './roles.entity';
import UserPasswordReset from './user-password-reset.entity';

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
  public username: string;

  @ApiProperty()
  @Column({ unique: true })
  public email: string;

  @ApiProperty()
  @Column({ nullable: true, select: false })
  public password: string;

  @ApiProperty({ type: () => Role })
  @ManyToOne(() => Role, (role) => role.users, {
    nullable: false,
  })
  @JoinColumn({ name: 'role_id' })
  public role: Role;

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

  @ApiProperty()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  public updatedAt: Date;
}
