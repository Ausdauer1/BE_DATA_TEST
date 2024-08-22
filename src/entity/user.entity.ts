import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('USER')
export class USER {
    @PrimaryGeneratedColumn()
    pid: number;

    @Column("varchar")
    id: string;

    @Column("varchar")
    nickname: string;
    
    @Column("varchar")
    password: string;

    @Column("varchar", {length: 50})
    email: string;

    @CreateDateColumn()
    created_at: Date; // Creation date

    @UpdateDateColumn()
    updated_at: Date; // Last updated date

}