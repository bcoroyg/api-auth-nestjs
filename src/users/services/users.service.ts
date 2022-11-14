import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

import { CreateUserDto } from '../dtos';
import { UserEntity } from '../entities';
import { EncoderService } from './encoder.service';
//import { UsersRepository } from './repositories';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private encoderService: EncoderService,
  ) {}
  /* @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository, */

  async createUser(user: CreateUserDto): Promise<any> {
    /* const { name, email, password } = user;
    const createdUser = await this.usersRepository.createUser(name, email, password);
    return createdUser; */
    const { name, email, password } = user;
    const hashedPassword = await this.encoderService.encodePassword(password);
    const newUser = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      activationToken: v4(),
    });
    const createdUser = await this.usersRepository.save(newUser);
    return createdUser;
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user;
  }

  async getUserById(userId: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('user not found!');
    }
    return user;
  }
}
