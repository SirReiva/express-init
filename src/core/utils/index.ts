import { sign, verify, VerifyErrors } from 'jsonwebtoken';
import { RequestMethod } from '@Core/decorators/route.decorator';

export const getDefaultStatus = (method: RequestMethod) => {
	switch (method) {
		case RequestMethod.GET:
		case RequestMethod.PUT:
		case RequestMethod.PATCH:
		case RequestMethod.DELETE:
		case RequestMethod.OPTIONS:
		case RequestMethod.HEAD:
			return 200;
		case RequestMethod.POST:
			return 201;
		default:
			return 200;
	}
};

export const signJWT = (
	payload: Object,
	key: string,
	expiresIn?: string | number
): Promise<string> => {
	return new Promise((res, rej) => {
		sign(
			payload,
			key,
			{
				expiresIn,
			},
			(err: Error | null, encoded: string | undefined) => {
				if (err) return rej(err);
				res(encoded as string);
			}
		);
	});
};

export const verifyJWT = <T>(token: string, key: string): Promise<T> => {
	return new Promise((res, rej) => {
		verify(
			token,
			key,
			(err: VerifyErrors | null, decoded: any | undefined) => {
				if (err) return rej(err);
				res(decoded);
			}
		);
	});
};

export const isPromise = <T>(p: any): p is Promise<T> => {
	return p && Object.prototype.toString.call(p) === '[object Promise]';
};
