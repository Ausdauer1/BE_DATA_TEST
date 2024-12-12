import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { POST } from "src/community/entity/post.entity";

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
}