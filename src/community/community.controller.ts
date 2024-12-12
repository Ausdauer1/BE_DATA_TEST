import { Body, Controller, Get, Post, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { CommunityService } from './community.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/post.dto';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';

@Controller('community')
@ApiTags('게시판 API')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post('create')
  @ApiOperation({ summary: '게시물 생성 API', description: '파일이 없을 시, file값 없이 api전송' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async createPost(@UploadedFile() file: Express.Multer.File, @Body() createPostDto: CreatePostDto) {
    return await this.communityService.createPost(file, createPostDto)
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
