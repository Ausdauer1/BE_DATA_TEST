import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { POST } from "src/community/entity/post.entity";
import { LIKE } from "src/community/entity/like.entity";
import { COMMENT } from "src/community/entity/comment.entity";
import { COMMENT_LIKE } from "src/community/entity/commentLike.entity";

@Entity('USER')
export class USER {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 20})
    nickname: string;
    
    @Column("varchar", {nullable: true})
    password: string;

    @Column("varchar", {length: 50})
    email: string;

    @CreateDateColumn()
    created_at: Date; // Creation date

    @UpdateDateColumn()
    updated_at: Date; // Last updated date

    @Column("varchar", {length: 20})
    type: string;

    @OneToMany(() => POST, post => post.user)
    post: POST[];

    @OneToMany(() => LIKE, like => like.user)
    like: LIKE[];

    @OneToMany(() => COMMENT, comment => comment.user)
    comment: COMMENT[];

    @OneToMany(() => COMMENT_LIKE, commentLike => commentLike.user)
    commentLike: COMMENT_LIKE[];
}