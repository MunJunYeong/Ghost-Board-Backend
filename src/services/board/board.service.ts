import BoardRepo from "@repo/board.repo";
import * as dto from "@controllers/board/dto/board.dto";
import { ErrAlreadyExist, ErrNotFound } from "@errors/error-handler";
import { convCreateBoardToBoard } from "./board.conv";
import Board from "@models/board";
import { logger } from "@configs/logger";

export default class BoardService {
    private boardRepo: BoardRepo;

    constructor() {
        this.boardRepo = new BoardRepo();
    }

    createBoard = async (boardDTO: dto.CreateBoardReqDTO): Promise<Board> => {
        const board = convCreateBoardToBoard(boardDTO);

        if (await this.boardRepo.getBoardByTitle(boardDTO.title)) {
            logger.error(`already exist title (title : ${boardDTO.title})`);
            throw ErrAlreadyExist;
        }
        return await this.boardRepo.createBoard(board);
    };

    getBoardList = async (): Promise<Board[]> => {
        return await this.boardRepo.getBoardList();
    };

    getBoard = async (id: string): Promise<Board> => {
        const board = await this.boardRepo.getBoardByID(id);
        if (!board) {
            logger.error(`cant find board (board_id : ${id})`);
            throw ErrNotFound;
        }
        return board;
    };

    deleteBoard = async (id: string): Promise<Boolean> => {
        const result = await this.boardRepo.deleteBoard(id);
        if (result < 1) {
            throw ErrNotFound;
        }
        return true;
    };
}
