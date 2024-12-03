const router = require("express").Router()

const BoardsController = require("../controllers/BoardsController")

//middlewares
const verifyToken = require("../helpers/verify-token")
const {imageUpload} = require("../helpers/image-upload")
const Board = require("../models/Board")

router.post("/create", verifyToken, imageUpload.array('images'), BoardsController.create)

router.get("/" ,BoardsController.getAll )
router.get("/myboards", verifyToken, BoardsController.getAllUserBoards) 
router.get("/myrental", verifyToken, BoardsController.getAllUserRental) 
router.get("/:id", BoardsController.getBoardById)
router.delete("/:id", verifyToken, BoardsController.removeBoardById)
router.patch('/:id', verifyToken, imageUpload.array('images'), BoardsController.updateBoard)
router.patch("/schedule/:id", verifyToken, BoardsController.schedule)
router.patch("conclude/:id" , verifyToken, BoardsController.concludeRental)
module.exports = router