import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { USER } from 'src/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([USER])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthModule, TypeOrmModule]
})
export class AuthModule {}
