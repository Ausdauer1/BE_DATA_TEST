import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapModule } from './scrap/scrap.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PLAYER_INFO } from './scrap/entity/playerInfo.entity';
import { YEAR_RECORD_BATTER } from './scrap/entity/yearRecordBatter.entity';
import { YEAR_RECORD_PITCHER } from './scrap/entity/yearRecordPitcher.entity';
import { GetModule } from './get/get.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'bnn-db.cx4g2aqygcx8.ap-northeast-2.rds.amazonaws.com',
      port: 3306,
      username: 'admin',
      password: 'Z7o8mvHsXg6wupgFNHw7',
      database: 'bnn_db',
      entities: [PLAYER_INFO, YEAR_RECORD_BATTER, YEAR_RECORD_PITCHER], 
      synchronize: true 
    }), 
    ScrapModule, GetModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
