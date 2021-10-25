import { HttpError } from '@Core/error';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import type { RequestHandler } from 'express';

export const validationBodyMiddleware = <T extends ClassConstructor<T>>(
	type: T,
	options?: ValidatorOptions
): RequestHandler => {
	return (req, _res, next) => {
		const parsed = plainToClass(type, req.body);
		validate(parsed, options).then((errors: ValidationError[]) => {
			if (errors.length > 0) {
				next(
					new HttpError(
						400,
						errors.reduce(
							(prev, act) => ({
								...prev,
								[act.property]: act.constraints,
							}),
							{}
						),
						''
					)
				);
			} else {
				req.body = parsed;
				next();
			}
		});
	};
};
