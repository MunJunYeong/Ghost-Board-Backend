import Board from "@models/board"

export default class BoardRepo {
    constructor() { }

    createBoard = async (board: Board) => {
        try {
            return await Board.create({
                title: board.title,
                description: board.description,
            })
        } catch (err) {
            throw err
        }
    }

    findBoardByID = async (id: string) => {
        return await Board.findOne({
            where: {
                boardId: id,
            },
        });
    }

    findBoardByTitle = async (title: string) => {
        return await Board.findOne({
            where: {
                title: title
            }
        })
    }

    findBoards = async () => {
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