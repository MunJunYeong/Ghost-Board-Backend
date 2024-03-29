import Comment from "@models/comment";
import * as dto from "@controllers/comment/dto/comment.dto";

export const convCreateDtoToComment = (commentDTO: dto.CreateCommentReqDTO, userId: any, postId: any) => {
    return new Comment({
        content: commentDTO.content,
        postId: postId,
        userId: userId,
        parentId: commentDTO.parentCommentId,
    });
};
