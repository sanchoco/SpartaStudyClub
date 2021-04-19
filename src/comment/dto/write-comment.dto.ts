import { IsString } from 'class-validator';

export class WriteCommentDto {
	@IsString()
	groupId: string;

	@IsString()
	email: string;

	@IsString()
	cmtContents: string;
}
