import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { CreateUserDto } from '../../dto/create-user/create-user.dto';
import { UserResponseDto } from '../../dto/create-user/user-response.dto';
import { UserEntity } from '../../entities/user/user.entity';
import { UserRepository } from '../../repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { cpf, cep, houseNumber } = createUserDto;

    const existingUser = await this.userRepository.findByCpf(cpf);
    if (existingUser) {
      throw new ConflictException('Já existe um usuário com esse CPF');
    }

    const address = await this.getAddressFromCEP(cep);

    if (!address.street || !address.city || !address.state) {
      throw new BadRequestException('Endereço inválido retornado pela API de CEP');
    }

    const user = new UserEntity();
    user.cpf = cpf;
    user.cep = cep;
    user.houseNumber = houseNumber;
    user.city = address.city;

    const savedUser = await this.userRepository.save(user);

    return await this.mapToUserResponseDto(savedUser);
  }

  async findByCpf(cpf: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findByCpf(cpf);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return await this.mapToUserResponseDto(user);
  }

  private async getAddressFromCEP(cep: string) {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.data.erro) {
        throw new BadRequestException('CEP não encontrado.');
      }

      const { logradouro, localidade, uf } = response.data;

      if (!logradouro || !localidade || !uf) {
        throw new BadRequestException('Endereço incompleto recebido da API');
      }

      return {
        street: logradouro,
        city: localidade,
        state: uf,
      };
    } catch (error) {
      throw new BadRequestException('Erro ao buscar o endereço pelo CEP: ' + error);
    }
  }

  private async mapToUserResponseDto(user: UserEntity): Promise<UserResponseDto> {
    const address = await this.getAddressFromCEP(user.cep); 

    return {
      cpf: user.cpf,
      address: {
        cep: user.cep,
        houseNumber: user.houseNumber,
        city: user.city,
        state: address.state, 
        street: address.street,
      },
    };
  }
}