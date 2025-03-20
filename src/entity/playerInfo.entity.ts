import { Column, Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { YEAR_RECORD_BATTER } from "./yearRecordBatter.entity";
import { YEAR_RECORD_PITCHER } from "./yearRecordPitcher.entity";
import { TOTAL_RECORD_BATTER } from "./totalRecordBatter.entity";
import { TOTAL_RECORD_PITCHER } from "./totalRecordPitcher.entity";

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

    @Column("char", {length: 5, nullable: true, unique: true})
    kbo_id: string;

    @Column("char", {length: 5, nullable: true})
    statiz_id: string;

    @Column("varchar", {nullable: true})
    image_url: string;

    @Column("varchar", {nullable: true})
    income: string;

    @Column("char", {length : 10, default: "n"})
    del_yn: string;

    @CreateDateColumn()
    created_at: Date; // Creation date

    @UpdateDateColumn()
    updated_at: Date; // Last updated date

    @OneToMany(() => YEAR_RECORD_BATTER, yrb => yrb.pi)
    yrbs: YEAR_RECORD_BATTER[];

    @OneToMany(() => YEAR_RECORD_PITCHER, yrp => yrp.pi)
    yrps: YEAR_RECORD_PITCHER[];

    @OneToMany(() => TOTAL_RECORD_BATTER, trb => trb.pi)
    trbs: TOTAL_RECORD_BATTER[];

    @OneToMany(() => TOTAL_RECORD_PITCHER, trp => trp.pi)
    trps: TOTAL_RECORD_PITCHER[];


    

}