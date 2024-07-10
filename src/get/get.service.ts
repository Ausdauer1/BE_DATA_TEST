import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PLAYER_INFO } from 'src/scrap/entity/playerInfo.entity';
import { YEAR_RECORD_BATTER } from 'src/scrap/entity/yearRecordBatter.entity';
import { YEAR_RECORD_PITCHER } from 'src/scrap/entity/yearRecordPitcher.entity';
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
            .select([
                'pi.back_number', 'pi.name', 'pi.team', 'pi.detail_position', 
                'pi.birth_date', 'pi.height', 'pi.weight', 'pi.career',
                'b.year', 'b.WAR', 'b.oWAR', 'b.dWAR', 'b.AVG', 'b.G',
                'b.PA', 'b.ePA', 'b.AB', 'b.R', 'b.H',
                'b.2B', 'b.3B', 'b.HR', 'b.TB', 'b.RBI',
                'b.SB', 'b.CS', 'b.BB', 'b.HP', 'b.IB',
                'b.SO', 'b.GDP', 'b.SH', 'b.SF', 'b.OBP',
                'b.SLG', 'b.OPS', 'b.WRC'
            ])
            .where('b.name LIKE :searchTerm', { searchTerm: `%${name}%` })
            .getMany();

        console.log(batter)
        const pitcher = await this.playerInfoRepository.createQueryBuilder('pi')
            .leftJoinAndSelect('pi.yrps', 'p')
            .select([
                'pi.back_number', 'pi.name', 'pi.team', 'pi.detail_position', 
                'pi.birth_date', 'pi.height', 'pi.weight', 'pi.career',
                'p.WAR', 'p.ERA', 'p.WHIP', 'p.G', 'p.GS',
                'p.GR', 'p.GF', 'p.CG', 'p.SHO', 'p.W',
                'p.L', 'p.S', 'p.HD', 'p.IP', 'p.ER',
                'p.R', 'p.rRA', 'p.TBF', 'p.H', 'p.2B',
                'p.3B', 'p.HR', 'p.BB', 'p.HP', 'p.IB',
                'p.SO', 'p.ROE', 'p.BK', 'p.WP', 'p.RA9',
                'p.rRA9', 'p.rRA9pf', 'p.FIP'
            ])
            .where('p.name LIKE :searchTerm', { searchTerm: `%${name}%` })
            .getMany();
        
        const batterArr = batter.map(el => {
            return {
                ...el,
                position: el.detail_position,
                records: el.yrbs,
                yrbs: undefined,
                detail_position: undefined
            }
        })
        const pitcherArr = pitcher.map(el => {
            return {
                ...el,
                position: el.detail_position,
                records: el.yrps,
                yrps: undefined,
                detail_position: undefined
            }
        })
        return [...batterArr,pitcherArr]
    }   
    
}
