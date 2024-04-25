import { ErrInvalidArgument, ErrNotFound } from "@errors/handler";
import { logger } from "@configs/logger";
import * as dto from "@controllers/comment/dto/comment.dto";
import { convCreateDtoToComment } from "./comment.conv";
import CommentRepo from "@repo/comment.repo";
import UserRepo from "@repo/user.repo";
import PostRepo from "@repo/post.repo";

export default class CommentService {
    private userRepo: UserRepo;
    private postRepo: PostRepo;
    private commentRepo: CommentRepo;

    constructor() {
        this.userRepo = new UserRepo();
        this.postRepo = new PostRepo();
        this.commentRepo = new CommentRepo();
    }

    createComment = async (commentDTO: dto.CreateCommentReqDTO, userId: any, postId: any) => {
        const post = await this.postRepo.getPostByID(postId);
        // validation check
        {
            // 유효한 user, post인지 확인
            if (!(await this.userRepo.getUserByPkID(userId)) || !post) {
                throw ErrInvalidArgument;
            }

            // 대댓글의 경우 parent comment가 유효한 comment인지 확인
            if (commentDTO.parentCommentId) {
                if (!(await this.commentRepo.getCommentByID(commentDTO.parentCommentId))) {
                    throw ErrInvalidArgument;
                }
            }
        }

        // 댓글 author 설정
        let author: string;
        {
            // 1. 작성자인지 확인
            if (post.userId === userId) {
                author = "작성자";
            } else {
                // 2. 이전에 작성했는지 확인
                const userComment = await this.commentRepo.getCommentByUserId(userId);
                if (userComment) {
                    author = userComment.author;
                } else {
                    // 3. `익명{next_number}`로 이름 배정
                    const previousComment = await this.commentRepo.getLastAnonymousCommentByPostId(userId);
                    if (previousComment) {
                        const anonymousNumber = parseInt(previousComment.author.replace("익명", ""));
                        author = `익명${anonymousNumber + 1}`;
                    } else {
                        author = "익명1";
                    }
                }
            }
        }

        const newComment = convCreateDtoToComment(commentDTO, userId, postId, author);

        return await newComment.save();
    };

    getCommentWithReplies = async (postId: any) => {
        if (!(await this.postRepo.getPostByID(postId))) {
            throw ErrInvalidArgument;
        }

        return await this.commentRepo.getCommentWithReplies(postId);
    };

    updateComment = async (content: string, commentId: any) => {
        const c = await this.commentRepo.getCommentByID(commentId);
        if (!c) {
            logger.error(`cant find comment (comment_id : ${commentId})`);
            throw ErrNotFound;
        }
        c.content = content;
        return await this.commentRepo.updateComment(c);
    };

    deleteComment = async (commentId: any) => {
        const result = await this.commentRepo.deleteComment(commentId);
        if (result < 1) {
            throw ErrNotFound;
        }
        return true;
    };
}
