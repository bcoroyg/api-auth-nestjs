import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities';
import { UsersController } from './users.controller';
import { UsersService, EncoderService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService, EncoderService],
  exports: [UsersService, EncoderService],
})
export class UsersModule {}
