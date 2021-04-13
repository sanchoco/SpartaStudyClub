import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSetDto {
	@IsNumber()
	readonly time: number;
}
