import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	PrimaryGeneratedColumn
} from 'typeorm';
import { UserToday } from './userToday.entity';

@Entity('quest')
@Index(['questId'])
export class Quest {
	@PrimaryGeneratedColumn('uuid')
	questId: string;

	@Column({ type: 'varchar' })
	questContent: string;

	@Column({ default: 'N' })
	questYn: string;

	@ManyToOne(() => UserToday, (userToday) => userToday.quest)
	@JoinColumn([{ name: 'userTodayId', referencedColumnName: 'userTodayId' }])
	userToday: UserToday;
}
