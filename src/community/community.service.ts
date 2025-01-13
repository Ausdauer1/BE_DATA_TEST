import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid'; // Unique ID 생성용
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { POST } from './entity/post.entity';
import { LIKE } from './entity/like.entity';

import { CreatePostDto } from './dto/post.dto';
import { ConfigService } from '@nestjs/config';
import { DeletePostDto } from './dto/delete.dto';
import { ModifyPostDto } from './dto/modify.dto';
import { LikeDto } from './dto/like.dto';

import { CommunityRepo } from './community.repository';

@Injectable()
export class CommunityService {
  private s3Client: S3Client;
  private readonly bucketName = 'baseball-bucket1';

  constructor(
    @InjectRepository(POST)
    private postRepository: Repository<POST>,
    @InjectRepository(LIKE)
    private likeRepository: Repository<LIKE>,
    private configService: ConfigService,
    private communityRepo: CommunityRepo
  ) {
    this.s3Client = new S3Client({
      region: 'ap-northeast-2', 
      credentials: {
        accessKeyId: this.configService.get('ACCESSKEYID'),
        secretAccessKey: this.configService.get('ACCESSSECRET'),
      },
    });
  }

  async uploadFile(file: Express.Multer.File) {
    let fileUrl: string | undefined;
    if (file) {
      const fileKey = `${uuidv4()}-${file.originalname}`; 
      const params = {
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      try {
        await this.s3Client.send(new PutObjectCommand(params));
        fileUrl = `https://${this.bucketName}.s3.ap-northeast-2.amazonaws.com/${fileKey}`;
        return {fileUrl};
      } catch (error) {
        console.log(error.message);
        throw new InternalServerErrorException(`S3 업로드 실패`);
      }

    } else {
      throw new BadRequestException("file값이 없습니다");
    }
  }

  async createPost(createPostDto: CreatePostDto) {
    const postEntity = this.postRepository.create(createPostDto);
    return await this.postRepository.save(postEntity);
  }

  async deletePost(deletePostDto: DeletePostDto) {
    const result = await this.postRepository.update(
      { id : deletePostDto.postId },
      { delYN : "Y" }
    )
    if (result && result.affected == 1) {
      return { delete : "Y"}
    } else {
      return { delete : "N"}
    }
  }

  async modifyPost(modifyPostDto: ModifyPostDto) {
    const post = await this.postRepository.findOne({
      where: { id: modifyPostDto.postId},
    });
    
    Object.assign(post, modifyPostDto)
    
    const result = await this.postRepository.save(post);
    return result;
  }

  async getPosts(category: string, userId: number, page: number) {
    const query = this.postRepository
    .createQueryBuilder('post')
    .leftJoinAndSelect('post.user', 'user')
    .leftJoinAndSelect('post.like', 'like')
    // .loadRelationCountAndMap('post.likeCount', 'post.like')
    .where('post.delYN = "N"')
    .orderBy('post.id', 'DESC')
    .skip(10 * (page.toString() == 'NaN' ? 0 : page - 1)) // offset 적용
    .take(10)  // limit 적용

    if (category !== undefined) {
      query.andWhere("post.category = :category", { category });
    }
    const posts = await query.getMany();
    const postsWithLikeStatus = await Promise.all(
      posts.map(async (post) => {
        const matchIndex = post.like.findIndex((item) => item.user_id === userId)
        let plus = post.like.filter(el =>  el.up_down === "up").length
        let minus = post.like.filter(el =>  el.up_down === "down").length
        delete post.user.password
        const upDown = (matchIndex === -1) ? 'none' : post.like[matchIndex].up_down
        return {
          ...post,
          isLiked: upDown, // 좋아요 여부 (true/false)
          likeCount: plus - minus
        };
      }),
    );

    return postsWithLikeStatus;
    // return await this.postRepository.find({
    //   relations: ['user'], // 관계된 user 데이터를 조인
    //   where: { category, delYN: 'N' },
    //   select: {
    //     id: true,
    //     title: true,
    //     content: true,
    //     createdAt: true,
    //     category: true,
    //     user: {
    //       id: true,
    //       nickname: true, // user에서 가져올 필드 선택
    //     },
    //   },
    //   order: {
    //     createdAt: 'DESC', // createdAt 기준으로 내림차순 정렬
    //   },
    // });
  }

  async getOnePost(id: number) {
    return await this.postRepository.findOne({
      relations: ['user'], // 관계된 user 데이터를 조인
      where: { id, delYN: 'N'  },
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
  
  async upDownNone(likeDto: LikeDto) {
    const clearUpDown = await this.communityRepo.deleteLike(likeDto.user_id, likeDto.post_id)
    if (likeDto.up_down === "none") {
      return clearUpDown
    } else {
      const likeEntity = this.likeRepository.create(likeDto)
      return await this.likeRepository.save(likeEntity)
    }
  }

  async getPostsWithLike() {
    const posts = await this.postRepository
    .createQueryBuilder('post')
    .leftJoinAndSelect('post.like', 'like') // `likes`는 Post 엔티티에서의 관계명
    .loadRelationCountAndMap('post.likeCount', 'post.like') // like 수를 매핑
    .getMany();
    return posts;
  }
}
