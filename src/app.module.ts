import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { QuestModule } from './quest/quest.module';

@Module({
	imports: [
		UserModule,
		QuestModule
	]
})
export class AppModule {}
