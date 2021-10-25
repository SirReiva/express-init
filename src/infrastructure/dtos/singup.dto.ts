import { IsEmail, IsString, MinLength } from 'class-validator';

export class SingUpDTO {
	@IsString()
	name: string;
	@IsString()
	@IsEmail()
	email: string;
	@IsString()
	@MinLength(4)
	password: string;
}
