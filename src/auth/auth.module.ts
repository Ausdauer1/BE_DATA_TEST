import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { USER } from 'src/auth/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthRepo } from './auth.repository';

@Module({
  imports: [TypeOrmModule.forFeature([USER])],
  controllers: [AuthController],
  providers: [AuthService, AuthRepo],
  exports: [AuthModule, TypeOrmModule],
})
export class AuthModule {}
