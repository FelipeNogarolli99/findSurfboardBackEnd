const mongoose = require("mongoose")

async function main() {
    await mongoose.connect("mongodb://localhost:27017/getaboard")
    console.log("Conectou ao Monngoose!")
    
}

main().catch((err) => console.log(err))

module.exports = mongoose