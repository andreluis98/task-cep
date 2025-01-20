import { Module } from '@nestjs/common';
import { UserRepository } from './user/repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user/controller/user/user.controller';
import { UserService } from './user/service/user/user.service';
import { UserEntity } from './user/entities/user/user.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [UserEntity],
    synchronize: true,
  }), TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class AppModule {}
