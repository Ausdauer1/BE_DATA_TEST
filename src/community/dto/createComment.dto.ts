import { IsNumber, IsString, IsNumberString, IsOptional } from 'class-validator';
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

  @IsNumber({}, { message: '부모 댓글이 있다면 id를 입력'})
  @IsOptional()
  @ApiProperty({ description: '부모 댓글 id'})
  parent_id: number;
}