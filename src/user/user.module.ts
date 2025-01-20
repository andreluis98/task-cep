import { Module } from '@nestjs/common';
import { UserService } from './service/user/user.service';
import { UserController } from './controller/user/user.controller';
import { UserRepository } from './repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])], 
  controllers: [UserController],
  providers: [UserService, UserRepository], 
  exports: [UserRepository],
})
export class UserModule {}
