import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn
} from 'typeorm';
import { Group } from 'src/group/entities/group.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('Comment')
@Index(['cmtId'])
export class Comment {
	@PrimaryGeneratedColumn('uuid')
	cmtId: string;

	@Column()
	cmtContents: string;

	@CreateDateColumn({ type: 'timestamp' })
	createdDt: Date;

	@ManyToOne(() => User, (user) => user.comment)
	@JoinColumn([{ name: 'nickname', referencedColumnName: 'nickname' }])
	user: Comment;

	@ManyToOne(() => Group, (group) => group.comment)
	@JoinColumn([{ name: 'groupId', referencedColumnName: 'groupId' }])
	group: Comment;
}
