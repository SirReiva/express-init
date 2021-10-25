import { PATH_PREFIX_METADATA, ROUTING_METHODS } from '@Core/constants';
import {
	BodyRouteOptions,
	RequestMappingMethodMetadata,
} from '@Core/decorators/route.decorator';
import { HttpError } from '@Core/error';
import {
	validationBodyMiddleware,
	validationQueryParamsMiddleware,
} from '@Core/middlewares';
import { getDefaultStatus } from '@Core/utils';
import { ClassConstructor } from 'class-transformer';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import {
	Application,
	NextFunction,
	Request,
	RequestHandler,
	Response,
	Router,
} from 'express';
import { Container } from 'inversify';
import { OpenAPIV2 } from 'openapi-types';
import { SchemaObject } from 'openapi3-ts';
import { serve, setup } from 'swagger-ui-express';

export const registerControllers = (
	diContainer: Container,
	appInstance: Application,
	...controllers: ClassConstructor<any>[]
) => {
	const { schemas, swaggerDocument } = initializeSwaggerData();

	controllers
		.map(Controller =>
			registerRouteController(
				Controller,
				diContainer,
				swaggerDocument,
				schemas
			)
		)
		.forEach(({ prefix, router }) =>
			prefix ? appInstance.use(prefix, router) : appInstance.use(router)
		);

	console.log(schemas);
	// console.log(JSON.stringify(swaggerDocument, null, 4));
	appInstance.use('/api-docs', serve);
	appInstance.get('/api-docs', setup(swaggerDocument));

	appInstance.use(
		(error: any, _req: Request, res: Response, _next: NextFunction) => {
			if (error instanceof HttpError)
				return res.status(error.status).json(error.data);
			res.status(500).send(error.toString());
		}
	);
};

const initializeSwaggerData = (): {
	schemas: Record<string, SchemaObject>;
	swaggerDocument: OpenAPIV2.Document;
} => ({
	schemas: validationMetadatasToSchemas(),
	swaggerDocument: {
		swagger: '2.0',
		info: {
			description: 'This is a sample ',
			version: '1.0.0',
			title: 'Swagger Test',
		},
		paths: {},
	},
});

const registerRouteController = (
	Controller: ClassConstructor<any>,
	diContainer: Container,
	swaggerDocument: OpenAPIV2.Document,
	schemas: Record<string, SchemaObject>
): {
	prefix: string;
	router: Router;
} => {
	const prefix: string =
		Reflect.getMetadata(PATH_PREFIX_METADATA, Controller) || '';

	const router = Router();

	const methodFunctions: RequestMappingMethodMetadata[] =
		Reflect.getMetadata(ROUTING_METHODS, Controller) || [];

	const instanceController = diContainer.resolve(Controller);

	methodFunctions.forEach(mtdFn =>
		registerMethodControler(
			prefix,
			mtdFn,
			instanceController,
			router,
			swaggerDocument,
			schemas
		)
	);

	return {
		prefix,
		router,
	};
};

const registerMethodControler = (
	prefix: string,
	mtdFn: RequestMappingMethodMetadata,
	instanceController: any,
	router: Router,
	swaggerDocument: OpenAPIV2.Document,
	schemas: Record<string, SchemaObject>
): void => {
	const { method, path = '/' } = mtdFn;
	const {
		statusCode = getDefaultStatus(method),
		body,
		queryParams,
		responses = {},
	} = (mtdFn.options || {}) as BodyRouteOptions;

	const pipes: RequestHandler[] = [];
	const parameters: OpenAPIV2.Parameters = [];

	if (body) {
		parameters.push({
			in: 'body',
			schema: schemas[body.name],
			name: body.name,
			type: 'object',
		});
		pipes.push(validationBodyMiddleware(body));
	}

	if (queryParams) {
		parameters.push(
			...(
				Object.entries(schemas[queryParams.name]?.properties || {}) as [
					string,
					OpenAPIV2.SchemaObject
				][]
			).map(([key, value]) => ({
				type: value.type as string,
				in: 'query',
				name: key,
				required: schemas[queryParams.name].required?.includes(key),
			}))
		);
		pipes.push(validationQueryParamsMiddleware(queryParams));
	}

	pipes.push(async (req, res, next) => {
		try {
			if (statusCode) res.status(statusCode);
			const result = await instanceController[mtdFn.methodName](req, res);
			if (!res.headersSent) {
				if (result) return res.json(result);
				res.end();
			}
		} catch (error) {
			next(error || 'Empty Error');
		}
	});

	router[method](path, ...pipes);

	const swResponses: OpenAPIV2.ResponsesObject = {};
	for (const statusCodeRes in responses) {
		swResponses[statusCodeRes] = {
			description: '',
			schema: schemas[responses[statusCodeRes].name] as OpenAPIV2.Schema,
		};
	}

	if (!swaggerDocument.paths[prefix + path])
		swaggerDocument.paths[prefix + path] = {};
	swaggerDocument.paths[prefix + path][method] = {
		summary: mtdFn.methodName.toString(),
		parameters,
		responses: swResponses,
	};
};
