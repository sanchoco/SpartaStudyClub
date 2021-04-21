import {
	Body,
	Controller,
	Post,
	Headers,
	Get,
	Param,
	Delete
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { DeleteGroupDto } from './dto/delete-group.dto';
import { GetCommentDto } from './dto/get-comment.dto';
import { GetRankDto } from './dto/get-rank.dto';
import { JoinGroupDto } from './dto/join-group.dto';
import { GroupService } from './group.service';

function getToday(): string {
	const today = new Date();
	const utc = today.getTime() + today.getTimezoneOffset() * 60 * 1000;
	const KR_TIME_DIFF = 9 * 60 * 60 * 1000;

	const kr_today = new Date(utc + KR_TIME_DIFF);

	console.log('kr_today: ', kr_today);
	const year = String(kr_today.getFullYear());
	const month: string = ('0' + (1 + kr_today.getMonth())).slice(-2);
	const day: string = ('0' + kr_today.getDate()).slice(-2);
	return year + '/' + month + '/' + day;
}
@Controller('group')
export class GroupController {
	constructor(private readonly groupService: GroupService) {}

	// 가입 미가입 그룹 찾기
	@Get()
	getGroup(@Headers() header: any) {
		return this.groupService.getGroup(header.email);
	}

	// 그룹 만들기
	@Post()
	createGroup(@Body() createGroup: CreateGroupDto, @Headers() header: any) {
		return this.groupService.createGroup(createGroup, header.email);
	}

	// 그룹 게시글 목록 확인
	@Get(':groupId/comment')
	getComment(@Param('groupId') groupId: string, @Headers() header: any) {
		const getCmt: GetCommentDto = new GetCommentDto();
		getCmt.groupId = groupId;
		return this.groupService.getComment(getCmt);
	}

	// 퀘스트 수행률 랭킹 조회
	@Get(':groupId/rank')
	getRanking(@Param('groupId') groupId: string, @Headers() header: any) {
		const getRank: GetRankDto = new GetRankDto();
		getRank.groupId = groupId;
		getRank.day = getToday();
		return this.groupService.getRanking(getRank);
	}

	// 그룹 가입
	@Post(':groupId')
	joinGroup(@Param('groupId') groupId: string, @Headers() header: any) {
		const joinGroup = new JoinGroupDto();
		joinGroup.groupId = groupId;
		joinGroup.email = header.email;

		return this.groupService.joinGroup(joinGroup);
	}

	// 그룹 삭제 혹은 탈퇴
	@Delete('/:groupId')
	deleteGroup(@Param('groupId') groupId: string, @Headers() header: any) {
		const deleteGroup = new DeleteGroupDto();
		deleteGroup.groupId = groupId;
		deleteGroup.email = header.email;

		return this.groupService.deleteGroup(deleteGroup);
	}
}
