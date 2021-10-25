import type { NextFunction, Request, Response } from 'express';

export interface Req<B = any, U = undefined, Q = any, P = any>
	extends Request<P, any, B, Q> {
	user: U;
}

export interface Res extends Response {}

export type ReqHandler = (req: Req, res: Res, next: NextFunction) => any;
