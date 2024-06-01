const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config()


const app = express()

const fileRoutes = require("./routes/file")
app.use(express.json());
// respond with "hello world" when a GET request is made to the homepage

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('hello world')
})

mongoose
.connect(process.env.MONGO_URI)
// .connect("mongodb://localhost:27017/jobApp")
.then(()=>console.log("Connection done"))
.catch((err)=>console.log("Error in connection"+err))

app.use(fileRoutes);

app.listen(8080,()=>{
    console.log("server started");
})