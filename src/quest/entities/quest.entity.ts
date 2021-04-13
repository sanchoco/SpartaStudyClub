import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryColumn
} from 'typeorm';
import { UserToday } from './userToday.entity';

@Entity('quest')
@Index(['questId'])
export class Quest {
	@PrimaryColumn('uuid')
	questId: string;

	@Column({ type: 'varchar' })
	questContent: string;

	@Column({ default: 'N' })
	questYn: string;

	@ManyToOne(() => UserToday, (userToday) => userToday.quest)
	@JoinColumn([{ name: 'userTodayId', referencedColumnName: 'userTodayId' }])
	userToday: UserToday;
}
