import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid'; // Unique ID 생성용
import { ConfigService } from '@nestjs/config';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { POST } from './entity/post.entity';
import { LIKE } from './entity/like.entity';
import { COMMENT } from './entity/comment.entity';

import { CreatePostDto } from './dto/post.dto';
import { DeletePostDto } from './dto/delete.dto';
import { ModifyPostDto } from './dto/modify.dto';
import { LikeDto } from './dto/like.dto';

import { CreateCommentDto } from './dto/createComment.dto';
import { ModifyCommentDto } from './dto/modifyComment.dto';
import { DeleteCommentDto } from './dto/deleteComment.dto';
import { CommentLikeDto } from './dto/commentLike.dto';

import { CommunityRepo } from './community.repository';
import { COMMENT_LIKE } from './entity/commentLike.entity';
import { root } from 'cheerio/lib/static';

@Injectable()
export class CommunityService {
  private s3Client: S3Client;
  private readonly bucketName = 'baseball-bucket1';

  constructor(
    @InjectRepository(POST)
    private postRepository: Repository<POST>,
    @InjectRepository(LIKE)
    private likeRepository: Repository<LIKE>,
    @InjectRepository(COMMENT)
    private commentRepository: Repository<COMMENT>,
    @InjectRepository(COMMENT_LIKE)
    private commentLikeRepository: Repository<COMMENT_LIKE>,

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

  async modifyPost(modifyPostDto: ModifyPostDto) {
    const post = await this.postRepository.findOne({
      where: { id: modifyPostDto.postId},
    });
    
    Object.assign(post, modifyPostDto)
    
    const result = await this.postRepository.save(post);
    return result;
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

  async getPosts(category: string, userId: number, page: number) {
    const query = this.postRepository
    .createQueryBuilder('post')
    .leftJoinAndSelect('post.user', 'user')
    .leftJoinAndSelect('post.like', 'like')
    .loadRelationCountAndMap(
      'post.commentCount',
      'post.comment',
      'comment',
      (qb) => {
        return qb.where('comment.delYN = :delYN', { delYN: 'N' }); // 예: 삭제되지 않은 댓글만 카운트
      }
    )
    .where('post.delYN = "N"')
    .orderBy('post.id', 'DESC')
    .skip(5 * (page.toString() == 'NaN' ? 0 : page - 1)) // offset 적용
    .take(5)  // limit 적용

    if (category !== undefined) {
      query.andWhere("post.category = :category", { category });
    }
    // console.log("Generated SQL:", query.getSql());
    // console.log("Query with parameters:", query.getQueryAndParameters());
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
  }

  async getOnePost(id: number, userId: number) {
    const post = await this.postRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.like', 'like')
      .leftJoinAndSelect('post.comment', 'comment')
      .leftJoinAndSelect('comment.user', 'commentUser')
      .leftJoinAndSelect('comment.commentLike', 'commentLike')
      .select([
        'post.id', 'post.title', 'post.content', 'post.category', 'post.createdAt', 'post.updatedAt',
        'user.id', 'user.nickname', 'user.email',
        'like.id', 'like.user_id', 'like.post_id', 'like.up_down',
        'comment.id', 'comment.user_id', 'comment.post_id', 'comment.content', 'comment.depth', 
        'comment.parent_id', 'comment.delYN', 'comment.createdAt', 'comment.updatedAt', 
        'commentUser.nickname',
        'commentLike.comment_id', 'commentLike.user_id', 'commentLike.id', 'commentLike.up_down'
      ])      
      .where("post.id = :id", { id })
      .andWhere('post.delYN = "N"')
      .orderBy('comment.depth', 'ASC')
      .getOne()
  
    const comments = post.comment
    const commentMap = new Map();
    const rootComments: any[] = [];

    comments.forEach((comment) => {
      if (comment.delYN === "N") {

        const plus = comment.commentLike.filter(el =>  el.up_down === "up").length
        const minus = comment.commentLike.filter(el =>  el.up_down === "down").length
        const matchIndex = comment.commentLike.findIndex((item) => item.user_id === userId)
        comment['likeCount'] = plus - minus
        comment['isLiked'] = matchIndex === -1 ? 'none' : comment.commentLike[matchIndex].up_down

        comment['children'] = []; // 댓글 객체에 children 속성 추가
        commentMap.set(comment.id, comment); // 댓글 ID를 key로, 댓글 객체를 value로 저장
        if (comment.parent_id) { // 부모 댓글이 있는 경우
          const parent = commentMap.get(comment.parent_id); // 부모 댓글 찾기
          if (parent) {
            parent.children.push(comment); // 부모 댓글의 children 배열에 추가
          }
        } else {
          rootComments.push(comment); // 최상위 댓글이면 rootComments에 추가
        }
      }
    });
    rootComments.sort((a,b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    }) 
    post.comment = rootComments

    const plus = post.like.filter(el =>  el.up_down === "up").length
    const minus = post.like.filter(el =>  el.up_down === "down").length
    const matchIndex = post.like.findIndex((item) => item.user_id === userId)
    post['likeCount'] = plus - minus
    post['isLiked'] = matchIndex === -1 ? 'none' : post.like[matchIndex].up_down

    return post
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

  

  async createComment(createCommentDto: CreateCommentDto) {
    if (createCommentDto.parent_id) {
      const parentComment = await this.commentRepository.findOne({
        where: {
          id: createCommentDto.parent_id
        },
      });
      createCommentDto["depth"] = parentComment.depth + 1
    }
    const commentEntity = this.commentRepository.create(createCommentDto);
    // return await this.commentRepository.save(commentEntity);
    
    const savedComment = await this.commentRepository.save(commentEntity);
    const commentWithUser = await this.commentRepository.findOne({
      where: { id: savedComment.id },
      relations: ['user'], // user 테이블 조인
    });
    delete commentWithUser.user.password
    return commentWithUser;
  }

  async modifyComment(modifyCommentDto: ModifyCommentDto) {
    const post = await this.commentRepository.findOne({
      where: { 
        id: modifyCommentDto.commentId
      },
    });
    
    Object.assign(post, modifyCommentDto)
    
    const result = await this.commentRepository.save(post);
    return result;
  }

  async deleteComment(deleteCommentDto: DeleteCommentDto) {
    const result = await this.commentRepository
      .createQueryBuilder()
      .update(COMMENT)
      .set({ delYN: "Y" })
      .where("id = :commentId", { commentId: deleteCommentDto.commentId })
      .orWhere("parent_id = :commentId", { commentId: deleteCommentDto.commentId })
      .andWhere("delYN = :delYN", { delYN: "N" }) // 삭제되지 않은 댓글만 업데이트
      .execute();

    if (result && result.affected !== 0) {
      return { delete : "Y"}
    } else {
      return { delete : "N"}
    }
  }

  async upDownNoneComment(commentlikeDto: CommentLikeDto) {
    const clearUpDown = await this.communityRepo.deleteCommentLike(commentlikeDto.user_id, commentlikeDto.comment_id)
    if (commentlikeDto.up_down === "none") {
      return clearUpDown
    } else {
      const likeEntity = this.commentLikeRepository.create(commentlikeDto)
      return await this.commentLikeRepository.save(likeEntity)
        
    }
  }

  async sortComment(postId: number, method: string, userId: number) {
    const comments = await this.commentRepository.createQueryBuilder('comment')
    .leftJoinAndSelect('comment.user', 'commentUser')
    .leftJoinAndSelect('comment.commentLike', 'commentLike')
    .select([
      'comment.id', 'comment.user_id', 'comment.post_id', 'comment.content', 'comment.depth', 
      'comment.parent_id', 'comment.delYN', 'comment.createdAt', 'comment.updatedAt', 
      'commentUser.nickname',
      'commentLike.comment_id', 'commentLike.user_id', 'commentLike.id', 'commentLike.up_down'
    ])
    .where("comment.post_id = :id", { id: postId })
    .andWhere('comment.delYN = "N"')
    .orderBy('comment.depth', 'ASC')
    .getMany();
    // console.log(comments)
    const commentMap = new Map();
    const rootComments: COMMENT[] = [];
    comments.forEach((comment) => {

      const plus = comment.commentLike.filter(el =>  el.up_down === "up").length
      const minus = comment.commentLike.filter(el =>  el.up_down === "down").length
      const matchIndex = comment.commentLike.findIndex((item) => item.user_id === userId)
      comment['likeCount'] = plus - minus
      comment['isLiked'] = matchIndex === -1 ? 'none' : comment.commentLike[matchIndex].up_down
      comment['children'] = []; // 댓글 객체에 children 속성 추가
      commentMap.set(comment.id, comment); // 댓글 ID를 key로, 댓글 객체를 value로 저장
      if (comment.parent_id) { // 부모 댓글이 있는 경우
        const parent = commentMap.get(comment.parent_id); // 부모 댓글 찾기
        if (parent) {
          parent.children.push(comment); // 부모 댓글의 children 배열에 추가
        }
      } else {
        rootComments.push(comment); // 최상위 댓글이면 rootComments에 추가
      }
    });

    
    let result = rootComments.sort((a,b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    }) 
    if (method === 'like') {
      result = rootComments.sort((a,b) => {
        return b['likeCount'] - a['likeCount']
      })
    } 
    if (method === 'reply') {
      result = rootComments.sort((a,b) => {
        return b['children'].length - a['children'].length
      })
    }
    return result
  }

} // end of file
