import Board from "@models/board";
import BoardRepo from "@repo/board.repo";
import * as dto from "@controllers/board/dto/board.dto";
import { ErrNotFound } from "@errors/custom";

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
            const board = await this.boardRepo.findBoardByID(id);
            if (!board) {
                throw new Error(ErrNotFound);
            }
            return board
        } catch (err) {
            throw err
        }

    }

    deleteBoard = async (id: string) => {
        try {
            const result = await this.boardRepo.deleteBoard(id);
            return result > 0
        } catch (err) {
            throw err
        }

    }

    // TODO: Dto to conv 추가해야됨
    createBoard = async (boardDTO: dto.CreateBoardReqDTO) => {
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