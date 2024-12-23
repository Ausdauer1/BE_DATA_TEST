import { IsNumber, IsString, IsNumberString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ModifyPostDto {
  @IsNumber({}, { message: "게시물 id를 입력해주세요"})
  @ApiProperty({ description: '게시물 id' })
  postId: number;

  @IsOptional()
  @IsString({ message: '제목은 문자열로 작성하여주세요' })
  @ApiProperty({ description: '제목' })
  title: string;

  @IsOptional()
  @IsString({ message: '내용은 문자열로 작성하여주세요' })
  @ApiProperty({ description: '내용' })
  content: string;

  @IsOptional()
  @IsString({ message: '카테고리는 문자열로 작성하여주세요' })
  @ApiProperty({ description: '카테고리(팀 이름)' })
  category: string;
}