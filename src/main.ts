import 'reflect-metadata';
import http, { Server } from 'http';
import express, { urlencoded, json } from 'express';
import cors from 'cors';
import { diContainer } from './container';
import { UserController } from './infrastructure/controllers/user.controller';
import { registerControllers } from '@Core/router';
import config from 'config';
import { connect, ConnectOptions } from 'mongoose';

const app = express();
const server: Server = http.createServer(app);

app.use(cors());

app.use(
	urlencoded({
		extended: true,
	})
);
app.use(json());

registerControllers(diContainer, app, UserController);

const dbOptions: ConnectOptions = {
	auth: {
		username: config.DB.USER,
		password: config.DB.PASSWORD,
	},
};

connect(config.DB.URL, dbOptions).then(() => {
	server.listen(3000, () => {
		console.log('Listen port 3000');
	});
});
