import { Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PLAYER_INFO {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", {length: 3, nullable: true})
    back_number: string;

    @Column("varchar", {length : 5})
    name: string;

    @Column("varchar", {length : 5})
    team: string;

    @Column("char", {length: 1})
    position: string;

    @Column("varchar", {length: 10, nullable: true})
    detail_position: string;

    @Column("char", {length : 10})
    birth_date: string;

    @Column("varchar", {length: 10})
    height: string;

    @Column("varchar", {length: 10})
    weight: string;

    @Column("varchar", {length : 50})
    career: string;

    @Column("int", {width: 10, nullable: true})
    kbo_id: number;

    @Column("int", {width: 10, nullable: true})
    statiz_id: number;

    @Column("char", {length : 10, default: "n"})
    del_yn: string;

    @CreateDateColumn()
    created_at: Date; // Creation date

    @UpdateDateColumn()
    updated_at: Date; // Last updated date

}