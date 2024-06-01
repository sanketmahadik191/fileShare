
const mongoose = require("mongoose");

const fileSchema =new mongoose.Schema({
    originalFilename:{
        type:String,
        required: true
    },
    newFilename:{
        type:String,
        required: true
    },
    path:{
        type:String,
        required: true
    },
    uuid:{
        type: String,
        required: true,
        unique: true
    }
});

const FileModel = mongoose.model("files",fileSchema);

module.exports =FileModel;