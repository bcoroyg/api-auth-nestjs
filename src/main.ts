import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();

  //Variable de entorno PORT
  const config = app.get(ConfigService);
  const port = parseInt(config.get<string>(PORT), 10);

  await app.listen(port);
  logger.log(`Server in running in ${await app.getUrl()}`);
}
bootstrap();
