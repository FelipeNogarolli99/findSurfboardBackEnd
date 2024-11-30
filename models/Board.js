const mongoose = require("../db/conn")
const {Schema} = mongoose

const Board = mongoose.model(
    "Board",
    new Schema(
        {
            name:{
                type: String,
                require: true
            },
            volum:{
                type: Number,
                required: true
            },
            size:{
                type: Number,
                required: true
            },
            color:{
               type: String,
               required: true 
            },
            mark:{
                type: String,
                required: true
            },
            model:{
                type: String,
                required: true
            },
            images: {
                type: Array,
                required: true
            },
            available:{
                type: Boolean
            },
            user: Object,
            landlord: Object
        },
        {timestamps: true},
    )
)

module.exports = Board