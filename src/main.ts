import 'reflect-metadata';
import http, { Server } from 'http';
import express, { urlencoded, json } from 'express';
import cors from 'cors';
import { registerControllers } from './core';
import { diContainer } from './container';
import { TestController } from './infrastructure/controllers/test.controller';

const app = express();
const server: Server = http.createServer(app);

app.use(cors());

app.use(
	urlencoded({
		extended: true,
	})
);
app.use(json());

registerControllers(diContainer, app, TestController);

server.listen(3000, () => {
	console.log('Listen port 3000');
});
