import {
	Controller,
	Param,
	Post,
	Headers,
	Body,
	Put,
	Delete
} from '@nestjs/common';
import { group } from 'node:console';
import { CommentService } from './comment.service';
import { DeleteCommentDto } from './dto/delete-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { WriteCommentDto } from './dto/write-comment.dto';

@Controller('comment')
export class CommentController {
	constructor(private readonly commentService: CommentService) {}

	// 그룹 게시글 작성
	@Post(':groupId')
	writeComment(
		@Param('groupId') groupId: string,
		@Body() cmtContents: string,
		@Headers() header: any
	) {
		const writeCmt: WriteCommentDto = new WriteCommentDto();
		writeCmt.groupId = groupId;
		writeCmt.cmtContents = cmtContents['cmtContents'];
		writeCmt.email = header.email;
		return this.commentService.writeComment(writeCmt);
	}

	// 그룹 게시글 수정
	@Put(':cmtId')
	updateComment(@Param('cmtId') cmtId: string, @Body() cmtContents: string) {
		const updateCmt: UpdateCommentDto = new UpdateCommentDto();
		updateCmt.cmtId = cmtId;
		updateCmt.cmtContents = cmtContents['cmtContents'];
		return this.commentService.updateComment(updateCmt);
	}

	// 그룹 게시글 수정
	@Delete(':cmtId')
	deleteComment(@Param('cmtId') cmtId: string) {
		const deleteCmt: DeleteCommentDto = new DeleteCommentDto();
		deleteCmt.cmtId = cmtId;
		return this.commentService.deleteComment(deleteCmt);
	}
}
