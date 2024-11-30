const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

//helpers
const createUserToken = require("../helpers/create-user-token")
const getToken = require("../helpers/get-token")
const getUserByToken = require("../helpers/get-user-by-token")
const {imageUpload} = require('../helpers/image-upload')

module.exports = class UserController{
    static async register (req, res){
        // const name = req.body.name
        // const email = req.body.email
        // const phone = req.body.phone
        // const password = req.body.ṕassword
        // const confirmpassword= req.body
        //  podemos pegar essas informacoes e deixar dessa maneira aqui:
        const {name, email, phone, password, confirmpassword} = req.body

        //validations
        if(!name){
            res.status(422).json({message: "O nome é obrigatório"})
            return
        }
        if(!email){
            res.status(422).json({message: "O e-mail é obrigatório"})
            return
        }
        if(!phone){
            res.status(422).json({message: "O telefone é obrigatório"})
            return
        }
        if(!password){
            res.status(422).json({message: "A senha é obrigatório"})
            return
        }
        if(!confirmpassword){
            res.status(422).json({message: "A confirmação de senha é obrigatório"})
            return
        }

        if(password !== confirmpassword){
            res.status(422).json({message: "As senhas não são iguais"})
            return
        }

        //check if user exists
        const userExists = await User.findOne({email: email})

        if(userExists){
            res.status(422).json({message: "Por favor, utilize outro e-mail"})
            return
        }

         // create a password
        const salt = await bcrypt.genSalt(12) //12 caracters e mais para ficar mais dificil.
        const passwordHash = await bcrypt.hash(password, salt) //cria a senha codificada

        //create a user

        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: passwordHash

        })

        try {
            const newUser = await user.save()
            await createUserToken(newUser, req, res)  
        } catch (error) {
            res.status(500).json({message: error})
            
        }
    }

    static async login(req,res){
        const {email, password} = req.body
        if(!email){
            res.status(422).json({message: "O e-mail é obrigatório"})
            return
        }
        if(!password){
            res.status(422).json({message: "A senha é obrigatoria é obrigatório"})
            return
        }

        const user = await User.findOne({email: email})

        if(!user){
            res.status(422).json({message: "Não existe usuário cadastrado com este e-mail", })
            return
        }

        //check if passaword match with db passaworsd(bcrypt)

        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword){
            res.status(422).json({
                message: "Senha inválida",
            })
            return
        }

        await createUserToken(user, req, res)
            
    }

    static async checkUser(req, res){
        let currentUser

        if(req.headers.authorization){

            const token = getToken(req)
            const decoded = jwt.verify(token, "nossosecret")

            currentUser = await User.findById(decoded.id)
            currentUser.password = undefined

        }else{
            currentUser= null
        }

        res.status(200).send(currentUser)
    }

    static async getUserById(req, res){
        //id da requisição (URL), se fosse do body = req.body
        const id = req.params.id

        const user = await User.findById(id).select("-password")

        if(!user){
            res.status(422).json({
                message: "Usuario não encontrado",
            })
            return
        }

        res.status(200).json({user})
    }

    static async editUser(req, res){
        const id = req.params.id

        //check if user exists
        const token = getToken(req)
        const user = await getUserByToken(token)

        const {name, email, phone, password, confirmpassword} = req.body

        let image = ''

        if (req.file) {
          user.image = req.file.filename
        }
        if(!name){
            res.status(422).json({message: "O nome é obrigatório"})
            return
        }

        user.name = name

        if(!email){
            res.status(422).json({message: "O e-mail é obrigatório"})
            return
        }

        // verifica se o email está cadastrado
        const userExists = await User.findOne({email: email})

        if(user.email !== email && userExists){
            res.status(422).json({
                message: "Por favor, tente outro email ",
            })
            return
        }

        user.email = email

    
        if(!phone){
            res.status(422).json({message: "O telefone é obrigatório"})
            return
        }
        user.phone = phone

        if(password != confirmpassword){
            res.status(422).json({message: "As senhas não conferem!"})
            return
        } else if(password === confirmpassword && password != null){
            // create a password
            const salt = await bcrypt.genSalt(12) //12 caracters e mais para ficar mais dificil.
            const passwordHash = await bcrypt.hash(password, salt) //cria a senha codificada

            user.password = passwordHash
        }

        try {
            //returns user update data 
            await User.findByIdAndUpdate(
                {_id:user._id},
                {$set: user},
                {new: true},
            )
            res.status(200).json({
                message: "Atualizado com sucesso!",
            })

        } catch (error) {
            res.status(500).json({message: error})
            return
         }

       

        // if(!user){
        //     res.status(422).json({
        //         message: "Usuario não encontrado",
        //     })
        //     return
        // }
        
    }
}