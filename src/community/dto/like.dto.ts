import { IsNumber, IsString, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LikeDto {
  @IsNumber({}, { message: "게시물 id를 입력해주세요"})
  @ApiProperty({ description: '게시물 id' })
  post_id: number;

  @IsNumber({}, { message: "유저 id를 입력해주세요"})
  @ApiProperty({ description: '유저 id' })
  user_id: number;

  @IsString({ message: "업다운 입력해주세요"})
  @ApiProperty({ description: '업-up, 다운-down' })
  up_down: string
}