import Comment from "@models/comment";
import { Sequelize } from "sequelize";

export default class CommentRepo {
    constructor() {}

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
            },
            include: {
                model: Comment,
                as: "replies",
                where: {
                    parentId: Sequelize.col("Comment.commentId"),
                },
                required: false, // false -> using left join
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
