import { ClassConstructor } from 'class-transformer';
import { ROUTING_METHODS } from '../constants';

export type RouteOptions = {
	statusCode?: number;
	queryParams?: ClassConstructor<any>;
	responses?: Record<number, ClassConstructor<any>>;
};

export type BodyRouteOptions = RouteOptions & {
	body?: ClassConstructor<any>;
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
	options?: RouteOptions | BodyRouteOptions;
}

export interface RequestMappingMethodMetadata {
	path?: string;
	method: RequestMethod;
	methodName: string | symbol;
	options?: RouteOptions | BodyRouteOptions;
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
		Reflect.defineMetadata(
			ROUTING_METHODS,
			routingMethods,
			target.constructor
		);
		return descriptor;
	};
};

const createMappingDecorator =
	<T extends RouteOptions | BodyRouteOptions>(method: RequestMethod) =>
	(path?: string, options?: T): MethodDecorator => {
		return RequestMapping({
			path,
			method,
			options,
		});
	};

export const Post = createMappingDecorator<BodyRouteOptions>(
	RequestMethod.POST
);

export const Get = createMappingDecorator<RouteOptions>(RequestMethod.GET);

export const Delete = createMappingDecorator<BodyRouteOptions>(
	RequestMethod.DELETE
);

export const Put = createMappingDecorator<BodyRouteOptions>(RequestMethod.PUT);

export const Patch = createMappingDecorator<BodyRouteOptions>(
	RequestMethod.PATCH
);

export const Options = createMappingDecorator<RouteOptions>(
	RequestMethod.OPTIONS
);

export const Head = createMappingDecorator<RouteOptions>(RequestMethod.HEAD);
