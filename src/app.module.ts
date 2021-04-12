import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { QuestModule } from './quest/quest.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		UserModule,
		QuestModule
	]
})
export class AppModule {}
