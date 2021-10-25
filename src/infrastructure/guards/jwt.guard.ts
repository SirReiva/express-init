import config from '@Config';
import { Guard } from '@Core/decorators';
import { IGuard } from '@Core/interfaces/guard.interface';
import { Req } from '@Core/interfaces/router.interfaces';
import { verifyJWT } from '@Core/utils';

@Guard()
export class JWTGuard implements IGuard {
	async check(req: Req<void, any>) {
		const token = req.headers.authorization;
		if (!token) return false;
		try {
			req.user = await verifyJWT(token, config.JWTSECRET);
			return true;
		} catch {
			return false;
		}
	}
}
