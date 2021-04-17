import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/middleware/AuthMiddleware';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { User } from 'src/user/entities/user.entity';
import { Group } from './entities/group.entity';
import { GroupUser } from './entities/groupUser.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User, Group, GroupUser, Comment])],
	controllers: [GroupController],
	providers: [GroupService]
})
export class GroupModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes(GroupController);
	}
}
