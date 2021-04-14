import { IsString } from 'class-validator';

export class DeleteQuestDto {
	@IsString()
	readonly userTodayId!: string;
	@IsString()
	readonly questId!: string;
}
