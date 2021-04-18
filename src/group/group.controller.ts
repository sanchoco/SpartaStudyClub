import { Body, Controller, Post, Headers, Get, Param } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { JoinGroupDto } from './dto/join-group.dto';
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
}
