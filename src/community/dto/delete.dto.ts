import { IsNumber, IsString, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DeletePostDto {
  @IsNumber({}, { message: "게시물 id를 입력해주세요"})
  @ApiProperty({ description: '게시물 id' })
  postId: number;
}