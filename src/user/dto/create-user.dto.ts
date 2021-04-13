import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@IsEmail()
	readonly email: string;

	@Length(2, 20)
	@IsNotEmpty()
	@IsString()
	readonly nickname: string;

	@Length(8, 20)
	@IsNotEmpty()
	@IsString()
	password: string;
}
