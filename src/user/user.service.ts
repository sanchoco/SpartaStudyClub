import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { LoginUserDto } from './dto/login-user.dto';
import { CheckUserDto } from './dto/check-user.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	async checkEmail(user: CheckUserDto) {
		try {
			const checkEmail = await this.userRepository.findOne({
				email: user.email
			});
			if (!checkEmail && user.email) return { msg: 'success' };
		} catch (err) {}
		return { msg: 'fail' };
	}

	async checkNickname(user: CheckUserDto) {
		try {
			const checkNickname = await this.userRepository.findOne({
				nickname: user.nickname
			});
			if (!checkNickname && user.nickname) return { msg: 'success' };
		} catch (err) {}
		return { msg: 'fail' };
	}

	async createUser(user: CreateUserDto) {
		try {
			user.password = (await bcrypt.hash(user.password, 10)) + '';
			await this.userRepository.insert(user);
			return { msg: 'success' };
		} catch (err) {
			return { msg: 'fail' };
		}
	}

	async loginUser(user: LoginUserDto) {
		try {
			let db = await this.userRepository.findOne({ email: user.email });
			if (!db) return { msg: 'fail' };
			let check = await bcrypt.compareSync(user.password, db.password);
			if (check) {
				let token = jwt.sign(
					{
						email: db.email,
						exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24시간
					},
					process.env.SECRET_KEY
				);
				return { msg: 'success', token, nickname: db.nickname };
			}
			return { msg: 'fail' };
		} catch (err) {
			return { msg: 'fail' };
		}
	}
}
