import { Body, Controller, Get, Post, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { CommunityService } from './community.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/post.dto';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody} from '@nestjs/swagger';
import { UploadFileDto } from './dto/uploadFile.dto';

@Controller('community')
@ApiTags('게시판 API')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post('create')
  @ApiOperation({ summary: '게시물 생성 API', description: "게시물 생성 api입니다" })
  async createPost(
    @Body() createPostDto: CreatePostDto
  ) {
    return await this.communityService.createPost( createPostDto)
  }

  @Post('uploadFile')
  @ApiOperation({ summary: '파일업로드 API' })
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB로 제한 설정
    },
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드할 파일',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File
  ) {
    return await this.communityService.uploadFile(file)
  }


  @Get()
  async getPosts(@Query('section') section: string) {
    return await this.communityService.getPosts(section)
  }

  @Get('one')
  async getOnePost(@Query('id') id: number) {
    return await this.communityService.getOnePost(id)
  }
}
