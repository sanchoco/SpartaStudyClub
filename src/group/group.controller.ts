import { Body, Controller, Post, Headers, Get } from '@nestjs/common';
import { createGroupDto } from './dto/create-group.dto';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
	constructor(private readonly groupService: GroupService) {}

	@Get()
	getGroup(@Headers() header: any) {
		return this.groupService.getGroup(header.email);
	}

	@Post()
	createGroup(@Body() createGroup: createGroupDto, @Headers() header: any) {
		return this.groupService.createGroup(createGroup, header.email);
	}
}
