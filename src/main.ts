import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
    console.log(`Request made to: ${req.url}`);
    next();
  });
  await app.listen(3000);
}
bootstrap();
