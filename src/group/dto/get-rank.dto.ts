import { IsString } from 'class-validator';

export class GetRankDto {
	@IsString()
	groupId: string;

	@IsString()
	day: string;
}
