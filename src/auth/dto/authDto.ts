import { IsEmail, IsOptional, IsString, Length, MinDate, MinLength } from 'class-validator';
export namespace AuthDto {
  export class SignUp {
    @IsString({ message: '문자열로 작성해주세요' })
    @Length(2, 12, { message: '닉네임은 최소 2자 ~ 최대 12자로 설정해주세요' })
    nickname: string;

    @IsEmail({}, { message: '이메일 형식에 맞지 않습니다' })
    email: string;

    @IsString({ message: '문자열로 작성해주세요' })
    @Length(8, 20, { message: '비밀번호는 최소 8자 ~ 최대 20자로 설정해주세요' })
    password: string;

    @IsString({ message: '문자열로 작성해주세요' })
    @IsOptional()
    type: string;
  }

  export class signUpSocial {
    @IsString({ message: '문자열로 작성해주세요' })
    @Length(2, 12, { message: '닉네임은 최소 2자 ~ 최대 12자로 설정해주세요' })
    nickname: string;

    @IsEmail({}, { message: '이메일 형식에 맞지 않습니다' })
    email: string;

    @IsString({ message: '문자열로 작성해주세요' })
    @IsOptional()
    type: string;
  }

  export class SignIn {
    @IsEmail({}, { message: '이메일 형식에 맞지 않습니다' })
    email: string;

    @IsOptional()
    @IsString({ message: '문자열로 작성해주세요' })
    @Length(8, 20, { message: '비밀번호는 최소 8자 ~ 최대 20자로 설정해주세요' })
    password: string;
  }

  export class signInSocial {
    @IsEmail({}, { message: '이메일 형식에 맞지 않습니다' })
    email: string;

    // @IsString()
    // @Length(8, 20)
    password: string;
  }

  export class checkEmail {
    @IsEmail({}, { message: '이메일 형식에 맞지 않습니다' })
    email: string;
  }
}
