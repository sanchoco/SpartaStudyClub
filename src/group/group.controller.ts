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
import { JoinGroupDto } from './dto/join-group.dto';
import { QuitGroupDto } from './dto/quit-group.dto';
import { GroupService } from './group.service';

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

	// 그룹 가입
	@Post(':groupId')
	joinGroup(@Param('groupId') groupId: string, @Headers() header: any) {
		const joinGroup = new JoinGroupDto();
		joinGroup.groupId = groupId;
		joinGroup.email = header.email;

		return this.groupService.joinGroup(joinGroup);
	}

	// 그룹 삭제
	@Delete('/:groupId')
	deleteGroup(@Param('groupId') groupId: string, @Headers() header: any) {
		const deleteGroup = new DeleteGroupDto();
		deleteGroup.groupId = groupId;
		deleteGroup.email = header.email;

		return this.groupService.deleteGroup(deleteGroup);
	}

	// 그룹 탈퇴
	@Delete('/:groupId/:email')
	quitGroup(
		@Param('groupId') groupId: string,
		@Param('email') email: string
	) {
		const quitGroup = new QuitGroupDto();
		quitGroup.groupId = groupId;
		quitGroup.email = email;

		return this.groupService.quitGroup(quitGroup);
	}
}
