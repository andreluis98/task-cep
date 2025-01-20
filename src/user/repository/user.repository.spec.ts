import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user/user.entity';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let repository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    repository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  it('should return user by CPF', async () => {
    const user = new UserEntity();
    user.cpf = '12345678901';
    
    jest.spyOn(repository, 'findOne').mockResolvedValue(user);
    
    const result = await userRepository.findByCpf('12345678901');
    expect(result).toEqual(user);
  });
});
