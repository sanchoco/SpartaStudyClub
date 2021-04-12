import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CheckUserDto } from './dto/check-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('/email') //이메일 중복 확인
	checkEmail(@Body() user: CheckUserDto) {
		return this.userService.checkEmail(user);
	}
	@Post('/nickname') //닉네임 중복 확인
	checkNickname(@Body() user: CheckUserDto) {
		return this.userService.checkNickname(user);
	}

	@Post() //회원가입
	create(@Body() user: CreateUserDto) {
		return this.userService.createUser(user);
	}

	@Post('/auth') //로그인
	login(@Body() user: LoginUserDto) {
		return this.userService.loginUser(user);
	}
}
