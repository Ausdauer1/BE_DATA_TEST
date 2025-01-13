import { Body, Controller, Get, Post, UploadedFile, UseInterceptors, Query, Delete, Put, Param } from '@nestjs/common';
import { CommunityService } from './community.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/post.dto';
import { DeletePostDto } from './dto/delete.dto';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ModifyPostDto } from './dto/modify.dto';
import { LikeDto } from './dto/like.dto';

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

  @Delete('delete')
  @ApiOperation({ summary: '게시물삭제 API' })
  async deletePost(@Body() deletePostDto: DeletePostDto) {
    return await this.communityService.deletePost(deletePostDto)
  }

  @Put('modify')
  @ApiOperation({ summary: '게시물수정 API' })
  async modifyPost(@Body() modifyPostDto: ModifyPostDto) {
    return await this.communityService.modifyPost(modifyPostDto)
  }

  @Post('create')
  @ApiOperation({ summary: '게시물 생성 API' })
  async createPost(@Body() createPostDto: CreatePostDto) {
    return await this.communityService.createPost( createPostDto)
  }

  @Get()
  @ApiOperation({ summary: '게시물 조회 API (전체)' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'page', required: false })
  async getPosts(
    @Query('category') category: string, 
    @Query('userId') userId: number,
    @Query('page') page: number
  ) {
    return await this.communityService.getPosts(category, userId, page)
  }

  @Get('one')
  @ApiOperation({ summary: '게시물 조회 API (개별)' })
  @ApiQuery({ name: 'userId', required: false })
  async getOnePost(
    @Query('id') id: number,
    @Query('userId') userId: number
  ) {
    return await this.communityService.getOnePost(id, userId)
  }

  @Post('updown')
  @ApiOperation({ summary: '좋아요 UP/DOWN/NONE API' })
  async upDownNone(@Body() likeDto: LikeDto) {
    return await this.communityService.upDownNone(likeDto)
  }

  @Get('test')
  async test() {
    return await this.communityService.getPostsWithLike()
  }
}
