import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserToday } from 'src/quest/entities/userToday.entity';


@Module({
	imports: [TypeOrmModule.forFeature([User, UserToday])],
	controllers: [UserController],
	providers: [UserService]
})
export class UserModule{}
