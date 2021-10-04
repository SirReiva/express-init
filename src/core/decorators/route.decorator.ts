import { ROUTING_METHODS } from '../constants';

type RouteOptions = {
	statusCode?: number;
};

export enum RequestMethod {
	GET = 'get',
	POST = 'post',
	PUT = 'put',
	DELETE = 'delete',
	PATCH = 'patch',
	OPTIONS = 'options',
	HEAD = 'head',
}

const defaultMetadata: RequestMappingMetadata = {
	path: '/',
	method: RequestMethod.GET,
};

export interface RequestMappingMetadata {
	path?: string;
	method?: RequestMethod;
	options?: RouteOptions;
}

export interface RequestMappingMethodMetadata {
	path?: string;
	method: RequestMethod;
	methodName: string | symbol;
	options?: RouteOptions;
}

export const RequestMapping = (
	metadata: RequestMappingMetadata = defaultMetadata
): MethodDecorator => {
	const pathMetadata = metadata.path;
	const path = pathMetadata && pathMetadata.length ? pathMetadata : '';
	const requestMethod: RequestMethod = metadata.method || RequestMethod.GET;
	return (
		target: object,
		key: string | symbol,
		descriptor: TypedPropertyDescriptor<any>
	) => {
		const routingMethods: RequestMappingMethodMetadata[] =
			Reflect.getMetadata(ROUTING_METHODS, target.constructor) || [];
		routingMethods.push({
			method: requestMethod,
			path,
			methodName: key,
			options: metadata.options,
		});
		Reflect.defineMetadata(ROUTING_METHODS, routingMethods, target.constructor);
		return descriptor;
	};
};

const createMappingDecorator =
	(method: RequestMethod) =>
	(path?: string, options?: RouteOptions): MethodDecorator => {
		return RequestMapping({
			path,
			method,
			options,
		});
	};

export const Post = createMappingDecorator(RequestMethod.POST);

export const Get = createMappingDecorator(RequestMethod.GET);

export const Delete = createMappingDecorator(RequestMethod.DELETE);

export const Put = createMappingDecorator(RequestMethod.PUT);

export const Patch = createMappingDecorator(RequestMethod.PATCH);

export const Options = createMappingDecorator(RequestMethod.OPTIONS);

export const Head = createMappingDecorator(RequestMethod.HEAD);
