import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { USER } from 'src/auth/entity/user.entity'; // 유저 엔티티 경로에 맞게 수정하세요.
import { POST } from './post.entity';
import { COMMENT_LIKE } from './commentLike.entity';

@Entity('comment') // 테이블 이름
export class COMMENT {
  @PrimaryGeneratedColumn()
  id: number; // 기본 키

  @Column("int")
  user_id: number;

  @ManyToOne(() => USER, (user) => user.comment ) // 유저와 조인
  @JoinColumn({ name: "user_id", referencedColumnName: "id"}) // 조인 컬럼 이름 지정
  user: USER;

  @Column("int")
  post_id: number;

  @ManyToOne(() => POST, (post) => post.comment) // 게시물 조인
  @JoinColumn({ name: "post_id", referencedColumnName: "id"}) // 조인 컬럼 이름 지정
  post: POST;

  @Column("int")
  parent_id: number;

  @Column({ type: 'text' })
  content: string; // 내용

  @Column({ type: 'char', default: "N"})
  delYN: string // 삭제여부

  @CreateDateColumn()
  createdAt: Date; // 생성 시간

  @UpdateDateColumn()
  updatedAt: Date; // 수정 시간

  @OneToMany(() => COMMENT_LIKE, commentLike => commentLike.comment)
  commentLike: COMMENT_LIKE[]
}
