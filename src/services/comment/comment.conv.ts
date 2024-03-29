import Comment from "@models/comment";

// TODO: type any 추후 수정
export const convCreateDtoToComment = (commentDTO: any, userId: any, postId: any, commentId: any | null) => {
    return new Comment({
        content: commentDTO.content,
        postId: postId,
        userId: userId,
        parentId: commentId,
    });
};
