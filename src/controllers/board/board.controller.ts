import { Request, Response } from "express";

import BoardService from "@services/board/board.service";
import * as dto from "@controllers/board/dto/board.dto";
import { sendJSONResponse } from "@utils/response";
import { handleError } from "@errors/handler";

export default class BoardController {
    private boardService: BoardService;

    constructor() {
        this.boardService = new BoardService()
    }

    getBoardList = async (req: Request, res: Response) => {
        try {
            const boards = await this.boardService.getBoardList();
            const boardsJSON = boards.map(board => board.toJSON());
            sendJSONResponse(res, "success get boards", boardsJSON)
        } catch (err: any) {
            throw handleError(err)
        }
    }

    getBoard = async (req: Request, res: Response) => {
        const boardId = req.params.id;
        try {
            const board = await this.boardService.getBoard(boardId);
            sendJSONResponse(res, "success get board", board.toJSON())
        } catch (err: any) {
            throw handleError(err)
        }
    }

    deleteBoard = async (req: Request, res: Response) => {
        const boardId = req.params.id;
        try {
            await this.boardService.deleteBoard(boardId);
            sendJSONResponse(res, "success delete board", true)
        } catch (err: any) {
            throw handleError(err)
        }
    }

    createBoard = async (req: Request, res: Response) => {
        const body: dto.CreateBoardReqDTO = req.body;
        try {
            const board = await this.boardService.createBoard(body)
            sendJSONResponse(res, `success create board (id : ${board.boardId})`, board.toJSON())
        } catch (err: any) {
            throw handleError(err)
        }
    }

}