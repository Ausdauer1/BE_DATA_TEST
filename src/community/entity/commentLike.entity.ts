import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { USER } from 'src/auth/entity/user.entity'; // 유저 엔티티 경로에 맞게 수정하세요.
import { POST } from './post.entity';
import { COMMENT } from './comment.entity';

@Entity('comment_like') // 테이블 이름
export class COMMENT_LIKE {
  @PrimaryGeneratedColumn()
  id: number; // 기본 키

  @Column("int")
  user_id: number;

  @Column("int")
  comment_id: number;

  @Column('varchar') // 
  up_down: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => USER, (user) => user.commentLike) // 유저와 조인
  @JoinColumn({ name: "user_id", referencedColumnName: "id"}) // 조인 컬럼 이름 지정
  user: USER;

  @ManyToOne(() => COMMENT, (comment) => comment.commentLike)
  @JoinColumn({ name: "comment_id", referencedColumnName: "id"}) // 조인 컬럼 이름 지정
  comment: COMMENT;
}
