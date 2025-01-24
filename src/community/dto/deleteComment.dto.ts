import { IsNumber, IsString, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteCommentDto {
  @IsNumber({}, { message: "댓글 id를 입력해주세요"})
  @ApiProperty({ description: '댓글 id' })
  commentId: number;
}