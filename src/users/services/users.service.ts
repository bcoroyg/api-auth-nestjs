import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { CreateUserDto } from '../dtos';
import { UserEntity } from '../entities';
import { UsersRepository } from '../repositories';
import { EncoderService } from './encoder.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly encoderService: EncoderService,
  ) {}
  async createUser(user: CreateUserDto): Promise<any> {
    const { name, email, password } = user;
    const hashedPassword = await this.encoderService.encodePassword(password);
    return this.usersRepository.createUser(name, email, hashedPassword, v4());
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.usersRepository.getUserByEmail(email);
    return user;
  }

  async getUserById(userId: string): Promise<UserEntity> {
    const user = await this.usersRepository.getUserById(userId);
    return user;
  }
}
