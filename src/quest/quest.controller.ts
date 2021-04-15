import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Headers,
	Query
} from '@nestjs/common';
import { QuestService } from './quest.service';
import { CreateSetDto } from './dto/create-set.dto';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { DeleteQuestDto } from './dto/delete-quest.dto';

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

@Controller('quest')
export class QuestController {
	constructor(private readonly questService: QuestService) {}

	@Get()
	getData(@Headers() header: any) {
		const ymd = getToday();
		return this.questService.getData(ymd, header.email);
	}

	@Get('calendar')
	getCalendar(
		@Query('year') year: string,
		@Query('month') month: string,
		@Headers() header: any
	) {
		month = ('0' + parseInt(month)).slice(-2);
		const toDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
		let fromDate = new Date();
		fromDate.setMonth(toDate.getMonth() - 1);
		fromDate.setDate(1);
		return this.questService.getCalendar(fromDate, toDate, header.email);
	}

	// 공부 시간 설정
	@Post('time')
	setStudyTime(@Body() createSetDto: CreateSetDto, @Headers() header: any) {
		const ymd = getToday();
		console.log(ymd);
		return this.questService.setStudyTime(createSetDto, ymd, header.email);
	}

	// 할 일 생성
	@Post()
	setQuest(@Body() createQuestDto: CreateQuestDto) {
		return this.questService.createQuest(createQuestDto);
	}

	// 할 일 상태 변경
	@Patch()
	setQuestYn(@Body() updateQuestDto: UpdateQuestDto) {
		return this.questService.setQuestYn(updateQuestDto);
	}

	// 할 일 삭제(param으로 받기, 이건 좀 위험하다. 그냥 바디로 받자)
	@Delete()
	deleteQuest(@Body() deleteQuestDto: DeleteQuestDto) {
		return this.questService.deleteQuest(deleteQuestDto);
	}
}
