import { IsNumber, IsString, IsNumberString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CommentLikeDto {
  @IsNumber({}, { message: "코멘트 id를 입력해주세요"})
  @ApiProperty({ description: '코멘트 id' })
  comment_id: number;

  @IsNumber({}, { message: "유저 id를 입력해주세요"})
  @ApiProperty({ description: '유저 id' })
  user_id: number;

  @IsString({ message: "업/다운/논 입력해주세요"})
  @ApiProperty({ description: '업-up, 다운-down, 논-none' })
  up_down: string;
}