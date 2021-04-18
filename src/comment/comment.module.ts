import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/middleware/AuthMiddleware';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { User } from 'src/user/entities/user.entity';
import { StudyGroup } from 'src/group/entities/studyGroup.entity';
import { Comment } from './entities/comment.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User, StudyGroup, Comment])],
	controllers: [CommentController],
	providers: [CommentService]
})
export class CommentModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes(CommentController);
	}
}
