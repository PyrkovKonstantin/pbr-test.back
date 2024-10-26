import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import TypeOrmConfigService from './config/orm.config';
import { MailerModule } from '@nestjs-modules/mailer';
import SmtpConfigService from './config/mailer.config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './app/controllers/access/auth.controller';
import { AuthService } from './app/services/access/auth.service';
import Role from './database/entities/access/roles.entity';
import User from './database/entities/access/user.entity';
import UserPasswordReset from './database/entities/access/user-password-reset.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    MailerModule.forRootAsync({
      useClass: SmtpConfigService,
    }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_KEY,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRES_IN },
    }),
    TypeOrmModule.forFeature([Role, User, UserPasswordReset]),
  ],
  controllers: [AppController, AuthController],
  providers: [AuthService],
})
export class AppModule {}
