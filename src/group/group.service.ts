import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Not, Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { StudyGroup } from './entities/studyGroup.entity';
import { GroupUser } from './entities/groupUser.entity';
import { JoinGroupDto } from './dto/join-group.dto';
import { QuitGroupDto } from './dto/quit-group.dto';
import { DeleteGroupDto } from './dto/delete-group.dto';

@Injectable()
export class GroupService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,

		@InjectRepository(StudyGroup)
		private readonly studyGroupRepository: Repository<StudyGroup>,

		@InjectRepository(GroupUser)
		private readonly groupUserRepository: Repository<GroupUser>
	) {}

	// 그룹 조회
	async getGroup(email: string) {
		try {
			// 사람 수 서브쿼리
			const cntSubQuery = await this.groupUserRepository
				.createQueryBuilder('gu')
				.select('gu.groupId', 'groupId')
				.addSelect('COUNT(gu.groupId)', 'userCnt')
				.groupBy('gu.groupId');

			// 해당 사용자가 가입한 그룹
			const joined = await this.userRepository

				.createQueryBuilder('u')
				.select('sg.groupId', 'groupId')
				.addSelect('u.nickname', 'nickname')
				.addSelect('sg.groupName', 'groupName')
				.addSelect('sg.groupDesc', 'groupDesc')
				.addSelect('cgu.userCnt', 'userCnt')
				.innerJoin(GroupUser, 'gu', 'u.email = gu.email')
				.innerJoin(StudyGroup, 'sg', 'gu.groupId = sg.groupId')
				.innerJoin(
					'(' + cntSubQuery.getQuery() + ')',
					'cgu',
					'gu.groupId = cgu.groupId'
				)
				.where('u.email = :email', { email: email })
				.orderBy('sg.createdDt', 'DESC')
				.getRawMany();

			// 가입하지 않은 그룹 찾기용 서브쿼리
			const subQuery = await this.userRepository
				.createQueryBuilder('u')
				.select('gu.groupId', 'groupId')
				.innerJoin(GroupUser, 'gu', 'u.email = gu.email')
				.where(`u.email = '${email}'`);

			// 해당 사용자가 가입하지 않은 그룹
			const unjoined = await this.userRepository
				.createQueryBuilder('u')
				.select('sg.groupId', 'groupId')
				.addSelect('u.nickname', 'nickname')
				.addSelect('sg.groupName', 'groupName')
				.addSelect('sg.groupDesc', 'groupDesc')
				.addSelect('cgu.userCnt', 'userCnt')
				.innerJoin(GroupUser, 'gu', 'u.email = gu.email')
				.innerJoin(StudyGroup, 'sg', 'gu.groupId = sg.groupId')
				.innerJoin(
					'(' + cntSubQuery.getQuery() + ')',
					'cgu',
					'gu.groupId = cgu.groupId'
				)
				.where('gu.groupId NOT IN (' + subQuery.getQuery() + ')')
				.orderBy('sg.createdDt', 'DESC')
				.getRawMany();

			return {
				msg: 'success',
				joined: joined,
				unjoined: unjoined
			};
		} catch {
			return { msg: 'fail' };
		}
	}

	// 그룹 생성
	async createGroup(createGroup: CreateGroupDto, email: string) {
		try {
			const user: User = new User();
			user.email = email;

			const studyGroup: StudyGroup = new StudyGroup();
			studyGroup.groupName = createGroup.groupName;
			studyGroup.groupDesc = createGroup.groupDesc;
			studyGroup.user = user;
			await this.studyGroupRepository.insert(studyGroup);

			const groupUser: GroupUser = new GroupUser();
			groupUser.user = user;
			groupUser.studyGroup = studyGroup;
			await this.groupUserRepository.insert(groupUser);

			return { msg: 'success' };
		} catch (error) {
			return { msg: 'fail' };
		}
	}

	//그룹 가입
	async joinGroup(joinGroup: JoinGroupDto) {
		try {
			const user: User = new User();
			user.email = joinGroup.email;

			const studyGroup: StudyGroup = new StudyGroup();
			studyGroup.groupId = joinGroup.groupId;

			return await this.groupUserRepository
				.findOne({
					user: user,
					studyGroup: studyGroup
				})
				.then(async (findJoin) => {
					if (!findJoin) {
						await this.groupUserRepository.insert({
							user: user,
							studyGroup: studyGroup
						});
						return { msg: 'success' };
					} else {
						return { msg: 'fail' };
					}
				})
				.catch((err) => {
					return { msg: 'fail' };
				});
		} catch {
			return { msg: 'fail' };
		}
	}

	// 그룹 삭제
	async deleteGroup(deleteGroup: DeleteGroupDto) {
		const user: User = new User();
		user.email = deleteGroup.email;

		const studyGroup: StudyGroup = new StudyGroup();
		studyGroup.groupId = deleteGroup.groupId;

		return await this.studyGroupRepository
			.findOne({
				user: user,
				groupId: deleteGroup.groupId
			})
			.then(async (findGroup) => {
				if (findGroup) {
					await this.groupUserRepository.delete({
						studyGroup: studyGroup
					});

					return await this.studyGroupRepository
						.delete({
							user: user,
							groupId: deleteGroup.groupId
						})
						.then(async (del) => {
							if (del.affected > 0) {
								return { msg: 'success' };
							} else {
								return { msg: 'fail' };
							}
						});
				} else {
					return { msg: 'fail' };
				}
			});
	}

	// 그룹 탈퇴
	async quitGroup(quitGroup: QuitGroupDto) {
		try {
			const user: User = new User();
			user.email = quitGroup.email;

			const studyGroup: StudyGroup = new StudyGroup();
			studyGroup.groupId = quitGroup.groupId;

			return await this.groupUserRepository
				.findOne({
					user: user,
					studyGroup: studyGroup
				})
				.then(async (findJoin) => {
					if (findJoin) {
						return await this.groupUserRepository
							.delete({
								user: user,
								studyGroup: studyGroup
							})
							.then(async (del) => {
								if (del.affected > 0) {
									return { msg: 'success' };
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
		} catch {
			return { msg: 'fail' };
		}
	}
}
