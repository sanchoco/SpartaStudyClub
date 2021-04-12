import { IsEmail, IsOptional, IsString } from "class-validator";

export class CheckUserDto {
	@IsOptional()
	@IsString()
	@IsEmail()
	readonly email: string;

	@IsOptional()
	@IsString()
	readonly nickname: string;

}
