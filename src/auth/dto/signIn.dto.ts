import { IsEmail, IsOptional, IsString, Length 
} from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: '이메일 형식에 맞지 않습니다' })
  email: string;

  @IsOptional()
  @IsString({ message: '비밀번호를 문자열로 작성해주세요' })
  @Length(8, 20, { message: '비밀번호는 최소 8자 ~ 최대 20자로 설정해주세요' })
  password: string;
}

