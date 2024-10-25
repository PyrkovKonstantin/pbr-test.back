import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsString()
  public password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public phone: string;

  @ApiProperty()
  @IsNumber()
  public balance: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public limit: number;

  @ApiProperty()
  @IsString()
  @IsUUID('4')
  public countryId: string;

  @ApiProperty()
  @IsString()
  @IsUUID('4')
  public roleId: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public legalPerson: boolean;
}
