import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {}),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  if ((process.env.SWAGGER_ENABLED ?? undefined) === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Backend Developer Roadmap')
      .setVersion(process.env.npm_package_version)
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  const debugLevel = (process.env.DEBUG_LEVEL ?? 'info').toLocaleLowerCase();
  if (debugLevel == 'info') {
    console.debug = function () {};
  }

  await app.listen(3000);
}
bootstrap();
