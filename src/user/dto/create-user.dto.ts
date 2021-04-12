import { IsEmail, IsString, Matches } from "class-validator";

export class CreateUserDto {
	@IsString()
	@IsEmail()
	readonly email: string;

	@IsString()
	readonly nickname: string;

	@IsString()
	readonly password: string;
}
