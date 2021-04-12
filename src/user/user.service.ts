import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	async checkEmail(email: string) {
		try {
			const checkEmail = await this.userRepository.findOne({ email });
			if (!checkEmail) return { msg: 'success' };
		} catch (err) {}
		return { msg: 'fail' };
	}

	async checkNickname(nickname: string) {
		try {
			const checkNickname = await this.userRepository.findOne({
				nickname
			});
			if (!checkNickname) return { msg: 'success' };
		} catch (err) {}
		return { msg: 'fail' };
	}

	async createUser(user: CreateUserDto) {
		try {
			await this.userRepository.insert(user);
			return { msg: 'success' };
		} catch (err) {
			console.log(err);
			return { msg: 'fail' };
		}
	}
}
