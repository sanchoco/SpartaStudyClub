import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { LoginUserDto } from './dto/login-user.dto';
import { CheckUserDto } from './dto/check-user.dto';
import { UserToday } from 'src/quest/entities/userToday.entity';

function getToday(): string {
	const date: Date = new Date();
	const year = String(date.getFullYear());
	const month: string = ('0' + (1 + date.getMonth())).slice(-2);
	const day: string = ('0' + date.getDate()).slice(-2);
	return year + '/' + month + '/' + day;
}

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,

		@InjectRepository(UserToday)
		private readonly userTodayRepository: Repository<UserToday>
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
		let result: Object = {
			msg: 'success',
			token: '',
			nickname: '',
			studyTime: 0,
			studySetTime: 0,
			userTodayId: ''
		};
		try {
			let db = await this.userRepository.findOne({ email: user.email });
			if (!db) return { msg: 'fail' };
			let check = await bcrypt.compareSync(user.password, db.password);
			result['nickname'] = db['nickname'];
			let today = getToday();
			console.log(today);
			if (check) {
				let todayTable = await this.userTodayRepository.findOne({
					relations: ['user'],
					where: {
						day: today,
						user: { email: user.email }
					}
				});
				console.log(todayTable);
				if (todayTable) {
					result['studyTime'] = todayTable['studyTime'].getTime();
					result['studySetTime'] = todayTable['studySetTime'];
					result['userTodayId'] = todayTable['userTodayId'];
				}
				result['token'] = jwt.sign(
					{
						email: db.email,
						exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24시간
					},
					process.env.SECRET_KEY
				);
				return result;
			}
			return { msg: 'fail' };
		} catch (err) {
			console.log(err);
			return { msg: 'fail' };
		}
	}
}
