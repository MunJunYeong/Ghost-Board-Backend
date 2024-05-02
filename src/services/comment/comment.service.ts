import { ErrAlreadyExist, ErrInvalidArgument, ErrNotFound } from "@errors/error-handler";
import { logger } from "@configs/logger";
import * as dto from "@controllers/comment/dto/comment.dto";
import { convCreateDtoToComment } from "./comment.conv";
import CommentRepo from "@repo/comment/comment.repo";
import UserRepo from "@repo/user.repo";
import PostRepo from "@repo/post/post.repo";
import CommentLikeRepo from "@repo/comment/comment_like.repo";
import CommentReportRepo from "@repo/comment/comment_report.repo";

export default class CommentService {
    private userRepo: UserRepo;
    private postRepo: PostRepo;
    private commentRepo: CommentRepo;
    private commentLikeRepo: CommentLikeRepo;
    private commentReportRepo: CommentReportRepo;

    constructor() {
        this.userRepo = new UserRepo();
        this.postRepo = new PostRepo();
        this.commentRepo = new CommentRepo();
        this.commentLikeRepo = new CommentLikeRepo();
        this.commentReportRepo = new CommentReportRepo();
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
                    const previousComment = await this.commentRepo.getLastAnonymousCommentByPostId(postId);
                    const anonymousNumber = previousComment
                        ? parseInt(previousComment.author.replace("익명", "")) + 1
                        : 1; // 처음 댓글 시 1로 시작
                    author = `익명${anonymousNumber}`;
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // like
    getCommentLikeCount = async (commentId: any) => {
        // validation comment
        if (!(await this.commentRepo.getCommentByID(commentId))) {
            logger.error(`cant find comment (comment_id : ${commentId})`);
            throw ErrNotFound;
        }
        return await this.commentLikeRepo.getCommentLikeCount(commentId);
    };

    createCommentLike = async (commentId: any, userId: any) => {
        // validation comment
        if (!(await this.commentRepo.getCommentByID(commentId))) {
            logger.error(`cant find comment (comment_id : ${commentId})`);
            throw ErrNotFound;
        }

        // 중복 like check
        if (await this.commentLikeRepo.getCommentLike(commentId, userId)) {
            logger.error(`Is alreay exist comment_like`);
            throw ErrAlreadyExist;
        }

        await this.commentLikeRepo.createCommentLike(commentId, userId);
        return true;
    };

    deleteCommentLike = async (commentId: any, userId: any) => {
        // validation comment
        if (!(await this.commentRepo.getCommentByID(commentId))) {
            logger.error(`cant find comment (comment_id : ${commentId})`);
            throw ErrNotFound;
        }

        await this.commentLikeRepo.deleteCommentLike(commentId, userId);
        return true;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // comment_report
    createPostReport = async (commentId: any, userId: any, reason: string) => {
        // validation comment
        const comment = await this.commentRepo.getCommentByID(commentId);
        if (!comment) {
            logger.error(`cant find comment (comment_id : ${commentId})`);
            throw ErrNotFound;
        }

        // 중복 report check
        if (await this.commentReportRepo.getCommentReport(commentId, userId)) {
            logger.error(`Is alreay exist comment_report`);
            throw ErrAlreadyExist;
        }

        await this.commentReportRepo.createCommentReport(commentId, userId, reason);

        // 해당 댓글의 신고가 10건 이상일 경우 비활성화
        const count = await this.commentReportRepo.getCommentReportCount(commentId);
        if (count >= 10) {
            comment.activate = false;
            await this.commentRepo.updateComment(comment);
        }
        return true;
    };
}
