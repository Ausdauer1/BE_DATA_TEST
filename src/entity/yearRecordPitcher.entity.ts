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

    @Column("char", {length: 5, default: "2024"})
    year: string;

    @Column("varchar", {length : 5})
    name: string;

    @Column("decimal", {precision: 6, scale: 3})
    WAR: number;

    @Column("decimal", {precision: 5, scale: 2})
    ERA: number;

    @Column("decimal", {precision: 5, scale: 2})
    WHIP: number;

    @Column("int")
    G: number;
    //선발    
    @Column("int")
    GS: number;
    //구원
    @Column("int")
    GR: number;
    //경기마지막투수
    @Column("int")
    GF: number;
    //완투
    @Column("int")
    CG: number;
    //완봉
    @Column("int")
    SHO: number;

    @Column("int")
    W: number;

    @Column("int")
    L: number;
    //세이브
    @Column("int")
    S: number;
    //홀드
    @Column("int")
    HD: number;
    //이닝
    @Column("decimal", {precision: 5, scale: 2})
    IP: number;
    //자책점
    @Column("int")
    ER: number;
    //실점
    @Column("int")
    R: number;
    //책임실점
    @Column("decimal", {precision: 6, scale: 2})
    rRA: number;
    //상대한 타자수
    @Column("int")
    TBF: number;

    @Column("int")
    H: number;

    @Column("int")
    "2B": number;

    @Column("int")
    "3B": number;

    @Column("int")
    HR: number;
    //4구
    @Column("int")
    BB: number;
    //사구
    @Column("int")
    HP: number;
    //고의4구
    @Column("int")
    IB: number;
    //삼진
    @Column("int")
    SO: number;
    //실책 출루 허용 횟수
    @Column("int")
    ROE: number;
    //보크
    @Column("int")
    BK: number;
    //폭투
    @Column("int")
    WP: number;
    //9이닝당 실점
    @Column("decimal", {precision: 5, scale: 2})
    RA9: number;
    //9이닝당 책임실점
    @Column("decimal", {precision: 5, scale: 2})
    rRA9: number;
    // 파크팩터를 적용한 9이닝당 실점
    @Column("decimal", {precision: 5, scale: 2})
    rRA9pf: number;
    //수비무관 평균자책점
    @Column("decimal", {precision: 5, scale: 2})
    FIP: number;

}