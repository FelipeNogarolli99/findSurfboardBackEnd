const router = require("express").Router()

const BoardsController = require("../controllers/BoardsController")

//middlewares
const verifyToken = require("../helpers/verify-token")

router.post("/create", verifyToken, BoardsController.create)

module.exports = router