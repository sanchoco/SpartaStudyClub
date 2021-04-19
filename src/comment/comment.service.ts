import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupUser } from 'src/group/entities/groupUser.entity';
import { StudyGroup } from 'src/group/entities/studyGroup.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { DeleteCommentDto } from './dto/delete-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { WriteCommentDto } from './dto/write-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,

		@InjectRepository(StudyGroup)
		private readonly studyGroupRepository: Repository<StudyGroup>,

		@InjectRepository(GroupUser)
		private readonly groupUserRepository: Repository<GroupUser>,

		@InjectRepository(Comment)
		private readonly commentRepository: Repository<Comment>
	) {}

	// 그룹 게시글 작성
	async writeComment(writeCmt: WriteCommentDto) {
		const user: User = new User();
		user.email = writeCmt.email;

		const studyGroup: StudyGroup = new StudyGroup();
		studyGroup.groupId = writeCmt.groupId;

		// 닉네임 찾기
		return await this.userRepository
			.findOne({
				email: writeCmt.email
			})
			.then(async (findUser) => {
				user.nickname = findUser.nickname;

				// 글쓰기
				return await this.commentRepository
					.insert({
						user: user,
						studyGroup: studyGroup,
						cmtContents: writeCmt.cmtContents
					})
					.then(async (insertCmt) => {
						// 데이터 정재
						return await this.commentRepository
							.createQueryBuilder('c')
							.select('c.cmtId', 'cmtId')
							.addSelect('c.cmtContents', 'cmtContents')
							.addSelect('c.createdDt', 'createdDt')
							.addSelect('c.nickname', 'nickname')
							.innerJoin(User, 'u', 'u.nickname = c.nickname')
							.where('c.groupId = :groupId', {
								groupId: writeCmt.groupId
							})
							.andWhere('c.cmtId = :cmtId', {
								cmtId: insertCmt.identifiers[0]['cmtId']
							})
							.orderBy('c.createdDt', 'DESC')
							.getRawMany()
							.then((findData) => {
								return {
									msg: 'success',
									data: findData
								};
							})
							.catch((err) => {
								return { msg: 'fail' };
							});
					});
			});
	}

	// 그룹 게시글 수정
	async updateComment(updateCmt: UpdateCommentDto) {
		return await this.commentRepository
			.update(updateCmt.cmtId, {
				cmtContents: updateCmt.cmtContents
			})
			.then(() => {
				return {
					msg: 'success'
				};
			})
			.catch((err) => {
				return { msg: 'fail' };
			});
	}

	// 그룹 게시글 삭제
	async deleteComment(deleteCmt: DeleteCommentDto) {
		return await this.commentRepository
			.delete({
				cmtId: deleteCmt.cmtId
			})
			.then(async (del) => {
				if (del.affected > 0) {
					return { msg: 'success' };
				} else {
					return { msg: 'fail' };
				}
			})
			.catch((err) => {
				return { msg: 'fail' };
			});
	}
}
