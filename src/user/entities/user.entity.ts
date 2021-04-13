import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { UserToday } from 'src/quest/entities/userToday.entity';

@Entity('user')
export class User {
	@PrimaryColumn({ unique: true })
	email: string;

	@Column({ type: 'varchar', unique: true })
	nickname: string;

	@Column({ type: 'varchar' })
	password: string;

	@OneToMany(() => UserToday, (userToday) => userToday.user, {
		onDelete: 'CASCADE'
	})
	userToday: UserToday[];
}
