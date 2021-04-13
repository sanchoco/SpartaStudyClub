import { Module } from '@nestjs/common';
import { QuestService } from './quest.service';
import { QuestController } from './quest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Quest } from './entities/quest.entity';
import { UserToday } from './entities/userToday.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User, UserToday, Quest])],
	controllers: [QuestController],
	providers: [QuestService]
})
export class QuestModule {}
