import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PLAYER_INFO } from 'src/entity/playerInfo.entity';
import { YEAR_RECORD_BATTER } from 'src/entity/yearRecordBatter.entity';
import { YEAR_RECORD_PITCHER } from 'src/entity/yearRecordPitcher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetService {
    constructor(
        @InjectRepository(PLAYER_INFO)
        private playerInfoRepository: Repository<PLAYER_INFO>,
    
        @InjectRepository(YEAR_RECORD_BATTER)
        private yearRecordBatterRepository: Repository<YEAR_RECORD_BATTER>,
    
        @InjectRepository(YEAR_RECORD_PITCHER)
        private yearRecordPitcherRepository: Repository<YEAR_RECORD_PITCHER>
    
      ){}

    async searchPlayer(name: string) {
        const batter = await this.playerInfoRepository.createQueryBuilder('pi')
            .leftJoinAndSelect('pi.yrbs', 'b')
            .leftJoinAndSelect('pi.trbs', 't')
            .select([
                'pi.back_number', 'pi.name', 'pi.team', 'pi.detail_position', 'pi.id',
                'pi.birth_date', 'pi.height', 'pi.weight', 'pi.career', 'pi.position',
                'b.year', 'b.team', 'b.age', 'b.WAR', 'b.oWAR', 'b.dWAR', 'b.AVG', 'b.G',
                'b.PA', 'b.ePA', 'b.AB', 'b.R', 'b.H',
                'b.2B', 'b.3B', 'b.HR', 'b.TB', 'b.RBI',
                'b.SB', 'b.CS', 'b.BB', 'b.HP', 'b.IB',
                'b.SO', 'b.GDP', 'b.SH', 'b.SF', 'b.OBP',
                'b.SLG', 'b.OPS', 'b.WRC', 
                't.year', 't.team', 't.age', 't.WAR', 't.oWAR', 't.dWAR', 't.AVG', 't.G',
                't.PA', 't.ePA', 't.AB', 't.R', 't.H',
                't.2B', 't.3B', 't.HR', 't.TB', 't.RBI',
                't.SB', 't.CS', 't.BB', 't.HP', 't.IB',
                't.SO', 't.GDP', 't.SH', 't.SF', 't.OBP',
                't.SLG', 't.OPS', 't.WRC'
            ])
            .where('b.name LIKE :searchTerm', { searchTerm: `%${name}%` })
            .getMany();

        console.log(batter)
        const pitcher = await this.playerInfoRepository.createQueryBuilder('pi')
            .leftJoinAndSelect('pi.yrps', 'p')
            .leftJoinAndSelect('pi.trps', 't')
            .select([
                'pi.back_number', 'pi.name', 'pi.team', 'pi.detail_position', 'pi.id',
                'pi.birth_date', 'pi.height', 'pi.weight', 'pi.career', 'pi.position',
                'p.year', 'p.team', 'p.age', 'p.WAR', 'p.ERA', 'p.WHIP', 'p.G', 'p.GS',
                'p.GR', 'p.GF', 'p.CG', 'p.SHO', 'p.W',
                'p.L', 'p.S', 'p.HD', 'p.IP', 'p.ER',
                'p.R', 'p.rRA', 'p.TBF', 'p.H', 'p.2B',
                'p.3B', 'p.HR', 'p.BB', 'p.HP', 'p.IB',
                'p.SO', 'p.ROE', 'p.BK', 'p.WP', 'p.RA9',  
                'p.rRA9', 'p.rRA9pf', 'p.FIP',
                't.year', 't.team', 't.age', 't.WAR', 't.ERA', 't.WHIP', 't.G', 't.GS',
                't.GR', 't.GF', 't.CG', 't.SHO', 't.W',
                't.L', 't.S', 't.HD', 't.IP', 't.ER',
                't.R', 't.rRA', 't.TBF', 't.H', 't.2B',
                't.3B', 't.HR', 't.BB', 't.HP', 't.IB',
                't.SO', 't.ROE', 't.BK', 't.WP', 't.RA9',  
                't.rRA9', 't.rRA9pf', 't.FIP'
            ])
            .where('p.name LIKE :searchTerm', { searchTerm: `%${name}%` })
            .getMany();
        
        const batterArr = batter.map(el => {
            const thisYear = []
            el.yrbs.map((e)=>{
                if (e.age === "") e.age = String(2024 - Number(el.birth_date.slice(0,4)))
                if (e.team === "") e.team = el.team
                if (e.year === "2024") thisYear.push(e)
            })
            return {
                ...el,
                group: el.position,
                position: el.detail_position,
                season: thisYear,
                records: [el.yrbs[el.yrbs.length - 1], ...thisYear, ...el.trbs.reverse()],
                trbs: undefined,
                yrbs: undefined,
                detail_position: undefined
            }
        })
        const pitcherArr = pitcher.map(el => {
            const thisYear = []
            el.yrps.map((e)=>{
                if (e.age === "") e.age = String(2024 - Number(el.birth_date.slice(0,4)))
                if (e.team === "") e.team = el.team
                if (e.year === "2024") thisYear.push(e)
            })
            return {
                ...el,
                group: el.position,
                position: el.detail_position,
                season: thisYear,
                records: [el.yrps[el.yrps.length - 1], ...thisYear, ...el.trps.reverse()],
                trps: undefined,
                yrps: undefined,
                detail_position: undefined
            }
        })
        if (batterArr.length < 1) {
            return pitcherArr
        } else if (pitcherArr.length < 1) {
            return batterArr
        } else {
            return [...batterArr,pitcherArr]
        }
    }
    
    

    async searchPlayerById(id: number) {
        console.log(id)
        const batter = await this.playerInfoRepository.createQueryBuilder('pi')
            .leftJoinAndSelect('pi.yrbs', 'b')
            .leftJoinAndSelect('pi.trbs', 't')
            .select([
                'pi.back_number', 'pi.name', 'pi.team', 'pi.detail_position', 'pi.id',
                'pi.birth_date', 'pi.height', 'pi.weight', 'pi.career', 'pi.position',
                'b.year', 'b.team', 'b.age', 'b.WAR', 'b.oWAR', 'b.dWAR', 'b.AVG', 'b.G',
                'b.PA', 'b.ePA', 'b.AB', 'b.R', 'b.H',
                'b.2B', 'b.3B', 'b.HR', 'b.TB', 'b.RBI',
                'b.SB', 'b.CS', 'b.BB', 'b.HP', 'b.IB',
                'b.SO', 'b.GDP', 'b.SH', 'b.SF', 'b.OBP',
                'b.SLG', 'b.OPS', 'b.WRC', 
                't.year', 't.team', 't.age', 't.WAR', 't.oWAR', 't.dWAR', 't.AVG', 't.G',
                't.PA', 't.ePA', 't.AB', 't.R', 't.H',
                't.2B', 't.3B', 't.HR', 't.TB', 't.RBI',
                't.SB', 't.CS', 't.BB', 't.HP', 't.IB',
                't.SO', 't.GDP', 't.SH', 't.SF', 't.OBP',
                't.SLG', 't.OPS', 't.WRC'
            ])
            .where('pi.id = :id', { id: id })
            .getOne();

        
        const pitcher = await this.playerInfoRepository.createQueryBuilder('pi')
            .leftJoinAndSelect('pi.yrps', 'p')
            .leftJoinAndSelect('pi.trps', 't')
            .select([
                'pi.back_number', 'pi.name', 'pi.team', 'pi.detail_position', 'pi.id',
                'pi.birth_date', 'pi.height', 'pi.weight', 'pi.career', 'pi.position',
                'p.year', 'p.team', 'p.age', 'p.WAR', 'p.ERA', 'p.WHIP', 'p.G', 'p.GS',
                'p.GR', 'p.GF', 'p.CG', 'p.SHO', 'p.W',
                'p.L', 'p.S', 'p.HD', 'p.IP', 'p.ER',
                'p.R', 'p.rRA', 'p.TBF', 'p.H', 'p.2B',
                'p.3B', 'p.HR', 'p.BB', 'p.HP', 'p.IB',
                'p.SO', 'p.ROE', 'p.BK', 'p.WP', 'p.RA9',  
                'p.rRA9', 'p.rRA9pf', 'p.FIP',
                't.year', 't.team', 't.age', 't.WAR', 't.ERA', 't.WHIP', 't.G', 't.GS',
                't.GR', 't.GF', 't.CG', 't.SHO', 't.W',
                't.L', 't.S', 't.HD', 't.IP', 't.ER',
                't.R', 't.rRA', 't.TBF', 't.H', 't.2B',
                't.3B', 't.HR', 't.BB', 't.HP', 't.IB',
                't.SO', 't.ROE', 't.BK', 't.WP', 't.RA9',  
                't.rRA9', 't.rRA9pf', 't.FIP'
            ])
            .where('pi.id = :id', {id : id})
            .getOne();

        if (pitcher.yrps.length < 1) {
            const thisYear = []
            batter.yrbs.map(el => {
                if (el.age === "") el.age = String(2024 - Number(batter.birth_date.slice(0,4)))
                if (el.team === "") el.team = batter.team
                if (el.year === "2024") thisYear.push(el)
            })
            batter['group'] = batter.position
            batter['season'] = thisYear
            batter['records'] = [batter.yrbs[batter.yrbs.length - 1], ...thisYear, ...batter.trbs.reverse()],
            batter['position'] = batter.detail_position
            batter.detail_position = undefined
            batter.yrbs = undefined
            batter.trbs = undefined
            console.log(batter)
            return batter
        } else {
            const thisYear = []
            pitcher.yrps.map(el => {
                if (el.age === "") el.age = String(2024 - Number(batter.birth_date.slice(0,4)))
                if (el.team === "") el.team = pitcher.team
                if (el.year === "2024") thisYear.push(el)
            })
            pitcher['group'] = pitcher.position
            pitcher['season'] = thisYear
            pitcher['records'] = [pitcher.yrps[pitcher.yrps.length - 1], ...thisYear, ...pitcher.trps.reverse()]
            pitcher['position'] = pitcher.detail_position
            pitcher.detail_position = undefined
            pitcher.yrps = undefined
            pitcher.trps = undefined
            return pitcher
        }
        // const batterArr = batter.map(el => {
        //     return {
        //         ...el,
        //         position: el.detail_position,
        //         records: el.yrbs,
        //         yrbs: undefined,
        //         detail_position: undefined
        //     }
        // })
        // const pitcherArr = pitcher.map(el => {
        //     return {
        //         ...el,
        //         position: el.detail_position,
        //         records: el.yrps,
        //         yrps: undefined,
        //         detail_position: undefined
        //     }
        // })
        // if (batterArr.length < 1) {
        //     return pitcherArr
        // } else if (pitcherArr.length < 1) {
        //     return batterArr
        // } else {
        //     return [...batterArr,pitcherArr]
        // }
    }
    
    async getBatterRank() {
        const batter = await this.playerInfoRepository.createQueryBuilder('pi')
        .leftJoinAndSelect('pi.yrbs', 'b')
        .select([
            'pi.id AS id', 'pi.back_number AS back_number', 'pi.name AS name', 'pi.team AS team', 'pi.detail_position AS detail_position',
            'b.year AS year', 'b.WAR AS WAR', 'b.oWAR AS oWAR', 'b.dWAR AS dWAR', 'b.AVG AS AVG', 'b.G AS G',
            'b.PA AS PA', 'b.ePA AS ePA', 'b.AB AS AB', 'b.R AS R', 'b.H AS H',
            'b.2B AS 2B', 'b.3B AS 3B', 'b.HR AS HR', 'b.TB AS TB', 'b.RBI AS RBI',
            'b.SB AS SB', 'b.CS AS CS', 'b.BB AS BB', 'b.HP AS HP', 'b.IB AS IB',
            'b.SO AS SO', 'b.GDP AS GDP', 'b.SH AS SH', 'b.SF AS SF', 'b.OBP AS OBP',
            'b.SLG AS SLG', 'b.OPS AS OPS', 'b.WRC AS WRC'
        ])
        .where("b.year = '2024'")
        .orderBy('b.WAR', 'DESC')
        .limit(30)
        .getRawMany();
        
        return batter
    }

    async getPictcherRank() {
        const pitcher = await this.playerInfoRepository.createQueryBuilder('pi')
        .leftJoinAndSelect('pi.yrps', 'p')
        .select([
            'pi.id AS id', 'pi.back_number AS back_number', 'pi.name AS name', 'pi.team AS team', 'pi.detail_position AS detail_position',
            'p.WAR AS WAR', 'p.ERA AS ERA', 'p.WHIP AS WHIP', 'p.G AS G', 'p.GS AS GS',
            'p.GR AS GR', 'p.GF AS GF', 'p.CG AS CG', 'p.SHO AS SHO', 'p.W AS W',
            'p.L AS L', 'p.S AS S', 'p.HD AS HD', 'p.IP AS IP', 'p.ER AS ER',
            'p.R AS R', 'p.rRA AS rRA', 'p.TBF AS TBF', 'p.H AS p_H', 'p.2B AS p_2B',
            'p.3B AS p_3B', 'p.HR AS p_HR', 'p.BB AS p_BB', 'p.HP AS p_HP', 'p.IB AS p_IB',
            'p.SO AS p_SO', 'p.ROE AS ROE', 'p.BK AS BK', 'p.WP AS WP', 'p.RA9 AS RA9',
            'p.rRA9 AS rRA9', 'p.rRA9pf AS rRA9pf', 'p.FIP AS FIP'
        ])
        .where("p.year = '2024'")
        .orderBy('p.WAR', 'DESC')
        .limit(30)
        .getRawMany();

        return pitcher
    }
    
}
