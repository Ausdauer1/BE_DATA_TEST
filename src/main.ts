import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from 'src/util/swagger';


async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'https://k-baseball.store:3000', 
      'http://localhost:3000',
      'http://localhost:3002'
    ],
    credentials: true
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  setupSwagger(app);

  await app.listen(3000);

}
bootstrap();
