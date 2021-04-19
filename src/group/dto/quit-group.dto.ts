import { IsString } from 'class-validator';

export class QuitGroupDto {
	@IsString()
	groupId: string;

	@IsString()
	email: string;
}
