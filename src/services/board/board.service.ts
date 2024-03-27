import BoardRepo from "@repo/board.repo";
import * as dto from "@controllers/board/dto/board.dto";
import { ErrAlreadyExist, ErrNotFound } from "@errors/handler";
import { convCreateBoardToBoard } from "./board.conv";

export default class BoardService {
    private boardRepo: BoardRepo;

    constructor() {
        this.boardRepo = new BoardRepo();
    }

    getBoardList = async () => {
        try {
            return await this.boardRepo.getBoardList();
        } catch (err) {
            throw err
        }
    }

    getBoard = async (id: string) => {
        try {
            const board = await this.boardRepo.getBoardByID(id);
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
            if (result < 1) {
                throw new Error(ErrNotFound)
            }
            return true
        } catch (err) {
            throw err
        }
    }

    createBoard = async (boardDTO: dto.CreateBoardReqDTO) => {
        let board = convCreateBoardToBoard(boardDTO);

        try {
            if (await this.boardRepo.getBoardByTitle(boardDTO.title)) {
                throw new Error(ErrAlreadyExist)
            }
            return await this.boardRepo.createBoard(board);
        } catch (err) {
            throw err
        }
    }
}