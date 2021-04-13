import { IsString } from 'class-validator';

export class UpdateQuestDto {
	@IsString()
	readonly questId!: string;
	@IsString()
	readonly questYn!: string;
}
