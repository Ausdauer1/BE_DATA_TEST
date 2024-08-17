import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('USER')
export class USER {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string;
    
    @Column()
    password: string;

    @Column()
    email: string;

    @CreateDateColumn()
    created_at: Date; // Creation date

    @UpdateDateColumn()
    updated_at: Date; // Last updated date

}