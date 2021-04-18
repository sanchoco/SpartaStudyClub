import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserToday } from 'src/quest/entities/userToday.entity';
import { StudyGroup } from 'src/group/entities/studyGroup.entity';
import { GroupUser } from 'src/group/entities/groupUser.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			User,
			UserToday,
			StudyGroup,
			GroupUser,
			Comment
		])
	],
	controllers: [UserController],
	providers: [UserService]
})
export class UserModule {}
