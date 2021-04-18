import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn
} from 'typeorm';
import { StudyGroup } from 'src/group/entities/studyGroup.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('comment')
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
	user: User;

	@ManyToOne(() => StudyGroup, (studyGroup) => studyGroup.comment)
	@JoinColumn([{ name: 'groupId', referencedColumnName: 'groupId' }])
	studyGroup: StudyGroup;
}
