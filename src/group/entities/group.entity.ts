import { Comment } from 'src/comment/entities/comment.entity';
import { User } from 'src/user/entities/user.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn
} from 'typeorm';
import { GroupUser } from './groupUser.entity';

@Entity('Group')
@Index(['groupId'])
export class Group {
	@PrimaryGeneratedColumn('uuid')
	groupId: string;

	@Column()
	groupName: string;

	@Column()
	groupDesc: string;

	@CreateDateColumn({ type: 'timestamp' })
	createdDt: Date;

	@ManyToOne(() => User, (user) => user.group)
	@JoinColumn([{ name: 'email', referencedColumnName: 'email' }])
	user: Group;

	@OneToMany(() => GroupUser, (groupUser) => groupUser.group)
	groupUser: GroupUser[];

	@OneToMany(() => Comment, (comment) => comment.group)
	comment: Comment[];
}
