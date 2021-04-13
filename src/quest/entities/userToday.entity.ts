import {
	Column,
	CreateDateColumn,
	Entity,
	Generated,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryColumn,
	PrimaryGeneratedColumn,
	Unique
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Quest } from './quest.entity';

@Entity('userToday')
@Unique(['day', 'user'])
export class UserToday {
	@PrimaryGeneratedColumn('uuid')
	userTodayId: string;

	@Column({ type: 'varchar' })
	day: string;

	@CreateDateColumn({ type: 'timestamp' })
	studyTime: Date;

	@Column({ type: 'int' })
	studySetTime: number;

	@Column({ type: 'float', default: 0 })
	questRate: number;

	@ManyToOne(() => User, (user) => user.userToday)
	@JoinColumn([{ name: 'email', referencedColumnName: 'email' }])
	user: User;

	@OneToMany(() => Quest, (quest) => quest.userToday, {
		onDelete: 'CASCADE'
	})
	quest: Quest[];
}
