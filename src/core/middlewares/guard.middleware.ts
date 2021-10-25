import { HttpError } from '@Core/error';
import { IGuard } from '@Core/interfaces/guard.interface';
import { Req, Res } from '@Core/interfaces/router.interfaces';
import { NextFunction } from 'express';

export const guardMiddleware =
	(...guards: IGuard[]) =>
	async (req: Req, res: Res, next: NextFunction) => {
		try {
			for (const guard of guards) {
				const result = await guard.check(req, res);
				if (result === false) throw new HttpError(401, null, '');
			}
		} catch (error) {
			next(error);
		}
	};
