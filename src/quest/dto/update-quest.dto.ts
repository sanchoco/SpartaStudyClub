import { IsBoolean, IsString } from 'class-validator';

export class UpdateQuestDto {
	@IsString()
	readonly userTodayId!: string;
	@IsString()
	readonly questId!: string;
	@IsBoolean()
	readonly questYn!: boolean;
}
