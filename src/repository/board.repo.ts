import Board from "@models/board"

export default class BoardRepo {
    constructor() { }

    createBoard = async (board: Board) => {
            return await Board.create({
                title: board.title,
                description: board.description,
            })
    }

    getBoardByID = async (id: any) => {
        return await Board.findOne({
            where: {
                boardId: id,
            },
        });
    }

    getBoardByTitle = async (title: string) => {
        return await Board.findOne({
            where: {
                title: title
            }
        })
    }

    getBoardList = async () => {
        return await Board.findAll();
    }

    deleteBoard = async (id: string) => {
        return await Board.destroy({
            where: {
                boardId: id,
            },
        });
    }
}