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

@Entity('studyGroup')
@Index(['groupId'])
export class StudyGroup {
	@PrimaryGeneratedColumn('uuid')
	groupId: string;

	@Column()
	groupName: string;

	@Column()
	groupDesc: string;

	@CreateDateColumn({ type: 'timestamp' })
	createdDt: Date;

	@ManyToOne(() => User, (user) => user.studyGroup)
	@JoinColumn([{ name: 'email', referencedColumnName: 'email' }])
	user: User;

	@OneToMany(() => GroupUser, (groupUser) => groupUser.studyGroup)
	groupUser: GroupUser[];

	@OneToMany(() => Comment, (comment) => comment.studyGroup)
	comment: Comment[];
}
