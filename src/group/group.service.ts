import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Not, Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';
import { StudyGroup } from './entities/studyGroup.entity';
import { GroupUser } from './entities/groupUser.entity';
import { JoinGroupDto } from './dto/join-group.dto';
import { DeleteGroupDto } from './dto/delete-group.dto';
import { GetCommentDto } from './dto/get-comment.dto';
import { Comment } from 'src/comment/entities/comment.entity';
import { GetRankDto } from './dto/get-rank.dto';
import { UserToday } from 'src/quest/entities/userToday.entity';

@Injectable()
export class GroupService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,

		@InjectRepository(StudyGroup)
		private readonly studyGroupRepository: Repository<StudyGroup>,

		@InjectRepository(GroupUser)
		private readonly groupUserRepository: Repository<GroupUser>,

		@InjectRepository(Comment)
		private readonly commentRepository: Repository<Comment>
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
				.addSelect('u2.nickname', 'nickname')
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
				.innerJoin(User, 'u2', 'sg.email = u2.email')
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
	}

	// 그룹 삭제 혹은 탈퇴
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
					// 그룹 삭제
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
					// 그룹 탈퇴
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
				}
			});
	}

	// 그룹 게시글 목록
	async getComment(getCmt: GetCommentDto) {
		return await this.commentRepository
			.createQueryBuilder('c')
			.select('c.cmtId', 'cmtId')
			.addSelect('c.cmtContents', 'cmtContents')
			.addSelect('c.createdDt', 'createdDt')
			.addSelect('u.nickname', 'nickname')
			.innerJoin(User, 'u', 'c.nickname = u.nickname')
			.innerJoin(StudyGroup, 'sg', 'c.groupId = sg.groupId')
			.where('c.groupId = :groupId', { groupId: getCmt.groupId })
			.orderBy('c.createdDt', 'DESC')
			.getRawMany()
			.then((data) => {
				return { msg: 'success', data: data };
			})
			.catch((err) => {
				return { msg: 'fail' };
			});
	}

	// 퀘스트 수행률 랭킹 조회
	async getRanking(getRank: GetRankDto) {
		return await this.groupUserRepository
			.createQueryBuilder('gu')
			.select('u.nickname', 'nickname')
			.addSelect('ut.studyTime', 'studyTime')
			.addSelect('ut.questRate', 'questRate')
			.innerJoin(
				User,
				'u',
				'gu.email = u.email and gu.groupId = :groupId',
				{ groupId: getRank.groupId }
			)
			.leftJoin(UserToday, 'ut', 'u.email = ut.email and ut.day = :day', {
				day: getRank.day
			})
			.innerJoin(StudyGroup, 'sg', 'gu.groupId = sg.groupId')
			.orderBy('ut.questRate', 'DESC')
			.addOrderBy('ut.studySetTime', 'DESC')
			.getRawMany()
			.then((data) => {
				return { msg: 'success', data: data };
			})
			.catch((err) => {
				return { msg: 'fail' };
			});
	}
}
