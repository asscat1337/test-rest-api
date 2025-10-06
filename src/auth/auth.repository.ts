import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../database/models/user.model';
import { Repository } from 'typeorm';

export class UserAuthRepository {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async save<T extends Pick<Users, 'login' | 'password'>>(
    payload: T,
  ): Promise<Users> {
    return this.userRepository.save(payload);
  }
  async findOne(userId: string): Promise<any | undefined> {
    return this.userRepository.findOneBy({ userId });
  }

  async getUserByLogin(login: string): Promise<Users | undefined> {
    return await this.userRepository.findOne({ where: { login } });
  }
}
