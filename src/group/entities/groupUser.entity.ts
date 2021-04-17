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
import { Group } from './group.entity';

@Entity('GroupUser')
@Index(['groupUserId'])
export class GroupUser {
	@PrimaryGeneratedColumn('uuid')
	groupUserId: string;

	@ManyToOne(() => Group, (group) => group.groupUser)
	@JoinColumn([{ name: 'groupId', referencedColumnName: 'groupId' }])
	group: GroupUser;

	@ManyToOne(() => User, (user) => user.groupUser)
	@JoinColumn([{ name: 'email', referencedColumnName: 'email' }])
	user: GroupUser;

	@CreateDateColumn({ type: 'timestamp' })
	createdDt: Date;
}
