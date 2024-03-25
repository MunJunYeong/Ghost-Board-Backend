import { Request, Response } from "express";

import BoardService from "@services/board/board.service";
import * as dto from "@controllers/board/dto/board.dto";
import InternalError from "@errors/internal_server";

export default class BoardController {
    private boardService: BoardService;

    constructor() {
        this.boardService = new BoardService()
    }

    getBoardList = async (req: Request, res: Response) => {
        try {
            const boards = await this.boardService.getBoardList();
            const boardsJSON = boards.map(board => board.toJSON());
            res.json({ message: `success get boards`, data: boardsJSON })
        } catch (err: any) {
            throw new InternalError({ error: err })
        }
    }

    getBoard = async (req: Request, res: Response) => {
        const boardId = req.params.id;
        try {
            const board = await this.boardService.getBoard(boardId);
            res.json({ message: `success delete board`, data: board.toJSON() })
        } catch (err: any) {
            throw new InternalError({ error: err })
        }
    }

    deleteBoard = async (req: Request, res: Response) => {
        const boardId = req.params.id;
        try {
            await this.boardService.deleteBoard(boardId);
            res.json({ message: `success delete board`, data: true })
        } catch (err: any) {
            throw new InternalError({ error: err })
        }
    }

    createBoard = async (req: Request, res: Response) => {
        const body: dto.CreateBoardReqDTO = req.body;
        try {
            const board = await this.boardService.createBoard(body)
            res.json({ message: `success create board (id : ${board.boardId})`, data: board.toJSON() })
        } catch (err: any) {
            throw new InternalError({ error: err })
        }
    }

}