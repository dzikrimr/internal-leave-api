import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global response interceptor - standardize API responses
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Enable CORS
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`🚀 Server is running on port ${process.env.PORT ?? 3000}`);
  });
}

bootstrap();
