import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Not, Repository } from 'typeorm';
import { createGroupDto } from './dto/create-group.dto';
import { StudyGroup } from './entities/studyGroup.entity';
import { GroupUser } from './entities/groupUser.entity';

@Injectable()
export class GroupService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,

		@InjectRepository(StudyGroup)
		private readonly groupRepository: Repository<StudyGroup>,

		@InjectRepository(GroupUser)
		private readonly groupUserRepository: Repository<GroupUser>
	) {}

	async getGroup(email: string) {
		try {
			const subQuery = await this.groupUserRepository
				.createQueryBuilder('gu')
				.select(['groupId', 'COUNT(groupId) AS userCnt'])
				.groupBy('groupId');

			console.log('hello');
			const joined = await this.userRepository
				.createQueryBuilder('u')
				.select([
					'sg.groupId',
					'u.nickname',
					'sg.groupName',
					'sg.groupDesc',
					'cgu.userCnt'
				])
				.from('(' + subQuery.getQuery() + ')', 'cgu')
				.innerJoin('u.studyGroup', 'sg')
				.innerJoin('u.groupUser', 'gu')
				.where('u.email = :email', { email: email })
				.andWhere('u.email = gu.email')
				.andWhere('gu.groupId = sg.groupId')
				.andWhere('gu.groupId = cgu.groupId')
				.orderBy('sg.createdDt', 'DESC')
				.getMany();

			console.log('my');
			const unjoined = await this.userRepository
				.createQueryBuilder('user')
				.select([
					'sg.groupId',
					'user.nickname',
					'sg.groupName',
					'sg.groupDesc'
				])
				.innerJoin('user.studyGroup', 'sg')
				.where('user.email != :email', { email: email })
				.orderBy('sg.createdDt', 'DESC')
				.getMany();

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
	async createGroup(createGroup: createGroupDto, email: string) {
		try {
			const user: User = new User();
			user.email = email;
			await this.userRepository.save(user);

			const studyGroup: StudyGroup = new StudyGroup();
			studyGroup.groupName = createGroup.groupName;
			studyGroup.groupDesc = createGroup.groupDesc;
			studyGroup.user = user;
			await this.groupRepository.insert(studyGroup);

			const groupUser: GroupUser = new GroupUser();
			groupUser.user = user;
			groupUser.studyGroup = studyGroup;
			await this.groupUserRepository.insert(groupUser);

			return { msg: 'success' };
		} catch (error) {
			return { msg: 'fail' };
		}
	}
}
