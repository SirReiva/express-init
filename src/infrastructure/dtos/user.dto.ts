import { IsEmail, IsString } from 'class-validator';

export class UserDTO {
	@IsString()
	@IsEmail()
	email: string;
	@IsString()
	name: string;
}
