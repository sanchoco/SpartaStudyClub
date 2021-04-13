import { IsString } from 'class-validator';

export class DeleteQuestDto {
	@IsString()
	readonly questId!: string;
}
