import { IsString } from 'class-validator';

export class createGroup {
	@IsString()
	readonly groupName: string;

	@IsString()
	readonly groupDesc: string;
}
