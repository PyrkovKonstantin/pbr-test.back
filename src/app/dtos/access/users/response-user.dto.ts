import { ApiProperty } from '@nestjs/swagger';

import { RoleEnum } from 'common/enum/role.enum';
import Country from '../../../../database/entities/directories/countries.entity';
import Distribution from '../../../../database/entities/directories/distribution.entity';
import { AddressProps } from '../../orders/create-order.dto';

export class RoleDto {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public nameEn: string;

  @ApiProperty({ enum: RoleEnum })
  public slug: RoleEnum;
}
export class ResponseUserDto {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public email: string;

  @ApiProperty()
  public phone: string;

  @ApiProperty()
  public balance: number;

  @ApiProperty()
  public limit: number;

  @ApiProperty()
  public address: AddressProps;

  @ApiProperty()
  public createdAt: Date;

  @ApiProperty({ type: RoleDto })
  public role: RoleDto;

  @ApiProperty()
  public country: Country;

  @ApiProperty()
  public distribution: Distribution;
}
