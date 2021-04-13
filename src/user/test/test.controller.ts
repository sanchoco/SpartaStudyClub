import { Controller, Get, Headers } from '@nestjs/common';

@Controller('test')
export class TestController {
	@Get()
	authTest(@Headers() header: any) {
		return { msg: `인증된 기능 사용, ${header.email}` };
	}
}
