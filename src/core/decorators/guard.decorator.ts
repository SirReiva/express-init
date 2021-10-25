import { injectable } from 'inversify';
import { OpenAPIV2 } from 'openapi-types';
import { PATH_PREFIX_METADATA } from '../constants';

export function Guard(
	data?: OpenAPIV2.SecurityRequirementObject
): ClassDecorator {
	return (target: any) => {
		injectable()(target);
		Reflect.defineMetadata(PATH_PREFIX_METADATA, data, target);
	};
}
