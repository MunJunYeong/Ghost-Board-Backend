import Board from "@models/board";
import BoardRepo from "@repo/board.repo";

export default class BoardService {
    private boardRepo: BoardRepo;

    constructor() {
        this.boardRepo = new BoardRepo();
    }

    getBoardList = async () => {
        try {
            return await this.boardRepo.findBoards();
        } catch (err) {
            throw err
        }
    }

    getBoard = async (id: string) => {
        try {
            // TODO: board id 존재 여부 체크

            return await this.boardRepo.findBoardByID(id);
        } catch (err) {
            throw err
        }

    }

    deleteBoard = async (id: string) => {
        try {
            // TODO: board id 존재 여부 체크

            return await this.boardRepo.deleteBoard(id);
        } catch (err) {
            throw err
        }

    }

    // TODO: Dto to conv 추가해야됨
    createBoard = async (boardDTO: any) => {
        // DTO to model 추가
        let board: Board = new Board()

        try {
            // TODO: board title 중복 체크

            return await this.boardRepo.createBoard(board);
        } catch (err) {
            throw err
        }
    }
}