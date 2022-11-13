import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos';
import { UsersService } from './services/users.service';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() user: CreateUserDto) {
    const createdUser = await this.usersService.createUser(user);
    return {
      data: createdUser,
      message: 'user created!',
    };
  }
}
