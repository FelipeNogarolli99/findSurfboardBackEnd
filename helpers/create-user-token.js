const jwt = require('jsonwebtoken')
const { use } = require('../routes/UserRoutes')

const createUserToken = async (user, req, res ) => {

    //create o token
    const token = jwt.sign({
        name:user.name,
        id: user._id

    }, "nossosecret")  //chave do jwt, criação do token

    //return token 
    //aqui é lido pelo front para poder fazer alguma coisa
    res.status(200).json({
        message: "Voce está autenticado",
        token: token,
        userId: user._id,
    })

}

module.exports = createUserToken