import { IsString } from 'class-validator';

export class DeleteGroupDto {
	@IsString()
	groupId: string;

	@IsString()
	email: string;
}
