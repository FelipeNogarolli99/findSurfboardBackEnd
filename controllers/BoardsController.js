const Board = require("../models/Board")

//helpers
const getToken = require("../helpers/get-token")
const getUserByToken = require("../helpers/get-user-by-token")
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class BoardsController{

    //create a board
    static async create(req,res){
        const {name , volum, size, color, mark, model } = req.body
        const images = req.files
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
        if(images.length === 0){
            res.status(422).json ({message: "A Imagem é obrigatória"})
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
            images: [],
            user: {

                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone,

            }
        })

        images.map((image) =>{
            board.images.push(image.filename)
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

    static async getAll(req, res){

        const boards = await Board.find().sort("-createdAt")

        res.status(200).json({board: boards,

        })
    }

    static async getAllUserBoards(req, res){

        //get user from token
        const token = getToken(req)
        const user = await getUserByToken(token)

        const boards = await Board.find({'user._id' : user._id }).sort("-createdAt")

        res.status(200).json({
            boards,
        })
    }

    static async getAllUserRental(req, res){
        //get user from token
        const token = getToken(req)
        const user = await getUserByToken(token)
    
        const boards = await Board.find({'rental._id' : user._id }).sort("-createdAt")
    
        res.status(200).json({
            boards,
        })
    }

    static async getBoardById(req, res){

       const id = req.params.id 

       if(!ObjectId.isValid(id)){
        res.status(422).json ({message: "ID invalido"})
            return
       }
       
       //check if board exists
       const board = await Board.findOne({_id: id})

       if(!board){
        res.status(404).json({ message: 'Prancha não encontrada!'})
       }

       res.status(200).json({
        board: board,
       })
    }

    static async removeBoardById(req, res) {
        const id = req.params.id;
    
        // Verifica se o ID é válido
        if (!ObjectId.isValid(id)) {
            return res.status(422).json({ message: "ID inválido" });
        }
    
        // Verifica se a prancha existe
        const board = await Board.findOne({ _id: id });
        if (!board) {
            return res.status(404).json({ message: 'Prancha não encontrada!' });
        }
    
        // Verifica se o usuário logado registrou a prancha
        const token = getToken(req);
        const user = await getUserByToken(token);
    
        if (board.user._id.toString() !== user._id.toString()) {
            return res.status(422).json({ message: 'Houve um problema, tente novamente mais tarde' });
        }
    
        // Remove a prancha
        await Board.findByIdAndDelete(id);
    
        return res.status(200).json({ message: "Prancha removida com sucesso" });
    }
    
    static async updateBoard(req, res){
        const id = req.params.id // recebe da URL
    
        const {name , volum, size, color, mark, model , available } = req.body
        const images = req.files

        const updateData= {}

         //check if board exists
       const board = await Board.findOne({_id: id})

       if(!board){
        res.status(404).json({ message: 'Prancha não encontrada!'})
            return
       }

         // Verifica se o usuário logado registrou a prancha
         const token = getToken(req);
         const user = await getUserByToken(token);
     
         if (board.user._id.toString() !== user._id.toString()) {
             return res.status(422).json({ 
                message: 'Houve um problema, tente novamente mais tarde'
            });
            return
         }

         //validations
        if(!name){
            res.status(422).json ({message: "O nome é obrigatório"})
            return
        }else{
            updateData.name= name
        }
        if(!volum){
            res.status(422).json ({message: "O volume é obrigatório"})
            return
        }else{
            updateData.volum= volum
        }
        if(!size){
            res.status(422).json ({message: "O tamanho é obrigatório"})
            return
        }else{
            updateData.size= size
        }
        if(!color){
            res.status(422).json ({message: "A cor é obrigatório"})
            return
        }else{
            updateData.color= color
        }
        if(!mark){
            res.status(422).json ({message: "A marca é obrigatório"})
            return
        }else{
            updateData.mark= mark
        }
        if(!model){
            res.status(422).json ({message: "O modelo é obrigatório"})
            return
        }else{
            updateData.model= model
        }
        if(images.length === 0){
            res.status(422).json ({message: "A Imagem é obrigatória"})
            return
        }else{
            updateData.images= []
            images.map((image) =>{
               updateData.images.push(image.filename) 
            })
        }

        await Board.findByIdAndUpdate(id, updateData)

        res.status(200).json({
            message: "A prancha vai atualizada com sucesso"
        })

    }

    static async schedule(req, res){
        const id = req.params.id

        //check if board exists
        const board = await Board.findOne({_id: id})

        if(!board){
         res.status(404).json({ message: 'Prancha não encontrada!'})
        }

        //check if user registered boards
        const token = getToken(req);
        const user = await getUserByToken(token);
     
         if (board.user._id.equals(user._id)) {
              res.status(422).json({ 
                message: 'Voce não pode agendar visita da sua propria prancha! '
            });
            return
         }

         //check if user has already scheduled a visit

         if(board.rental){
            if(board.rental._id.equals(user._id)){
                return res.status(422).json({ 
                    message: 'Voce já agendou uma visita para essa prancha! '
                });
                return

            }
         }

         //add usert to board

         board.rental = {
            _id: user._id,
            name: user.name,
            image: user.image
         }

         await Board.findByIdAndUpdate(id, board)

         res.status(200).json({
            message: `A visita foi agendada com sucesso, entre em contato com o ${board.user.name} pelo telefone ${board.user.phone}`
         })

    }

    static async concludeRental(req, res){
        const id= req.params.id

        const board = await Board.findOne({_id: id})

        if(!board){
         res.status(404).json({ message: 'Prancha não encontrada!'})
        }

        board.available= false

        await board.findByIdAndUpdate(id, board)
        
        res.status(200).json({
            board: board,
            message: `Parabéns! O ciclo de adoção foi finalizado com sucesso!`,
          })

    }
    
}
