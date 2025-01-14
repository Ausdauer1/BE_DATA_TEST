import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from 'src/util/swagger';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ["http://localhost:3002", "http://localhost:3000", "https://k-baseball.store:3000"],
    credentials: true
  });
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  setupSwagger(app);

  await app.listen(3000);

}
bootstrap();
