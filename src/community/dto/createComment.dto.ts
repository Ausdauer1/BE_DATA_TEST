import { IsNumber, IsString, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @IsNumber({}, { message: "user_id를 입력해주세요"})
  @ApiProperty({ description: '유저 id' })
  user_id: number;

  @IsNumber({}, { message: "post_id를 입력해주세요"})
  @ApiProperty({ description: '포스트 id' })
  post_id: number;

  @IsString({ message: '내용은 문자열로 작성하여주세요' })
  @ApiProperty({ description: '내용' })
  content: string;
}