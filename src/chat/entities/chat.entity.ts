import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chat')
export class Chat {
	@PrimaryGeneratedColumn('uuid')
	chatId: string;

	@Column({ type: 'varchar' })
	nickname: string;

	@Column({ type: 'varchar' })
	message: string;

	@Column({ type: 'bigint' })
	date: Date;
}
