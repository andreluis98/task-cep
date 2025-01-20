import { IsString, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  cpf!: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 8)
  cep!: string;

  @IsNumber()
  houseNumber!: number;
}