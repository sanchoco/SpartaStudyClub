import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { UserToday } from 'src/quest/entities/userToday.entity';
import { StudyGroup } from 'src/group/entities/studyGroup.entity';
import { GroupUser } from 'src/group/entities/groupUser.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Entity('user')
@Index(['email'])
export class User {
	@PrimaryColumn({ unique: true })
	email: string;

	@Column({ type: 'varchar', unique: true })
	nickname: string;

	@Column({ type: 'varchar' })
	password: string;

	@OneToMany(() => UserToday, (userToday) => userToday.user, {
		onDelete: 'CASCADE'
	})
	userToday: UserToday[];

	@OneToMany(() => StudyGroup, (studyGroup) => studyGroup.user, {
		onDelete: 'CASCADE'
	})
	studyGroup: StudyGroup[];

	@OneToMany(() => GroupUser, (groupUser) => groupUser.user, {
		onDelete: 'CASCADE'
	})
	groupUser: GroupUser[];

	@OneToMany(() => Comment, (comment) => comment.user, {
		onDelete: 'CASCADE'
	})
	comment: Comment[];
}
