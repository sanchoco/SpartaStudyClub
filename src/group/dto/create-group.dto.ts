import { IsString } from 'class-validator';

export class createGroupDto {
	@IsString()
	readonly groupName: string;

	@IsString()
	readonly groupDesc: string;
}
