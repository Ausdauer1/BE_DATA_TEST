import { ApiProperty } from '@nestjs/swagger';

export class UploadFileDto {
  @ApiProperty({ 
    description: '업로드 파일',
    type: 'string',
    format: 'binary',
  })
  file: any
}