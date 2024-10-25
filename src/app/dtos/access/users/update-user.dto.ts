import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsUUID,
  ValidateNested,
  IsEmail,
  IsNumber,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

import { CreateUserDto } from './create-user.dto';
import { AddressProps } from '../../orders/create-order.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressProps)
  public address: AddressProps;
}

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @IsUUID('4')
  public distributionId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressProps)
  public address: AddressProps;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public phone: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public balance: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public limit: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsEmail()
  public email: string;
}
