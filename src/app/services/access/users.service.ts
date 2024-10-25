import { randomUUID } from 'crypto';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { hash, argon2id } from 'argon2';

import { RoleEnum } from '../../../common/enum/role.enum';
import Role from '../../../database/entities/access/roles.entity';
import User from '../../../database/entities/access/user.entity';
import Country from '../../../database/entities/directories/countries.entity';
import Distribution from '../../../database/entities/directories/distribution.entity';
import { CreateUserDto } from '../../dtos/access/users/create-user.dto';
import { PageOptionsDto } from '../../dtos/page/dto/page-options.dto';
import {
  UpdateProfileDto,
  UpdateUserDto,
} from '../../dtos/access/users/update-user.dto';
// import BalanceHistoryCustomerEntity from '../../../database/entities/history/balance-history-customer.entity';
import PaymentMethod from '../../../database/entities/directories/client-payment-method.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Distribution)
    private readonly distributionRepository: Repository<Distribution>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
    // @InjectRepository(BalanceHistoryCustomerEntity)
    // private readonly balanceHistoryRepository: Repository<BalanceHistoryCustomerEntity>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return hash(password, {
      type: argon2id,
    });
  }

  async create(data: CreateUserDto) {
    const { countryId, roleId, password, ...payload } = data;

    await this.checkEmailUnique(data.email);

    const [country, role] = await Promise.all([
      this.countryRepository.findOneByOrFail({ id: countryId }),
      this.roleRepository.findOneByOrFail({ id: roleId }),
    ]);

    return this.userRepository.save({
      id: randomUUID(),
      ...payload,
      password: await this.hashPassword(password),
      limit: data.limit,
      country,
      role,
    });
  }

  async checkEmailUnique(email: string) {
    const user = await this.userRepository.findOneBy({
      email,
    });

    if (user) {
      throw new BadRequestException('Email mast be unique');
    }
  }

  async profile(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        country: true,
        role: true,
        distribution: true,
        cart: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(data: UpdateProfileDto, user: User): Promise<User> {
    if (data?.email) {
      await this.checkEmailUnique(data.email);

      user.email = data.email;
    }

    if (data?.address) {
      user.address = { ...user.address, ...data.address };
    }

    if (data?.distributionId) {
      user.distribution = await this.distributionRepository.findOneByOrFail({
        id: data.distributionId,
      });
    }

    if (data?.name) {
      user.name = data.name;
    }

    if (data?.phone) {
      user.phone = data.phone;
    }

    if (data?.limit) {
      user.limit = data.limit;
    }

    return this.userRepository.save({
      ...data,
      ...user,
    });
  }

  findAll(page: PageOptionsDto, customer: boolean) {
    return this.userRepository.findAndCount({
      where: {
        role: {
          slug: customer ? Not(RoleEnum.ADMIN) : Not(IsNull()),
        },
      },
      relations: {
        country: true,
        role: true,
      },
      take: page.limit,
      skip: page.skip,
    });
  }

  findAllRoles() {
    return this.roleRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        country: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Cart Not Found');
    }

    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.findOne(id);

    if (data?.email && user.email !== data.email) {
      await this.checkEmailUnique(data.email);

      user.email = data.email;
    }

    if (data?.name) {
      user.name = data.name;
    }

    if (data?.phone) {
      user.phone = data.phone;
    }

    if (data?.limit) {
      user.limit = data.limit;
    }

    if (data?.address) {
      user.address = { ...user.address, ...data.address };
    }

    if (data?.countryId) {
      user.country = await this.countryRepository.findOneByOrFail({
        id: data.countryId,
      });
    }

    if (data?.roleId) {
      user.role = await this.roleRepository.findOneByOrFail({
        id: data.roleId,
      });
    }

    return this.userRepository.save({
      ...data,
      ...user,
    });
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    if (user.role.slug === RoleEnum.ADMIN) {
      return user;
    }

    return this.userRepository.delete(id);
  }

  // balance operations and save history operations
  async subBalance(id: string, sum: number) {
    const user = await this.findOne(id);
    // const paymentMethod = await this.paymentMethodRepository.findOneByOrFail({
    //   id: paymentId,
    // });
    // const prevSum = user.balance;

    user.balance -= sum;

    await this.userRepository.save({ ...user });

    // await this.balanceHistoryRepository.save({
    //   id: randomUUID(),
    //   prevSum,
    //   sum,
    //   paymentMethod,
    //   user,
    // });
  }

  async addBalance(id: string, sum: number) {
    const user = await this.findOne(id);
    // const paymentMethod = await this.paymentMethodRepository.findOneByOrFail({
    //   id: paymentId,
    // });
    // const prevSum = user.balance;

    user.balance += sum;

    await this.userRepository.save({ ...user });

    // await this.balanceHistoryRepository.save({
    //   id: randomUUID(),
    //   prevSum,
    //   sum,
    //   user,
    //   paymentMethod,
    // });
  }
}
