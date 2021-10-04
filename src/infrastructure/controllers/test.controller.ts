import { Controller } from '../../core/decorators/controller.decorator';
import { Get } from '../../core/decorators/route.decorator';

@Controller('/test')
export class TestController {
	@Get()
	index() {
		throw 'Zas';
	}
}
