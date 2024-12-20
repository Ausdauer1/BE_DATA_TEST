import { Body, Controller, Get, Post, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { CommunityService } from './community.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/post.dto';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';

@Controller('community')
@ApiTags('게시판 API')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post('uploadFile')
  @ApiOperation({ summary: '파일업로드 API' })
  @UseInterceptors(FileInterceptor('file'))
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
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.communityService.uploadFile(file)
  }

  @Post('create')
  @ApiOperation({ summary: '게시물 생성 API' })
  async createPost(@Body() createPostDto: CreatePostDto) {
    return await this.communityService.createPost( createPostDto)
  }

  @Get()
  @ApiOperation({ summary: '게시물 조회 API (전체)' })
  @ApiQuery({ name: 'category', required: false })
  async getPosts(@Query('category') category: string) {
    return await this.communityService.getPosts(category)
  }

  @Get('one')
  @ApiOperation({ summary: '게시물 조회 API (개별)' })
  async getOnePost(@Query('id') id: number) {
    return await this.communityService.getOnePost(id)
  }
}
