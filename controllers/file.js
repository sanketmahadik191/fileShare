const multer = require("multer");
const path = require("path");
const FileModel = require("../model/File.Model");
const uploadStorePath = path.join(__dirname, "..", "store");
const shortid = require("shortid");
const nodemailer = require('nodemailer');

// to store file
const storage = multer.diskStorage({
  //deatication file path
  destination: (req, file, cb) => cb(null, uploadStorePath),
  //filename to save with cb(callback)
  filename: (req, file, cb) => {
    const fileName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 100) +
      path.extname(file.originalname);
    cb(null, fileName);
  },
});

// pass storage to store files in folederr
const upload = multer({
  storage: storage,
}).single("file"); //postman file key name

const uploadFile = async (req, res) => {
  upload(req, res, async (error) => {
    if (error) {
      console.log("eror in upload file" + error);
      return res.json({
        message: "error in file upload",
      });
    }
    console.log("file uploaded succesfully");

    const newFile = new FileModel({
      originalFilename: req.file.originalname,
      newFilename: req.file.filename,
      path: req.file.path,
      uuid: shortid.generate(),
    });

    const newlyFile = await newFile.save();
    res.json({
      message: "upload file",
      fileInfo: newFile,
    });
  });
};

const genrateDynamicLink = async (req, res) => {
  try {
    const filed = req.params.uuid;
    const file = await FileModel.findOne({ uuid: filed });

    if (!file) {
      return res.status(404).send("File not found");
    }
    res.json({
      file:file.path,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

const downloadFile = async (req, res) => {
  try {
    const filed = req.params.uuid;
    const file = await FileModel.findOne({uuid:filed});

    if (!file) {
      return res.status(404).json("File Not found");
    }
    console.log(file.path);
    res.download(file.path, file.originalFilename);
  } catch (error) {
    res.status(500).send(error);
  }
};

const sendFile = async (req, res) => {

  const { uuid, emailTo } = req.body;
  
  try{
    const file = await FileModel.findOne({ uuid });
    if (!file) {
        return res.status(404).send('File not found');
    }
     
    const transporter =await nodemailer.createTransport({
        service:'gmail',
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    console.log("44");
    const mailOptions = {
        name:'Sanket',
        from: process.env.EMAIL_USER,
        to: emailTo,
        subject: 'File Shared With You',
        text: `A file has been shared with you. You can download it using the following link: ${req.protocol}://${req.get('host')}/files/download/${uuid}`
    };
     console.log("45");
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.send('Email sent successfully');

  }catch (error) {
    res.status(500).json({ error: `Database error: ${error.message}` });
}


};

const fileController = {
  uploadFile,
  genrateDynamicLink,
  downloadFile,
  sendFile,
};

module.exports = fileController;


