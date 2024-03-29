import { UserFinder } from '@Application/user-finder.service';
import { UserList } from '@Application/user-list.service';
import { UserLogger } from '@Application/user-logger.service';
import { UserUpdater } from '@Application/user-updater.service';
import config from '@Config';
import { Controller, Get, Patch, Post } from '@Core/decorators';
import { Req } from '@Core/interfaces/router.interfaces';
import { signJWT } from '@Core/utils';
import { IdParamDTO } from '@Infrastructure/dtos/id-param.dto';
import { LoginDTO } from '@Infrastructure/dtos/login.dto';
import { PaginatedQueryDTO } from '@Infrastructure/dtos/paginated-query.dto';
import { PaginatedUserResponseDTO } from '@Infrastructure/dtos/paginated-response';
import { SingInDTO } from '@Infrastructure/dtos/signin.dto';
import { UpdateUserDTO } from '@Infrastructure/dtos/update-user.dto';
import { UserDTO } from '@Infrastructure/dtos/user.dto';
import { JWTGuard } from '@Infrastructure/guards/jwt.guard';
import { UserCreator } from 'application/user-creator.service';
import { SingUpDTO } from 'infrastructure/dtos/singup.dto';

@Controller('/user')
export class UserController {
	constructor(
		private readonly userCreator: UserCreator,
		private readonly userLogger: UserLogger,
		private readonly userUpdater: UserUpdater,
		private readonly userFinder: UserFinder,
		private readonly userList: UserList
	) {}

	@Post('/signup', {
		body: SingUpDTO,
	})
	async singup(req: Req<SingUpDTO>) {
		const { email, name, password } = req.body;
		await this.userCreator.execute(name, email, password);
	}

	@Post('/signin', {
		body: SingInDTO,
		responses: {
			201: LoginDTO,
		},
	})
	async singin(req: Req<SingInDTO>): Promise<LoginDTO> {
		const { email, password } = req.body;
		const id = await this.userLogger.execute(email, password);

		return {
			token: await signJWT(
				{ id },
				config.JWTSECRET,
				config.JWT_EXPIRATION
			),
		};
	}

	@Patch('', {
		body: UpdateUserDTO,
	})
	async update(req: Req<UpdateUserDTO, string>) {
		await this.userUpdater.execute(req.user, req.body.name);
	}

	@Get('', {
		guards: [JWTGuard],
		queryParams: PaginatedQueryDTO,
		responses: {
			200: PaginatedUserResponseDTO,
		},
	})
	getPaginated(req: Req<void, void, PaginatedQueryDTO>) {
		const { page, size } = req.query;
		return this.userList.execute(page, size);
	}

	@Get('/:id', {
		params: IdParamDTO,
		responses: {
			200: UserDTO,
		},
	})
	getUserPosts(req: Req<void, void, void, { id: string }>) {
		return this.userFinder.execute(req.params.id);
	}
}
