import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import connectRedis from 'connect-redis';
import { Redis } from 'ioredis';

export function setUpSession(app: INestApplication): void {
  const configService = app.get<ConfigService>(ConfigService);

  const port = configService.get('REDIS_PORT');
  const host = configService.get('REDIS_HOST');
  


  // Initialize store.
  const RedisStore = new connectRedis(session)

  const client = new Redis({
    port: 6379, // Redis port
    host: "127.0.0.1", // Redis host
    // username: "jaehyunwoo", // needs Redis >= 6
    // password: "my-top-secret",
    // db: 0, // Defaults to 0
  });

  app.use(
    session({
      secret: configService.get("SESSION_SECRET"),
      saveUninitialized: false,
      resave: false,
      store: RedisStore,
      client: client,
      ttl: 30, // time to live
      cookie: {
        httpOnly: true,
        secure: true,
        maxAge: 30000,  //세션이 redis에 저장되는 기간은 maxAge로 조절한다.(ms)
      }
    })
  )
}