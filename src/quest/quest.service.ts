import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CreateSetDto } from './dto/create-set.dto';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { UserToday } from './entities/userToday.entity';
import { User } from '../user/entities/user.entity';
import { Quest } from './entities/quest.entity';
import { DeleteQuestDto } from './dto/delete-quest.dto';
import { from } from 'rxjs';

@Injectable()
export class QuestService {
	// 생성자 생성
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,

		@InjectRepository(UserToday)
		private readonly userTodayRepository: Repository<UserToday>,

		@InjectRepository(Quest)
		private readonly questRepository: Repository<Quest>
	) {}

	async getCalendar(fromDate: Date, toDate: Date, email: string) {
		return await this.userTodayRepository
			.find({
				relations: ['user'],
				where: {
					user: { email: email },
					studyTime: Between(fromDate, toDate)
				}
			})
			.then((cal) => {
				console.log(cal);
			});
	}

	// 공부 시간 설정
	async setStudyTime(CreateSetDto: CreateSetDto, ymd: string, email: string) {
		const user: User = new User();
		user.email = email;
		await this.userRepository.save(user);

		const userToday: UserToday = new UserToday();
		userToday.day = ymd;
		userToday.studySetTime = CreateSetDto.time;
		userToday.user = user;
		await this.userTodayRepository.insert(userToday);

		return await this.userTodayRepository
			.findOne({
				relations: ['user'],
				where: {
					user: { email: email }
				}
			})
			.then((utId) => {
				if (utId) {
					return { msg: 'success', userTodayId: utId.userTodayId };
				} else {
					return { msg: 'fail' };
				}
			})
			.catch((err) => {
				return { msg: 'fail' };
			});
	}

	// 할 일 생성
	async createQuest(createQuestDto: CreateQuestDto) {
		const userToday: UserToday = new UserToday();
		userToday.userTodayId = createQuestDto.userTodayId;
		await this.userTodayRepository.save(userToday);

		const quest: Quest = new Quest();
		quest.questContent = createQuestDto.questContent;
		quest.userToday = userToday;
		await this.questRepository.insert(quest);

		return await this.questRepository
			.findOne({
				relations: ['userToday'],
				where: {
					userToday: { userTodayId: createQuestDto.userTodayId }
				}
			})
			.then((qId) => {
				if (qId) {
					return {
						msg: 'success',
						questId: qId.questId,
						questContent: qId.questContent,
						questYn: qId.questYn
					};
				} else {
					return { msg: 'fail' };
				}
			})
			.catch((err) => {
				return { msg: 'fail' };
			});
	}

	// 할 일 상태 변경
	async setQuestYn(updateQuestDto: UpdateQuestDto) {
		const questId = updateQuestDto.questId;
		const questYn = updateQuestDto.questYn;

		return await this.questRepository
			.update(questId, {
				questYn: questYn
			})
			.then((upd) => {
				if (upd.raw.changedRows > 0) {
					return {
						msg: 'success'
					};
				} else {
					return { msg: 'fail' };
				}
			})
			.catch(() => {
				return { msg: 'fail' };
			});
	}

	// 할 일 삭제
	async deleteQuest(deleteQuestDto: DeleteQuestDto) {
		const questId = deleteQuestDto.questId;
		return await this.questRepository
			.delete({ questId: questId })
			.then((del) => {
				if (del.affected > 0) {
					return {
						msg: 'success'
					};
				} else {
					return { msg: 'fail' };
				}
			})
			.catch(() => {
				return { msg: 'fail' };
			});
	}
}
