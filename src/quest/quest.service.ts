import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, getManager, Repository } from 'typeorm';
import { CreateSetDto } from './dto/create-set.dto';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { UserToday } from './entities/userToday.entity';
import { User } from '../user/entities/user.entity';
import { Quest } from './entities/quest.entity';
import { DeleteQuestDto } from './dto/delete-quest.dto';
import { from } from 'rxjs';
import { clear } from 'node:console';
import { type } from 'node:os';
import { number } from 'joi';

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

	async getData(ymd: string, email: string) {
		return await this.userTodayRepository
			.findOne({
				relations: ['user'],
				where: {
					user: { email: email },
					day: ymd
				}
			})
			.then(async (findData) => {
				if (findData) {
					const uid = findData.userTodayId;
					return await this.questRepository
						.find({
							relations: ['userToday'],
							where: {
								userToday: { userTodayId: uid }
							}
						})
						.then((findQuest) => {
							if (findQuest) {
								return { msg: 'success', data: findQuest };
							} else {
								return { msg: 'fail' };
							}
						})
						.catch((err) => {
							return { msg: 'fail' };
						});
				} else {
					return { msg: 'fail' };
				}
			})
			.catch((err) => {
				return { msg: 'fail' };
			});
	}

	async getCalendar(fromDate: Date, toDate: Date, email: string) {
		const fd: string = fromDate.toISOString();
		const td: string = toDate.toISOString();
		return await getManager()
			.query(
				`SELECT ut.userTodayId, ut.day, ut.studyTime, UNIX_TIMESTAMP(ut.studyTime) as studyTimeStamp, ut.studySetTime, ut.questRate, q.questId, q.questContents, q.questYn, q.createdDt, u.email
                   FROM userToday ut, quest q, user u
                  WHERE ut.userTodayId = q.userTodayId
                    AND u.email = ut.email
                    AND u.email = '${email}'
                    AND ut.studyTime between ('${fd}') and ('${td}')
               ORDER BY ut.studyTime DESC, q.createdDt ASC`
			)
			.then((cal) => {
				if (cal) {
					return { msg: 'success', data: cal };
				} else {
					return { msg: 'fail' };
				}
			});
	}

	// 공부 시간 설정
	async setStudyTime(CreateSetDto: CreateSetDto, ymd: string, email: string) {
		try {
			const user: User = new User();
			user.email = email;
			await this.userRepository.save(user);

			const userToday: UserToday = new UserToday();
			userToday.day = ymd;
			userToday.studySetTime = CreateSetDto.studySetTime;
			userToday.user = user;
			await this.userTodayRepository.insert(userToday);
		} catch (error) {
			return { msg: 'fail' };
		}

		return await this.userTodayRepository
			.findOne({
				relations: ['user'],
				where: {
					user: { email: email },
					day: ymd
				}
			})
			.then((utId) => {
				console.log(utId);
				if (utId) {
					return {
						msg: 'success',
						userTodayId: utId.userTodayId,
						studyTime: utId.studyTime.getTime()
					};
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
		try {
			const userToday: UserToday = new UserToday();
			userToday.userTodayId = createQuestDto.userTodayId;
			await this.userTodayRepository.save(userToday);

			const quest: Quest = new Quest();
			quest.questContents = createQuestDto.questContents;
			quest.userToday = userToday;
			await this.questRepository.insert(quest);
		} catch (error) {
			return { msg: 'fail' };
		}

		return await this.questRepository
			.find({
				relations: ['userToday'],
				where: {
					userToday: { userTodayId: createQuestDto.userTodayId }
				},
				order: {
					createdDt: 'DESC'
				},
				take: 1
			})
			.then(async (qId) => {
				if (qId) {
					const allCnt = await this.questRepository.count({
						relations: ['userToday'],
						where: {
							userToday: {
								userTodayId: createQuestDto.userTodayId
							}
						}
					});

					const clearCnt = await this.questRepository.count({
						relations: ['userToday'],
						where: {
							userToday: {
								userTodayId: createQuestDto.userTodayId
							},
							questYn: true
						}
					});

					const rate = (clearCnt / allCnt) * 100;
					await this.userTodayRepository.update(
						createQuestDto.userTodayId,
						{
							questRate: rate
						}
					);

					return {
						msg: 'success',
						questId: qId[0]['questId'],
						questContents: qId[0]['questContents'],
						questYn: qId[0]['questYn'],
						questRate: rate
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
			.findOne({
				questId: questId
			})
			.then(async (findQuest) => {
				if (findQuest.questYn == questYn) {
					return { msg: 'fail' };
				} else {
					return await this.questRepository
						.update(questId, {
							questYn: questYn
						})
						.then(async (upd) => {
							if (upd.raw.changedRows > 0) {
								const allCnt = await this.questRepository.count(
									{
										relations: ['userToday'],
										where: {
											userToday: {
												userTodayId:
													updateQuestDto.userTodayId
											}
										}
									}
								);

								const clearCnt = await this.questRepository.count(
									{
										relations: ['userToday'],
										where: {
											userToday: {
												userTodayId:
													updateQuestDto.userTodayId
											},
											questYn: true
										}
									}
								);

								const rate = (clearCnt / allCnt) * 100;
								await this.userTodayRepository.update(
									updateQuestDto.userTodayId,
									{
										questRate: rate
									}
								);
								return {
									msg: 'success',
									questRate: rate
								};
							} else {
								return { msg: 'fail' };
							}
						})
						.catch(() => {
							return { msg: 'fail' };
						});
				}
			})
			.catch((err) => {
				return { msg: 'fail' };
			});
	}

	// 할 일 삭제
	async deleteQuest(deleteQuestDto: DeleteQuestDto) {
		const questId = deleteQuestDto.questId;
		return await this.questRepository
			.delete({ questId: questId })
			.then(async (del) => {
				if (del.affected > 0) {
					const allCnt = await this.questRepository.count({
						relations: ['userToday'],
						where: {
							userToday: {
								userTodayId: deleteQuestDto.userTodayId
							}
						}
					});

					const clearCnt = await this.questRepository.count({
						relations: ['userToday'],
						where: {
							userToday: {
								userTodayId: deleteQuestDto.userTodayId
							},
							questYn: true
						}
					});

					let rate = 0;
					if (allCnt != 0) {
						rate = (clearCnt / allCnt) * 100;
					}

					await this.userTodayRepository.update(
						deleteQuestDto.userTodayId,
						{
							questRate: rate
						}
					);
					return {
						msg: 'success',
						questRate: rate
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
