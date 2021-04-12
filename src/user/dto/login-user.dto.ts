import { IsEmail, IsNotEmpty, IsString, Length} from "class-validator";

export class LoginUserDto {
	@IsString()
	@IsEmail()
	readonly email: string;

	@Length(8, 20)
	@IsNotEmpty()
	@IsString()
	readonly password: string;
}
