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

@Entity('post') // 테이블 이름
export class POST {
  @PrimaryGeneratedColumn()
  id: number; // 기본 키

  @Column("int")
  user_id: number;

  @ManyToOne(() => USER, (user) => user.post ) // 유저와 조인
  @JoinColumn({ name: "user_id", referencedColumnName: "id"}) // 조인 컬럼 이름 지정
  user: USER;

  @Column({ type: 'varchar', length: 255 })
  title: string; // 제목

  @Column({ type: 'text' })
  content: string; // 내용

  @Column({ type: 'varchar', length: 100 })
  category: string; // 카테고리

  @Column({ type: 'varchar', length: 500, nullable: true })
  file_path: string; // 파일 저장 경로

  @CreateDateColumn()
  createdAt: Date; // 생성 시간

  @UpdateDateColumn()
  updatedAt: Date; // 수정 시간
}
