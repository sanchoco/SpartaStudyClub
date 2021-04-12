import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryColumn({ unique: true })
	email: string;

	@Column({ unique: true })
	nickname: string;

	@Column()
	password: string;
}
