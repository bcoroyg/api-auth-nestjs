import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities';
import { UsersController } from './users.controller';
import { UsersService } from './services/users.service';
import { EncoderService } from './services/encoder.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService, EncoderService],
})
export class UsersModule {}
