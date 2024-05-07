import Post from "@models/post/post";
import * as dto from "@controllers/post/dto/post.dto";
import File from "@models/file";
import { generateRandomName } from "@utils/random";

export const convToPost = (
    createReq: dto.CreatePostReqDTO,
    username: string,
    boardId: number,
    userId: number
): Post => {
    return new Post({
        title: createReq.title,
        content: createReq.content,
        // anonymous 값이 true일 때 랜덤 생성
        author: createReq.isAnonymous ? generateRandomName() : username,
        userId: userId,
        boardId: boardId,
    });
};

export const convToFile = (link: string, fileName: string): File => {
    return new File({
        // temp post_id
        postId: 0,
        link,
        fileName,
    });
};
