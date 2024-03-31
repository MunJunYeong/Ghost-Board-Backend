import { Router } from "express";

import BoardController from "@controllers/board/board.controller";
import { validationMiddleware } from "@middlewares/requestValidate";
import * as dto from "@controllers/board/dto/board.dto";

class BoardRoutes {
    router = Router();
    controller = new BoardController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        const prefix = "/boards";

        this.router.post(`${prefix}`, validationMiddleware(dto.CreateBoardReqDTO), this.controller.createBoard);
        this.router.get(`${prefix}`, this.controller.getBoardList);
        this.router.get(`${prefix}/:boardId`, this.controller.getBoard);
        this.router.delete(`${prefix}/:boardId`, this.controller.deleteBoard);
    }
}

export default new BoardRoutes().router;
