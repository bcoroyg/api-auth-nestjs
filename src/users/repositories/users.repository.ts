import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dtos';
import { UserEntity } from '../entities';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
  async createUser(user: CreateUserDto): Promise<void> {
    const { name, email, password } = user;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const createdUser = this.create({ name, email, password: hashedPassword });
    try {
      await this.save(createdUser);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('This email is already registered');
      }
      throw new InternalServerErrorException();
    }
  }
}
