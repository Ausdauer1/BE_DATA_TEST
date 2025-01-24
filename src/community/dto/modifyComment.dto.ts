import { IsNumber, IsString, IsNumberString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ModifyCommentDto {
  @IsNumber({}, { message: "댓글 id를 입력해주세요"})
  @ApiProperty({ description: '댓글 id' })
  commentId: number;

  @IsOptional()
  @IsString({ message: '내용은 문자열로 작성하여주세요' })
  @ApiProperty({ description: '내용' })
  content: string;
}