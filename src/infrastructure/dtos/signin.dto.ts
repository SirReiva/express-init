import { IsEmail, IsString, MinLength } from 'class-validator';

export class SingInDTO {
	@IsString()
	@IsEmail()
	email: string;
	@IsString()
	@MinLength(4)
	password: string;
}
