import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TaskModule } from './modules/task/task.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USER,
      entities: [join(__dirname, 'entities/*.entity.{ts,js}')],
      database: process.env.DB_NAME,
      synchronize: true,
      logging: true,
    }),
    TaskModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
