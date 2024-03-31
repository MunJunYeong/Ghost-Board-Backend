import Comment from "@models/comment";
import { Op, Sequelize } from "sequelize";

export default class CommentRepo {
    constructor() { }

    createComment = async (comment: Comment) => {
        return await Comment.create({
            content: comment.content,
            userId: comment.userId,
            postId: comment.postId,
            // 대댓글이 아니라면 null
            parentId: comment.parentId,
        });
    };

    getCommentByID = async (commentId: any) => {
        return await Comment.findOne({
            where: {
                commentId: commentId,
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
                required: false // 왼쪽 조인 사용
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
