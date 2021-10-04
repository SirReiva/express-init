import { Container } from 'inversify';
import { TestController } from './infrastructure/controllers/test.controller';

export const diContainer = new Container();

diContainer.bind(TestController).toSelf();
