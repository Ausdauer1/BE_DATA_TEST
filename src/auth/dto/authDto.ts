import { IsEmail, IsOptional, IsString ,Length, MinDate, MinLength} from "class-validator";
export namespace AuthDto {
    export class SignUp {

      @IsString({ message: "문자열로 작성해주세요" })
      @MinLength(2, { message: "닉네임은 최소 2자 ~ 최대 12자로 설정해주세요." })
      nickname: string;

      @IsString({ message: "문자열로 작성해주세요" })
      @Length(8, 20, { message: "비밀번호는 최소 2자 ~ 최대 12자로 설정해주세요" })
      password: string;

      @IsEmail({}, { message: "비밀번호는 최소 2자 ~ 최대 12자로 설정해주세요" })
      email: string;
      
      @IsString()
      @IsOptional()
      type: string;
  
    }

    export class signUpSocial {
      // @IsString()
      // @Length(2, 12)
      // id: string;

      @IsString()
      @MinLength(2, {
        message: "닉네임의 길이가 짧아용ㅠㅠ"
      })
      nickname: string;

      @IsEmail()
      email: string;

      @IsString()
      type: string;
  
    }
  
    export class SignIn {
      @IsEmail()
      email: string;
  
      @IsOptional()
      @IsString()
      @Length(8, 20)
      password: string;
    }

    export class signInSocial {
      // @IsEmail()
      email: string;
  
      // @IsString()
      // @Length(8, 20)
      password: string;
    }

    export class checkEmail {
      @IsEmail()
      email: string;
    }
  }