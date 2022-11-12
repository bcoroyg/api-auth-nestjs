import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos';
import { UserEntity } from './entities';
//import { UsersRepository } from './repositories';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}
  /* @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository, */

  async createUser(user: CreateUserDto): Promise<any> {
    /* const createdUser = await this.usersRepository.createUser(user);
    return createdUser; */
    const { name, email, password } = user;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    const createdUser = await this.usersRepository.save(newUser);
    return createdUser;
  }
}
