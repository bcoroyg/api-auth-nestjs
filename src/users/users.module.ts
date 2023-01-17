import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService, EncoderService } from './services';
import { UsersRepository } from './repositories';
import { UserEntity } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService, EncoderService, UsersRepository],
  exports: [UsersService, EncoderService],
})
export class UsersModule {}
