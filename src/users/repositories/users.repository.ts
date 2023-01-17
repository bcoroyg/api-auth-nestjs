import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entities';

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async createUser(
    name: string,
    email: string,
    password: string,
    activationToken: string,
  ): Promise<void> {
    const createdUser = this.create({
      name,
      email,
      password,
      activationToken,
    });
    try {
      await this.save(createdUser);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('This email is already registered');
      }
      throw new InternalServerErrorException();
    }
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    // principio Tell, Don’t Ask es una tautología sobre la Programación Orientada a Objetos.
    // Una redundancia del propio concepto de la orientación a objetos en forma de frase que debemos
    // recordar a la hora de desarrollar.
    const user: UserEntity = await this.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async getUserById(userId: string): Promise<UserEntity> {
    const user = await this.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('user not found!');
    }
    return user;
  }

  async activateUser(user: UserEntity): Promise<void> {
    user.active = true;
    this.save(user);
  }

  async findOneInactiveByIdAndActivationToken(
    id: string,
    code: string,
  ): Promise<UserEntity> {
    return this.findOne({
      where: { id: id, activationToken: code, active: false },
    });
  }
}

/* @Injectable()
export class UsersRepository {
  constructor(private AppDataSource: DataSource) {}

  private userRepository = this.AppDataSource.getRepository(UserEntity);

  async createUser(
    name: string,
    email: string,
    password: string,
    activationToken: string,
  ): Promise<void> {
    const createdUser = this.userRepository.create({
      name,
      email,
      password,
      activationToken,
    });
    try {
      await this.userRepository.save(createdUser);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('This email is already registered');
      }
      throw new InternalServerErrorException();
    }
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async getUserById(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('user not found!');
    }
    return user;
  }

  async activateUser(user: UserEntity): Promise<void> {
    user.active = true;
    this.userRepository.save(user);
  }

  async findOneInactiveByIdAndActivationToken(
    id: string,
    code: string,
  ): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id: id, activationToken: code, active: false },
    });
  }
} */
