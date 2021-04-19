import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { QuestModule } from './quest/quest.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Quest } from 'src/quest/entities/quest.entity';
import { UserToday } from 'src/quest/entities/userToday.entity';
import { GroupModule } from './group/group.module';
import { CommentModule } from './comment/comment.module';
import { StudyGroup } from './group/entities/studyGroup.entity';
import { GroupUser } from './group/entities/groupUser.entity';
import { Comment } from './comment/entities/comment.entity';
import { ChatModule } from './chat/chat.module';
import { Chat } from './chat/entities/chat.entity';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		TypeOrmModule.forFeature([
			User,
			UserToday,
			Quest,
			StudyGroup,
			GroupUser,
			Comment,
			Chat
		]),
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: process.env.DB_HOST,
			port: 3306,
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: 'ssc',
			entities: [User, UserToday, Quest, StudyGroup, GroupUser, Comment, Chat],
			synchronize: true
		}),
		UserModule,
		QuestModule,
		GroupModule,
		CommentModule,
		ChatModule
	]
})
export class AppModule {}
