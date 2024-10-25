import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthRefreshTokenDto {
  @ApiProperty()
  @IsString()
  public refreshToken: string;
}

export class AuthForgotPasswordDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  public email: string;
}

export class AuthChangePasswordDto {
  @ApiProperty()
  @IsString()
  public readonly repeatPassword: string;

  @ApiProperty()
  @IsString()
  public readonly newPassword: string;
}

export class AuthResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsString()
  public hash: string;

  @ApiProperty()
  @IsString()
  public readonly password: string;

  @ApiProperty()
  @IsString()
  public readonly retryPassword: string;
}

export class AuthRegisterDto {
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
  @IsString()
  @IsUUID('4')
  public countryId: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public legalPerson: boolean;
}
