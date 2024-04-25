import Comment from "@models/comment";
import { Op } from "sequelize";

export default class CommentRepo {
    constructor() {}

    getLastAnonymousCommentByPostId = async (postId: any) => {
        return await Comment.findOne({
            where: {
                postId: postId,
                author: { [Op.like]: "익명%" },
            },
            order: [["created_at", "DESC"]], // createdAt 기준으로 내림차순으로 정렬하여 가장 최근 댓글을 가져옴
        });
    };

    getCommentByID = async (commentId: any) => {
        return await Comment.findOne({
            where: {
                commentId: commentId,
            },
        });
    };

    getCommentByUserId = async (userId: any) => {
        return await Comment.findOne({
            where: {
                userId: userId,
            },
        });
    };

    getCommentWithReplies = async (postId: any) => {
        return await Comment.findAll({
            where: {
                postId: postId,
                parentId: null,
            },
            include: {
                model: Comment,
                as: "replies",
                required: false, // 왼쪽 조인 사용
            },
        });
    };

    updateComment = async (comment: Comment) => {
        const updatedComment = await Comment.update(
            {
                content: comment.content,
            },
            {
                where: {
                    commentId: comment.commentId,
                },
            }
        );
        if (updatedComment[0] === 1) {
            return comment;
        } else {
            throw new Error("cant update post");
        }
    };

    deleteComment = async (commentId: any) => {
        return await Comment.destroy({
            where: {
                commentId: commentId,
            },
        });
    };
}
