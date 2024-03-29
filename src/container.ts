import { DI_IUseRepository } from '@Application/repository/user.repository';
import { UserCreator } from '@Application/user-creator.service';
import { UserFinder } from '@Application/user-finder.service';
import { UserList } from '@Application/user-list.service';
import { UserLogger } from '@Application/user-logger.service';
import { UserUpdater } from '@Application/user-updater.service';
import { UserController } from '@Infrastructure/controllers/user.controller';
import { UserMongoRepository } from '@Infrastructure/database/repository/user-mongo.repository';
import { JWTGuard } from '@Infrastructure/guards/jwt.guard';
import { Container } from 'inversify';

export const diContainer = new Container();

diContainer.bind(UserController).toSelf();
diContainer.bind(UserCreator).toSelf();
diContainer.bind(UserLogger).toSelf();
diContainer.bind(UserUpdater).toSelf();
diContainer.bind(UserList).toSelf();
diContainer.bind(UserFinder).toSelf();
diContainer.bind(JWTGuard).toSelf();
diContainer.bind(DI_IUseRepository).to(UserMongoRepository);
