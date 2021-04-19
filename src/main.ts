import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true });
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true
		})
	);
	app.useWebSocketAdapter(new WsAdapter(app));
	await app.listen(3000);
}
bootstrap();
