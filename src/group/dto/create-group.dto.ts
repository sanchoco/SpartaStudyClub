import { IsString } from 'class-validator';

export class CreateGroupDto {
	@IsString()
	readonly groupName: string;

	@IsString()
	readonly groupDesc: string;
}
