import Post from "@models/post";
import * as dto from "@controllers/post/dto/post.dto";

export const convToPost = (createReq: dto.CreatePostReqDTO, userId: number, boardId: number): Post => {
    return new Post({
        title: createReq.title,
        description: createReq.description,
        userId: userId,
        boardId: boardId,
    });
};
