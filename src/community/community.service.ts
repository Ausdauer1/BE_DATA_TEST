import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid'; // Unique ID 생성용

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { POST } from './entity/post.entity';
import { CreatePostDto } from './dto/post.dto';
import { ConfigService } from '@nestjs/config';
import { UploadFileDto } from './dto/uploadFile.dto';

@Injectable()
export class CommunityService {
  private s3Client: S3Client;
  private readonly bucketName = 'baseball-bucket1'; // S3 버킷 이름

  constructor(
    @InjectRepository(POST)
    private postRepository: Repository<POST>,
    private configService: ConfigService
  ) {
    this.s3Client = new S3Client({
      region: 'ap-northeast-2', // ex) 'us-east-1'
      credentials: {
        accessKeyId: this.configService.get('ACCESSKEYID'),
        secretAccessKey: this.configService.get('ACCESSSECRET'),
      },
    });
  }

  async uploadFile(file: Express.Multer.File) {
    let fileUrl: string | undefined;
    if (file) {
      const fileKey = `${uuidv4()}-${file.originalname}`; // 고유 파일 이름 생성

      const params = {
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      try {
        await this.s3Client.send(new PutObjectCommand(params))
        fileUrl = `https://${this.bucketName}.s3.ap-northeast-2.amazonaws.com/${fileKey}`;

        return { fileUrl };
      } catch (error) {
        console.log(error.message)
        throw new InternalServerErrorException(`S3 업로드 실패`);
      }
    } else {
      throw new BadRequestException("file값이 없습니다");
    }
  }

  async createPost(createPostDto: CreatePostDto) {
    
    const testJSon = {
      title: createPostDto.title,
      content: createPostDto.content,
      category: createPostDto.category,
      user_id: parseInt(createPostDto.user_id)
    }

    const postEntity = this.postRepository.create(testJSon);
    console.log(postEntity);
    const newObject = await this.postRepository.save(postEntity);
    console.log(newObject);

    return newObject
  }

  async getPosts(section: string) {
    return await this.postRepository.find({
      relations: ['user'], // 관계된 user 데이터를 조인
      where: { category: section },
      select: {
        id: true,
        title: true,
        createdAt: true,
        category: true,
        user: {
          id: true,
          nickname: true, // user에서 가져올 필드 선택
        },
      },
      order: {
        createdAt: 'DESC', // createdAt 기준으로 내림차순 정렬
      },
    });
  }
  async getOnePost(id: number) {
    return await this.postRepository.findOne({
      relations: ['user'], // 관계된 user 데이터를 조인
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          nickname: true, // user에서 가져올 필드 선택
        },
      },
      order: {
        createdAt: 'DESC', // createdAt 기준으로 내림차순 정렬
      },
    });
  }
}
