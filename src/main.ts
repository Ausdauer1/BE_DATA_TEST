import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from 'src/util/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true
  });
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  setupSwagger(app);

  await app.listen(3000);

}
bootstrap();
