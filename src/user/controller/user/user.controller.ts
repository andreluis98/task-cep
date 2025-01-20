import { Controller, Post, Body, Get, Param, HttpCode } from '@nestjs/common';
import { CreateUserDto } from '../../dto/create-user/create-user.dto';
import { UserResponseDto } from '../../dto/create-user/user-response.dto';
import { UserService } from '../../service/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }

  @Get(':cpf')
  async findByCpf(@Param('cpf') cpf: string): Promise<UserResponseDto> {
    return this.userService.findByCpf(cpf);
  }
}
