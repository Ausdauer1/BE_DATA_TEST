import { IsEmail, IsString ,Length, MinDate, MinLength} from "class-validator";
export namespace AuthDto {
    export class SignUp {
      // @IsString()
      // @Length(2, 12)
      // id: string;

      @IsString()
      @MinLength(2, {
        message: "닉네임의 길이가 짧아용ㅠㅠ"
      })
      nickname: string;

      @IsString()
      @Length(8, 20, {
        message: "길이가 8이상 20미만"
      })
      password: string;

      @IsEmail()
      email: string;
  
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
      // @IsEmail()
      email: string;
  
      // @IsString()
      // @Length(8, 20)
      password: string;
    }

    export class signInSocial {
      // @IsEmail()
      email: string;
  
      // @IsString()
      // @Length(8, 20)
      password: string;
    }
  }