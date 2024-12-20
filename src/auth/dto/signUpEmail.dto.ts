import { IsEmail, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpEmailDto {
  @IsString({ message: '닉네임은 문자열로 작성해주세요' })
  @Length(2, 12, { message: '닉네임은 최소 2자 ~ 최대 12자로 설정해주세요' })
  @ApiProperty({ description: '닉네임(2~12자)' })
  nickname: string;

  @IsEmail({}, { message: '이메일 형식에 맞지 않습니다' })
  @ApiProperty({ description: '이메일' })
  email: string;

  @IsString({ message: '비밀번호는 문자열로 작성해주세요' })
  @Length(8, 20, { message: '비밀번호는 최소 8자 ~ 최대 20자로 설정해주세요' })
  @ApiProperty({ description: '비밀번호(8~20자)' })
  password: string;

  @IsString({ message: '타입은 문자열로 작성해주세요' })
  @ApiProperty({ description: 'email 또는 google' })
  type: string;
}
