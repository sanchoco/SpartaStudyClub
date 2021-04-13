import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from 'src/middleware/AuthMiddleware';
import { TestController } from './test/test.controller';


@Module({
	imports: [
		ConfigModule.forRoot(),
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: process.env.DB_HOST,
			port: 3306,
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: 'ssc',
			entities: [User],
			synchronize: true
		})
	],
	controllers: [UserController, TestController],
	providers: [UserService]
})
export class UserModule implements NestModule{
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes(TestController);
	}
}
