import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import { UserToday } from './userToday.entity';

@Entity('quest')
@Index(['questId'])
export class Quest {
	@PrimaryGeneratedColumn('uuid')
	questId: string;

	@Column({ type: 'varchar' })
	questContents: string;

	@Column({ default: false })
	questYn: boolean;

	@CreateDateColumn()
	createdDt: Date;

	@UpdateDateColumn()
	updatedDt: Date;

	@ManyToOne(() => UserToday, (userToday) => userToday.quest)
	@JoinColumn([{ name: 'userTodayId', referencedColumnName: 'userTodayId' }])
	userToday: UserToday;
}
