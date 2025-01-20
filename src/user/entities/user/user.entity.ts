import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cpf: string;

  @Column({ nullable: true })
  city: string;

  @Column()
  cep: string;

  @Column()
  houseNumber: number;
}
