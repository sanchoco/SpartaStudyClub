import { User } from 'src/user/entities/user.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn
} from 'typeorm';
import { StudyGroup } from './studyGroup.entity';

@Entity('groupUser')
@Index(['groupUserId'])
export class GroupUser {
	@PrimaryGeneratedColumn('uuid')
	groupUserId: string;

	@ManyToOne(() => StudyGroup, (studyGroup) => studyGroup.groupUser)
	@JoinColumn([{ name: 'groupId', referencedColumnName: 'groupId' }])
	studyGroup: StudyGroup;

	@ManyToOne(() => User, (user) => user.groupUser)
	@JoinColumn([{ name: 'email', referencedColumnName: 'email' }])
	user: User;

	@CreateDateColumn({ type: 'timestamp' })
	createdDt: Date;
}
