import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({ default: 'administrator-russia@italian-fabric.com' })
  @IsString()
  @IsEmail()
  public email: string;

  @ApiProperty({ default: 'password' })
  @IsString()
  public password: string;
}
