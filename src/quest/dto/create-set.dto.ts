import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSetDto {
	@IsNumber()
	readonly studySetTime: number;
}
