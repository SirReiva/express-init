import { Container } from 'inversify';
import { PATH_PREFIX_METADATA, ROUTING_METHODS } from './constants';
import { RequestMappingMethodMetadata } from './decorators/route.decorator';
import { Type } from './interfaces';
import { Express, NextFunction, Request, Response, Router } from 'express';

export const registerControllers = (
	diContainer: Container,
	appInstance: Express,
	...controllers: Type[]
) => {
	controllers.forEach(Controller => {
		const prefix: string =
			Reflect.getMetadata(PATH_PREFIX_METADATA, Controller) || '';

		const router = Router();

		const methodFunctions: RequestMappingMethodMetadata[] =
			Reflect.getMetadata(ROUTING_METHODS, Controller) || [];
		//DI resolve
		const instanceController = diContainer.resolve(Controller);

		for (const mtdFn of methodFunctions) {
			const { statusCode } = mtdFn.options || {};
			const { method, path = '/' } = mtdFn;

			router[method](path, async (req, res, next) => {
				try {
					if (statusCode) res.status(statusCode);
					const result = await instanceController[mtdFn.methodName](req, res);
					if (!res.headersSent) res.json(result);
				} catch (error) {
					next(error || 'Empty Error');
				}
			});
		}

		prefix ? appInstance.use(prefix, router) : appInstance.use(router);
	});
	appInstance.use(
		(error: any, _req: Request, res: Response, _next: NextFunction) => {
			res.status(500).send(error.toString());
		}
	);
};
