import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryColumn
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Quest } from './quest.entity';

@Entity('userToday')
@Index(['userTodayId', 'day', 'user'])
export class UserToday {
	@PrimaryColumn('uuid')
	userTodayId: string;

	@Column()
	day: string;

	@CreateDateColumn()
	studyTime: Date;

	@Column({ type: 'int' })
	studySetTime: number;

	@Column({ type: 'float' })
	questRate: number;

	@ManyToOne(() => User, (user) => user.userToday)
	@JoinColumn([{ name: 'email', referencedColumnName: 'email' }])
	user: User;

	@OneToMany(() => Quest, (quest) => quest.userToday, {
		onDelete: 'CASCADE'
	})
	quest: Quest[];
}
