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
      secret: 'secret',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [AuthService],
})
export class AppModule {}
