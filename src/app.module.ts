import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { QuestModule } from './quest/quest.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Quest } from 'src/quest/entities/quest.entity';
import { UserToday } from 'src/quest/entities/userToday.entity';
import { GroupController } from './group/group.controller';
import { GroupService } from './group/group.service';
import { GroupModule } from './group/group.module';
import { CommentController } from './comment/comment.controller';
import { CommentService } from './comment/comment.service';
import { CommentModule } from './comment/comment.module';
import { Group } from './group/entities/group.entity';
import { GroupUser } from './group/entities/groupUser.entity';
import { Comment } from './comment/entities/comment.entity';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		TypeOrmModule.forFeature([
			User,
			UserToday,
			Quest,
			Group,
			GroupUser,
			Comment
		]),
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: process.env.DB_HOST,
			port: 3306,
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: 'ssc',
			entities: [User, UserToday, Quest, Group, GroupUser, Comment],
			synchronize: true
		}),
		UserModule,
		QuestModule,
		GroupModule,
		CommentModule
	],
	controllers: [GroupController, CommentController],
	providers: [GroupService, CommentService]
})
export class AppModule {}
