import Board from "@models/board";
import * as dto from "@controllers/board/dto/board.dto";

export const convCreateBoardToBoard = (boardDTO: dto.CreateBoardReqDTO): Board => {
    return new Board({
        description: boardDTO.description,
        title: boardDTO.title
    })

}