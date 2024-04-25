import Post from "@models/post";
import * as dto from "@controllers/post/dto/post.dto";
import File from "@models/file";
import { generateRandomName } from "@utils/random";

export const convToPost = (createReq: dto.CreatePostReqDTO, boardId: number, userId: number): Post => {
    return new Post({
        title: createReq.title,
        content: createReq.content,
        author :generateRandomName(),
        userId: userId,
        boardId: boardId,
    });
};

export const convToFile = (link: string, fileName: string): File => {
    return new File({
        // temp post_id
        postId: 0,
        link,
        fileName
    })
}