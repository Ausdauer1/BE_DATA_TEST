import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckEmailDto {
  @IsEmail({}, { message: '이메일 형식에 맞지 않습니다' })
  @ApiProperty({ description: '이메일' })
  email: string;
}