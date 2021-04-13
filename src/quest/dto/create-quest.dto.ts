import { IsNumber, IsString } from 'class-validator';
export class CreateQuestDto {
	@IsString()
	readonly userTodayId!: string;
	@IsString()
	readonly questContent!: string;
}
