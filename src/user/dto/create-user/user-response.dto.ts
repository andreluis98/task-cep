export class UserResponseDto {
    cpf: string;
    address: {
      cep: string;
      houseNumber: number;
      city: string;
      state: string;
      street: string;
    };
  }
  