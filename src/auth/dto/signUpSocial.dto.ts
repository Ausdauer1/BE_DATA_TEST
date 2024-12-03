import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class SignUpSocialDto {
  @IsString({ message: '닉네임은 문자열로 작성해주세요' })
  @Length(2, 12, { message: '닉네임은 최소 2자 ~ 최대 12자로 설정해주세요' })
  nickname: string;

  @IsEmail({}, { message: '이메일 형식에 맞지 않습니다' })
  email: string;

  @IsString({ message: '타입을 문자열로 작성해주세요' })
  type: string;
}
