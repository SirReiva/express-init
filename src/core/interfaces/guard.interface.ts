import { Req, Res } from './router.interfaces';

export interface IGuard {
	check(req: Req, res: Res): boolean | Promise<boolean>;
}
