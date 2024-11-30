const Board = require("../models/Board")

//helpers
const getToken = require("../helpers/get-token")
const getUserByToken = require("../helpers/get-user-by-token")

module.exports = class BoardsController{

    //create a board
    static async create(req,res){
        const {name , volum, size, color, mark, model } = req.body
        const available = true

        //upload images

        //validations
        if(!name){
            res.status(422).json ({message: "O nome é obrigatório"})
            return
        }
        if(!volum){
            res.status(422).json ({message: "O volume é obrigatório"})
            return
        }
        if(!size){
            res.status(422).json ({message: "O tamanho é obrigatório"})
            return
        }
        if(!color){
            res.status(422).json ({message: "A cor é obrigatório"})
            return
        }
        if(!mark){
            res.status(422).json ({message: "A marca é obrigatório"})
            return
        }
        if(!model){
            res.status(422).json ({message: "O modelo é obrigatório"})
            return
        }
    
        //get board owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        //create a board
        const board = new Board({
            name,
            volum,
            size,
            color,
            mark,
            model,
            available,
            image: [],
            user: {

                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,

            }
        })

        try {
            const newBoard = await board.save()
            res.status(201).json({
                message: "Prancha cadastrada com sucesso! ",
                newBoard,
            })
            
        } catch (error) {
            res.status(500).json({message: error})
        }
    }
}