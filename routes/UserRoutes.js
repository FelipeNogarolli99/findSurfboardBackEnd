const router = require("express").Router()

const UserController = require("../controllers/UserController")

//middleware
const varifyToken = require("../helpers/verify-token.js")
const {imageUpload} = require("../helpers/image-upload.js") 

router.post("/register" , UserController.register)
router.post("/login" , UserController.login)
router.get("/checkuser" , UserController.checkUser)
router.get("/:id", UserController.getUserById)
router.patch("/edit/:id" , varifyToken, imageUpload.single("image"), UserController.editUser)

module.exports = router