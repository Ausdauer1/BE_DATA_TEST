import { IsEmail,IsString ,Length} from "class-validator";
export namespace AuthDto {
    export class SignUp {
      @IsString()
      @Length(2, 12)
      id: string;

      @IsString()
      @Length(4, 16)
      nickname: string;

      @IsString()
      @Length(4, 20)
      password: string;

      @IsEmail()
      email: string;
  
    }
  
    export class SignIn {
      @Length(4, 16)
      id: string;
  
      @IsString()
      @Length(4, 20)
      password: string;
    }
  }