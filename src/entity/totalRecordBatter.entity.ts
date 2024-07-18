import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PLAYER_INFO } from "./playerInfo.entity";

@Entity()
export class TOTAL_RECORD_BATTER {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("int")
    Pid: number;
    
    @ManyToOne(() => PLAYER_INFO, pi => pi.trbs)
    @JoinColumn({ name: "Pid", referencedColumnName: "id"})
    pi: PLAYER_INFO; 

    @Column("char", {length: 4, default: "2024"})
    year: string;

    @Column("varchar", {length : 5})
    name: string;

    @Column("char", {length: 5})
    kbo_id_batter: string;

    @Column("char", {length: 5})
    statiz_id_batter: string;

    @Column("decimal", {precision: 5, scale: 3})
    WAR: number;

    @Column("decimal", {precision: 5, scale: 3})
    oWAR: number;

    @Column("decimal", {precision: 5, scale: 3})
    dWAR: number;

    @Column("decimal", {precision: 4, scale: 3})
    AVG: number;
    //출장
    @Column("int", {width: 5})
    G: number;
    //타석
    @Column("int", {width: 5})
    PA: number;
    //유효타석
    @Column("int", {width: 5})
    ePA: number;
    //타수
    @Column("int", {width: 5})
    AB: number;
    //득점
    @Column("int", {width: 5})
    R: number;
    
    @Column("int", {width: 5})
    H: number;
    
    @Column("int", {width: 5})
    "2B": number;

    @Column("int", {width: 5})
    "3B": number;

    @Column("int", {width: 5})
    HR: number;
    //루타
    @Column("int", {width: 5})
    TB: number;
    //타점
    @Column("int", {width: 5})
    RBI: number;
    //도루성공
    @Column("int", {width: 5})
    SB: number;
    //도루실패
    @Column("int", {width: 5})
    CS: number;
    //4구
    @Column("int", {width: 5})
    BB: number;
    //사구
    @Column("int", {width: 5})
    HP: number;
    //고의4구
    @Column("int", {width: 5})
    IB: number;
    //삼진
    @Column("int", {width: 5})
    SO: number;
    //병살타
    @Column("int", {width: 5})
    GDP: number;
    //희생타(희생번트)
    @Column("int", {width: 5})
    SH: number;
    //희생플라이
    @Column("int", {width: 5})
    SF: number;
    //출루율
    @Column("decimal", {precision: 4, scale: 3})
    OBP: number;
    //장타율
    @Column("decimal", {precision: 4, scale: 3})
    SLG: number;
    // 
    @Column("decimal", {precision: 4, scale: 3})
    OPS: number;

    @Column("decimal", {precision: 4, scale: 1})
    WRC: number
}