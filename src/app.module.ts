import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { QuestModule } from './quest/quest.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Quest } from 'src/quest/entities/quest.entity';
import { UserToday } from 'src/quest/entities/userToday.entity';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		TypeOrmModule.forFeature([User, UserToday, Quest]),
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: process.env.DB_HOST,
			port: 3306,
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: 'ssc',
			entities: [User, UserToday, Quest],
			synchronize: true
		}),
		UserModule,
		QuestModule
	]
})
export class AppModule {}
