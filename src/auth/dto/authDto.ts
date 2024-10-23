import { IsEmail, IsString ,Length} from "class-validator";
export namespace AuthDto {
    export class SignUp {
      // @IsString()
      // @Length(2, 12)
      // id: string;

      @IsString()
      @Length(4, 16)
      nickname: string;

      @IsString()
      @Length(8, 20)
      password: string;

      @IsEmail()
      email: string;
  
    }
  
    export class SignIn {
      @IsEmail()
      email: string;
  
      @IsString()
      @Length(4, 20)
      password: string;
    }
  }