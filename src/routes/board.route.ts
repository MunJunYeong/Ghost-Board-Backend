import { Router } from "express";

import BoardController from "@controllers/board/board.controller";
import { validationMiddleware } from "@middlewares/requestValidate";
import * as dto from "@controllers/board/dto/board.dto"

class BoardRoutes {
    router = Router();
    controller = new BoardController();

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.post("/", validationMiddleware(dto.CreateBoardReqDTO), this.controller.createBoard);
        this.router.get("/", this.controller.getBoardList);
        this.router.get("/:id", this.controller.getBoard);
        this.router.delete("/:id", this.controller.deleteBoard);
    }
}

export default new BoardRoutes().router;
