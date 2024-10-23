import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapModule } from './scrap/scrap.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PLAYER_INFO } from './entity/playerInfo.entity';
import { YEAR_RECORD_BATTER } from './entity/yearRecordBatter.entity';
import { YEAR_RECORD_PITCHER } from './entity/yearRecordPitcher.entity';
import { TOTAL_RECORD_BATTER } from './entity/totalRecordBatter.entity';
import { TOTAL_RECORD_PITCHER } from './entity/totalRecordPitcher.entity';
import { USER } from './entity/user.entity';
import { GetModule } from './get/get.module';
import { AuthModule } from './auth/auth.module';
import * as session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'bnn-db.cx4g2aqygcx8.ap-northeast-2.rds.amazonaws.com',
      port: 3306,
      username: 'admin',
      password: 'Z7o8mvHsXg6wupgFNHw7',
      database: 'bnn_db',
      entities: [__dirname + '/entity/*.entity{.ts}', PLAYER_INFO, YEAR_RECORD_BATTER, YEAR_RECORD_PITCHER, TOTAL_RECORD_BATTER, TOTAL_RECORD_PITCHER, USER], 
      synchronize: true 
    }), 
    ScrapModule, GetModule, AuthModule, // 인증 모듈 (추가)
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}

// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     const redisClient = createClient({ url: 'redis://localhost:6379' }); // Redis 클라이언트 생성
//     redisClient.connect().catch(console.error);

//     consumer
//       .apply(
//         session({
//           store: new RedisStore({
//             client: redisClient
//           }), // Redis 저장소 설정
//           secret: 'your-secret-key', // 세션 암호화 키
//           resave: false,
//           saveUninitialized: false,
//           cookie: {
//             secure: false, // HTTPS 사용 시 true로 설정
//             maxAge: 1000 * 60 * 60 * 12, // 1일
//           },
//         }),
//       )
//       .forRoutes('*'); // 모든 경로에 세션 적용
//   }
// }
