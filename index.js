const express = require("express")
const cors = require("cors")

const app = express()

//config json response
app.use(express.json())

//solve cors
app.use(cors({credentials: true , origin: "http://localhost:3000"}))

// Public folder for images
app.use(express.static("public"))

//routes
const UserRoutes = require("./routes/UserRoutes")
const BoardRoutes = require("./routes/BoardRoutes")

app.use("/users", UserRoutes)
app.use("/boards", BoardRoutes)


app.listen(5000)