import { ErrAlreadyExist, ErrNotFound } from "@errors/error-handler";
import { logger } from "@configs/logger";
import * as dto from "@controllers/post/dto/post.dto";
import Post from "@models/post/post";
import PostRepo from "@repo/post/post.repo";
import UserRepo from "@repo/user.repo";
import BoardRepo from "@repo/board.repo";
import { convToFile, convToPost } from "./post.conv";
import PostLikeRepo from "@repo/post/post_like.repo";
import PostReportRepo from "@repo/post/post_report.repo";
import { PaginationReqDTO } from "@controllers/common.dto";
import { Op } from "sequelize";

export default class PostService {
    private userRepo: UserRepo;
    private boardRepo: BoardRepo;
    private postRepo: PostRepo;
    private postLikeRepo: PostLikeRepo;
    private postReportRepo: PostReportRepo;

    constructor() {
        this.userRepo = new UserRepo();
        this.boardRepo = new BoardRepo();
        this.postRepo = new PostRepo();
        this.postLikeRepo = new PostLikeRepo();
        this.postReportRepo = new PostReportRepo();
    }

    createPost = async (postData: dto.CreatePostReqDTO, boardId: any, userId: any) => {
        // exist board check
        if (!(await this.boardRepo.getBoardByID(boardId))) {
            logger.error(`cant find board data (id - ${boardId})`);
            throw ErrNotFound;
        }
        // exist user check
        const user = await this.userRepo.getUserByPkID(userId);
        if (!user) {
            logger.error(`cant find user data (id - ${userId})`);
            throw ErrNotFound;
        }

        const post = convToPost(postData, user.username, boardId, userId);
        if (postData.image) {
            const { location, key } = postData.image;
            const file = convToFile(location, key);
            return await this.postRepo.createPostWithFile(post, file);
        }
        // image가 없을 경우
        return await this.postRepo.createPost(post);
    };

    getPostList = async (boardId: any, postId: any | undefined) => {
        // exist board check
        if (!(await this.boardRepo.getBoardByID(boardId))) {
            logger.error(`cant find board data (id - ${boardId})`);
            throw ErrNotFound;
        }

        let posts: Post[];
        if (postId) {
            posts = await this.postRepo.getPostListAfterCursor(boardId, postId);
        } else {
            posts = await this.postRepo.getPostList(boardId);
        }

        const postList: dto.GetPostResDTO[] = [];
        for (const post of posts) {
            const likeCount = await this.postLikeRepo.getPostLikeCount(post.postId);
            postList.push({ post: post, likedCount: likeCount });
        }

        let nextCursor: number = 0;
        if (postList.length > 0) {
            nextCursor = postList[postList.length - 1].post.postId;
        }

        return { posts: postList, nextCursor };
    };

    // deactivate상태의 post list - admin 기능
    getDeactivatePostList = async (pagination: PaginationReqDTO) => {
        const whereClause = {
            activate: false,
            title: { [Op.like]: `%${pagination.search}%` },
        };
        return await this.postRepo.getPostListOffset(pagination, whereClause);
    };

    // 본인이 쓴 게시글 확인
    getPostListByUser = async (userId: any, pagination: PaginationReqDTO) => {
        if (!(await this.userRepo.getUserByPkID(userId))) {
            logger.error(`cant find user (pk user_id - ${userId}`);
            throw ErrNotFound;
        }

        const whereClause = {
            userId: userId,
            title: { [Op.like]: `%${pagination.search}%` },
        };
        const result = await this.postRepo.getPostListOffset(pagination, whereClause);
        return result;
    };

    getPost = async (userId: any, postId: any): Promise<dto.GetPostResDTO> => {
        const post = await this.postRepo.getPost(postId);
        if (!post) {
            logger.error(`cant find post data (post_id - ${postId})`);
            throw ErrNotFound;
        }

        let isUserLiked = false;
        if (await this.postLikeRepo.getPostLike(userId, postId)) {
            // 사용자가 like 눌렀을 경우 true로 변경
            isUserLiked = true;
        }

        const likeCount = await this.postLikeRepo.getPostLikeCount(postId);

        const result: dto.GetPostResDTO = {
            post: post,
            liked: isUserLiked,
            likedCount: likeCount,
        };
        return result;
    };

    updatePost = async (postData: dto.UpdatePostReqDTO, postId: any): Promise<Post> => {
        let p = await this.postRepo.getPost(postId);
        if (!p) {
            logger.error(`cant find post data (post_id - ${postId})`);
            throw ErrNotFound;
        }

        if (postData.title) {
            p.title = postData.title;
        }
        if (postData.content) {
            p.content = postData.content;
        }

        return await this.postRepo.updatePost(p);
    };

    deletePost = async (postId: any): Promise<Boolean> => {
        const result = await this.postRepo.deletePost(postId);
        if (result < 1) {
            throw ErrNotFound;
        }
        return true;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // post_like
    getPostLikeCount = async (postId: any) => {
        // validation post
        if (!(await this.postRepo.getPost(postId))) {
            logger.error(`cant find post (post_id : ${postId})`);
            throw ErrNotFound;
        }
        return await this.postLikeRepo.getPostLikeCount(postId);
    };

    createPostLike = async (postId: any, userId: any) => {
        // validation post
        if (!(await this.postRepo.getPost(postId))) {
            logger.error(`cant find post (post_id : ${postId})`);
            throw ErrNotFound;
        }

        // 중복 like check
        if (await this.postLikeRepo.getPostLike(userId, postId)) {
            logger.error(`Is alreay exist post_like`);
            throw ErrAlreadyExist;
        }

        await this.postLikeRepo.createPostLike(postId, userId);
        return true;
    };

    deletePostLike = async (postId: any, userId: any) => {
        // validation post
        if (!(await this.postRepo.getPost(postId))) {
            logger.error(`cant find post (post_id : ${postId})`);
            throw ErrNotFound;
        }

        await this.postLikeRepo.deletePostLike(postId, userId);
        return true;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // post_report
    createPostReport = async (postId: any, userId: any, reason: string) => {
        // validation post
        const post = await this.postRepo.getPost(postId);
        if (!post) {
            logger.error(`cant find post (post_id : ${postId})`);
            throw ErrNotFound;
        }

        // 중복 report check
        if (await this.postReportRepo.getPostReport(postId, userId)) {
            logger.error(`Is alreay exist post_report`);
            throw ErrAlreadyExist;
        }

        await this.postReportRepo.createPostReport(postId, userId, reason);

        // 중요 로직 - 해당 Post의 신고가 누적 10건이라면 해당 Post의 `activate`를 false로 비활성화 시켜버림
        const count = await this.postReportRepo.getPostReportCount(postId);
        if (count >= 10) {
            post.activate = false;
            await this.postRepo.updatePost(post);
        }

        return true;
    };
}
