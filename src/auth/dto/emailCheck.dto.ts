import { IsEmail } from 'class-validator';

export class CheckEmailDto {
  @IsEmail({}, { message: '이메일 형식에 맞지 않습니다' })
  email: string;
}