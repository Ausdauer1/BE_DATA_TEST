import { IsNumber, IsString, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @IsNumberString({}, { message: "user_id를 입력해주세요"})
  @ApiProperty({ description: '유저 id' })
  // @Transform(({ value }) => parseInt(value, 10)) 
  user_id: string;

  @IsString({ message: '제목은 문자열로 작성하여주세요' })
  @ApiProperty({ description: '제목' })
  title: string;

  @IsString({ message: '내용은 문자열로 작성하여주세요' })
  @ApiProperty({ description: '내용' })
  content: string;

  @IsString({ message: '카테고리는 문자열로 작성하여주세요' })
  @ApiProperty({ description: '카테고리(팀 이름)' })
  category: string;

  @ApiProperty({ 
    description: '업로드 파일',
    type: 'string',
    format: 'binary',
  })
  file: any
}