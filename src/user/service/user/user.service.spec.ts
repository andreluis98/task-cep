import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserRepository } from '../../repository/user.repository';
import { UserEntity } from '../../entities/user/user.entity';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            save: jest.fn(),
            findByCpf: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should throw a ConflictException if CPF already exists', async () => {
    jest.spyOn(userRepository, 'findByCpf').mockResolvedValueOnce({} as any);

    await expect(userService.create({ cpf: '12345678901', cep: '01001000', houseNumber: 123 }))
      .rejects
      .toThrow(new ConflictException('Já existe um usuário com esse CPF'));
  });

  it('should throw a NotFoundException if user is not found', async () => {
    jest.spyOn(userRepository, 'findByCpf').mockResolvedValueOnce(null);

    await expect(userService.findByCpf('12345678901'))
      .rejects
      .toThrow(new NotFoundException('Usuário não encontrado'));
  });

  it('should throw BadRequestException if address is invalid', async () => {
    jest.spyOn(userRepository, 'findByCpf').mockResolvedValueOnce(null);
    
    jest.spyOn(userService as any, 'getAddressFromCEP').mockResolvedValue({
      street: '',
      city: '',
      state: ''
    });

    await expect(userService.create({ cpf: '12345678901', cep: '00000000', houseNumber: 123 }))
      .rejects
      .toThrow(new BadRequestException('Endereço inválido retornado pela API de CEP'));
  });
});
