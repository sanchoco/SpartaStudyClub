import { IsString } from 'class-validator';

export class UpdateCommentDto {
	@IsString()
	cmtId: string;

	@IsString()
	cmtContents: string;
}
