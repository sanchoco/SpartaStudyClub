import { IsString } from 'class-validator';

export class GetCommentDto {
	@IsString()
	groupId: string;
}
