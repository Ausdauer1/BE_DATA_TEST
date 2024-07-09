import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PLAYER_INFO } from "./playerInfo.entity";

@Entity()
export class YEAR_RECORD_PITCHER {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("char", {length: 5})
    kbo_id_pitcher: string;

    @ManyToOne(() => PLAYER_INFO, pi => pi.yrps)
    @JoinColumn({ name: "kbo_id_pitcher", referencedColumnName: "kbo_id"})
    pi: PLAYER_INFO; 

    @Column("char", {length: 5})
    statiz_id_pitcher: string;

    @Column("char", {length: 4, default: "2024"})
    year: string;

    @Column("varchar", {length : 5})
    name: string;

    @Column("decimal", {precision: 5, scale: 3})
    WAR: number;

}