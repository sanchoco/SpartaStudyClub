import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
	@IsNotEmpty()
	@IsString()
	readonly nickname: string;

	@IsNotEmpty()
	@IsString()
	readonly message: string;

	@IsOptional()
	readonly date: Date;
}
